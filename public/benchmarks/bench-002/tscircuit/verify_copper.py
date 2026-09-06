"""Independent geometric short and endpoint-connectivity audit of Circuit JSON.
Requires shapely. Does not import or invoke any CAD application.
"""
import json
import sys
from collections import defaultdict
from shapely.geometry import Point, Polygon, LineString, box
from shapely.affinity import rotate, translate
from shapely.ops import unary_union
from shapely.strtree import STRtree

data = json.load(open(sys.argv[1]))
by_id = {}
for e in data:
    if e.get(e["type"] + "_id"):
        by_id[e[e["type"] + "_id"]] = e
net_names = {e.get("subcircuit_connectivity_map_key"): e["name"] for e in data if e["type"] == "source_net"}

def net_of(e):
    if e.get("subcircuit_connectivity_map_key"):
        return e["subcircuit_connectivity_map_key"]
    for field in ["source_net_id", "source_trace_id", "source_port_id", "pcb_port_id", "pcb_trace_id"]:
        if e.get(field) in by_id and by_id[e[field]] is not e:
            found = net_of(by_id[e[field]])
            if found:
                return found
    return None

def pad_shape(e, drill=False):
    x, y = e["x"], e["y"]
    shape = e["shape"]
    if shape == "circular_hole_with_rect_pad":
        if drill:
            return Point(x+e.get("hole_offset_x",0),y+e.get("hole_offset_y",0)).buffer(e["hole_diameter"]/2,quad_segs=32)
        return translate(rotate(box(-e["rect_pad_width"]/2,-e["rect_pad_height"]/2,e["rect_pad_width"]/2,e["rect_pad_height"]/2),e.get("rect_ccw_rotation",0),origin=(0,0)),x,y)
    w = e.get("hole_width" if drill else "outer_width", e.get("width"))
    h = e.get("hole_height" if drill else "outer_height", e.get("height"))
    diameter = e.get("hole_diameter" if drill else "outer_diameter", e.get("radius", 0) * 2)
    if shape == "circle":
        return Point(x, y).buffer(diameter / 2, quad_segs=32)
    if shape in ["rect", "rotated_rect"]:
        geom = box(-w/2, -h/2, w/2, h/2)
    elif shape in ["pill", "rotated_pill"]:
        radius = min(w, h) / 2
        dx, dy = max(0, w/2-radius), max(0, h/2-radius)
        geom = LineString([(-dx, -dy), (dx, dy)]).buffer(radius, quad_segs=32)
    else:
        raise ValueError(f"Unsupported pad geometry: {shape}")
    return translate(rotate(geom, e.get("ccw_rotation", 0), origin=(0,0)), x, y)

items = []
def add(e, layer, geometry, port=None):
    if geometry.is_empty:
        return
    if not geometry.is_valid:
        raise ValueError(f"Invalid copper polygon: {e}")
    ident = e[e["type"] + "_id"]
    items.append(dict(id=ident, layer=layer, geom=geometry, net=net_of(e) or f"unconnected:{ident}", port=port))

for e in data:
    kind = e["type"]
    if kind == "pcb_smtpad":
        add(e, e["layer"], pad_shape(e), e.get("pcb_port_id"))
    elif kind == "pcb_plated_hole":
        g = pad_shape(e).difference(pad_shape(e, drill=True))
        for layer in e["layers"]:
            add(e, layer, g, e.get("pcb_port_id"))
    elif kind == "pcb_via":
        g = Point(e["x"], e["y"]).buffer(e["outer_diameter"]/2, quad_segs=32).difference(Point(e["x"],e["y"]).buffer(e["hole_diameter"]/2, quad_segs=32))
        for layer in e["layers"]:
            add(e, layer, g)
    elif kind == "pcb_trace":
        layers = defaultdict(list)
        for a, b in zip(e["route"], e["route"][1:]):
            if a["route_type"] == b["route_type"] == "wire" and a["layer"] == b["layer"]:
                width = min(a["width"], b["width"])
                layers[a["layer"]].append(LineString([(a["x"],a["y"]),(b["x"],b["y"])]).buffer(width/2,quad_segs=32))
        for layer, shapes in layers.items():
            add(e, layer, unary_union(shapes))
    elif kind == "pcb_copper_pour":
        if e["shape"] != "brep":
            raise ValueError("Unsupported pour format")
        def ring(r):
            return [(v["x"],v["y"]) for v in r["vertices"]]
        b = e["brep_shape"]
        add(e,e["layer"],Polygon(ring(b["outer_ring"]),[ring(r) for r in b["inner_rings"]]))

parent = list(range(len(items)))
def root(i):
    while parent[i] != i:
        parent[i] = parent[parent[i]]
        i = parent[i]
    return i
def join(a,b):
    parent[root(a)] = root(b)

through = {}
for i, item in enumerate(items):
    kind = by_id[item["id"]]["type"]
    if kind in ["pcb_via", "pcb_plated_hole"]:
        if item["id"] in through:
            join(i,through[item["id"]])
        through[item["id"]] = i

shorts = []
for layer in ["top","bottom"]:
    indices = [i for i,e in enumerate(items) if e["layer"]==layer]
    tree = STRtree([items[i]["geom"] for i in indices])
    for local_i,i in enumerate(indices):
        a = items[i]
        for local_j in tree.query(a["geom"].buffer(1e-6)):
            j = indices[local_j]
            if j <= i:
                continue
            b = items[j]
            if a["geom"].distance(b["geom"]) <= 1e-6:
                if a["net"] == b["net"]:
                    join(i,j)
                elif a["geom"].intersection(b["geom"]).area > 1e-8:
                    shorts.append(dict(layer=layer,a=a["id"],b=b["id"],net_a=net_names.get(a["net"],a["net"]),net_b=net_names.get(b["net"],b["net"])))

ports_by_net = defaultdict(lambda: defaultdict(set))
for i,item in enumerate(items):
    if item["port"] and not item["net"].startswith("unconnected:"):
        ports_by_net[item["net"]][root(i)].add(item["port"])
opens = []
for net,groups in ports_by_net.items():
    if len(groups)>1:
        opens.append(dict(net=net_names.get(net,net),separate_copper_groups=[sorted(v) for v in groups.values()]))

result = dict(copper_objects=len(items),nets_checked=len(ports_by_net),shorts=shorts,disconnected_nets=opens,
    method="Shapely copper polygons per layer; through-hole barrel connectivity; 1 nm contact tolerance. Trace width uses the smaller adjacent width. This audit complements tscircuit DRC.")
print(json.dumps(result,indent=2))
sys.exit(1 if shorts or opens else 0)
