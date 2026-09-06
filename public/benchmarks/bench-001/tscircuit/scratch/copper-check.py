import json
from collections import defaultdict
from shapely.geometry import Point, LineString, Polygon, box
from shapely.ops import unary_union
from shapely.affinity import rotate
from shapely.strtree import STRtree
d=json.load(open('release/robot.circuit.json'))
o=json.load(open('release/pour-input.json'))['pads']
def geom(p):
 s=p['shape']
 if s=='rect':
  b=p['bounds'];return box(b['minX'],b['minY'],b['maxX'],b['maxY'])
 if s=='circle':return Point(p['x'],p['y']).buffer(p['radius'],resolution=32)
 if s=='trace':return LineString([(v['x'],v['y']) for v in p['segments']]).buffer(p['width']/2,resolution=32)
 if s=='polygon':return Polygon([(v['x'],v['y']) for v in p['points']])
 w,h=p['width'],p['height'];x,y=p['x'],p['y']
 if s in ['pill','oval']:
  g=LineString([(x-(w-h)/2,y),(x+(w-h)/2,y)]).buffer(h/2,resolution=32) if w>h else LineString([(x,y-(h-w)/2),(x,y+(h-w)/2)]).buffer(w/2,resolution=32)
 else:g=box(x-w/2,y-h/2,x+w/2,y+h/2)
 return rotate(g,p.get('ccwRotation',0),origin=(x,y))
groups=defaultdict(list)
for p in o:groups[(p['layer'],p['connectivityKey'])].append(geom(p))
gnd=next(p['connectivityKey'] for p in o if p['connectivityKey'].endswith('net1'))
for p in d:
 if p['type']=='pcb_copper_pour':
  b=p['brep_shape'];groups[(p['layer'],gnd)].append(Polygon([(v['x'],v['y']) for v in b['outer_ring']['vertices']], [[(v['x'],v['y']) for v in r['vertices']] for r in b['inner_rings']]))
unions={k:unary_union(v) for k,v in groups.items()}
shorts=[]
for layer in ['top','bottom']:
 keys=[k for k in unions if k[0]==layer];shapes=[unions[k] for k in keys];tree=STRtree(shapes)
 for i,g in enumerate(shapes):
  for j in tree.query(g,predicate='intersects'):
   if j<=i:continue
   area=g.intersection(shapes[j]).area
   if area>1e-5:shorts.append(dict(layer=layer,nets=[keys[i][1],keys[j][1]],area_mm2=area))
polys=[];layers=[]
for layer in ['top','bottom']:
 g=unions[(layer,gnd)]
 for p in (g.geoms if hasattr(g,'geoms') else [g]):
  if p.area>1e-6:polys.append(p);layers.append(layer)
parent=list(range(len(polys)))
def root(i):
 while parent[i]!=i:parent[i]=parent[parent[i]];i=parent[i]
 return i
for p in o:
 if p['connectivityKey']!=gnd or not(p['shape']=='circle' or p.get('isPlatedHole')):continue
 g=geom(p);touch=[i for i,poly in enumerate(polys) if g.intersects(poly)]
 for i in touch[1:]:parent[root(i)]=root(touch[0])
islands=defaultdict(float)
for i,p in enumerate(polys):islands[root(i)]+=p.area
main=max(islands,key=islands.get)
main_shapes={layer:unary_union([p for i,p in enumerate(polys) if layers[i]==layer and root(i)==main]) for layer in ['top','bottom']}
disconnected_pads=[p['padId'] for p in o if p['connectivityKey']==gnd and (p.get('isSmtPad') or p.get('isPlatedHole')) and not geom(p).intersects(main_shapes[p['layer']])]
floating=[]
for p in d:
 if p['type']=='pcb_copper_pour':
  b=p['brep_shape'];g=Polygon([(v['x'],v['y']) for v in b['outer_ring']['vertices']], [[(v['x'],v['y']) for v in r['vertices']] for r in b['inner_rings']])
  if g.intersection(main_shapes[p['layer']]).area<1e-7:floating.append(p['pcb_copper_pour_id'])
result={'method':'Independent Shapely polygon intersections of copper pads, tracks, vias and regenerated ground pours; 32-segment circle approximation','shorts':shorts,'ground_connected_regions':len(islands),'disconnected_ground_pads':disconnected_pads,'floating_pour_ids':floating,'ground_region_areas_mm2':sorted(islands.values(),reverse=True)}
if not disconnected_pads and floating:
 json.dump([p for p in d if p.get('pcb_copper_pour_id') not in floating],open('release/robot.circuit.json','w'),indent=2)
json.dump(result,open('release/copper-check.json','w'),indent=2)
print(result)
