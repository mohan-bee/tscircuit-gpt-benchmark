import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { convertCircuitJsonToInputProblem, CopperPourPipelineSolver, initializeManifoldGeometry } from "@tscircuit/copper-pour-solver"
import { runAllRoutingChecks, runAllPlacementChecks, runAllNetlistChecks, runAllSchematicChecks } from "@tscircuit/checks"
import { convertCircuitJsonToPcbSvg, convertCircuitJsonToSchematicSvg } from "circuit-to-svg"
import { convertCircuitJsonToGerberFiles } from "circuit-json-to-gerber"
import { Resvg } from "@resvg/resvg-js"
import { convertCircuitJsonToPickAndPlaceCsv } from "circuit-json-to-pnp-csv"

const existing = process.argv.includes("--existing")
const json: any[] = JSON.parse(readFileSync(existing ? "release/robot.circuit.json" : "dist/checked/circuit.json", "utf8")).filter((e:any) => (existing || e.type !== "pcb_copper_pour") && !e.type.includes("error") && !e.type.includes("warning"))
for (const e of json) if(e.type === "pcb_trace") for(const p of e.route) delete p.is_inside_copper_pour
const ground = json.find(e => e.type === "source_net" && e.name === "GND")
const outline = [{x:-32,y:-25},{x:32,y:-25},{x:32,y:25},{x:-32,y:25}]
const regions = (["top","bottom"] as const).map(layer => ({layer, source_net_id:ground.source_net_id,subcircuit_id:ground.subcircuit_id,pad_margin:.2,trace_margin:.2,pour_margin:.2,board_edge_margin:.4,cutout_margin:.2,use_thermal_reliefs:true,thermal_relief_spoke_width:.3,outline}))
if (!existing) {
await initializeManifoldGeometry()
const solver = new CopperPourPipelineSolver(convertCircuitJsonToInputProblem(json,regions))
const pours=solver.getOutput().brep_shapes_by_region
for(let i=0;i<2;i++) for(const brep of pours[i] ?? []) json.push({type:"pcb_copper_pour",pcb_copper_pour_id:`final_pour_${i}_${json.length}`,shape:"brep",layer:regions[i]!.layer,source_net_id:ground.source_net_id,subcircuit_id:ground.subcircuit_id,brep_shape:brep,covered_with_solder_mask:true})
}
const checks={netlist:await runAllNetlistChecks(json),schematic:await runAllSchematicChecks(json),placement:await runAllPlacementChecks(json),routing:await runAllRoutingChecks(json)}
mkdirSync("release",{recursive:true})
writeFileSync("release/checks.json",JSON.stringify(checks,null,2))
writeFileSync("release/robot.circuit.json",JSON.stringify(json,null,2))
console.log(Object.fromEntries(Object.entries(checks).map(([k,v])=>[k,v.length])))
for(const layer of ["top","bottom"] as const){
 const svg=convertCircuitJsonToPcbSvg(json,{layer,width:1800,height:1406,showSolderMask:true,showSolderPaste:false,showCourtyards:false,showPinNumbers:false,shouldDrawErrors:true,drawPaddingOutsideBoard:true})
 writeFileSync(`release/pcb-${layer}.svg`,svg)
 writeFileSync(`release/pcb-${layer}.png`,new Resvg(svg).render().asPng())
}
const sch=convertCircuitJsonToSchematicSvg(json,{width:2400,height:2600})
writeFileSync("release/schematic.svg",sch)
writeFileSync("release/schematic.png",new Resvg(sch).render().asPng())
mkdirSync("release/gerbers",{recursive:true})
for(const [name,data] of Object.entries(convertCircuitJsonToGerberFiles(json)))writeFileSync(`release/gerbers/${name}`,data)
writeFileSync("release/pour-input.json",JSON.stringify(convertCircuitJsonToInputProblem(json,regions)))
writeFileSync("release/pick-and-place.csv",convertCircuitJsonToPickAndPlaceCsv(json))
