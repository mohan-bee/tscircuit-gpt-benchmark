import { readFileSync, writeFileSync } from "node:fs"
import { runAllRoutingChecks, runAllPlacementChecks } from "@tscircuit/checks"
const path = process.argv[2] ?? "dist/index/circuit.json"
const json = JSON.parse(readFileSync(path, "utf8"))
const started=Date.now()
const routing = await runAllRoutingChecks(json)
const placement = await runAllPlacementChecks(json)
const result={elapsedSeconds:(Date.now()-started)/1000,routing,placement}
writeFileSync(path.replace(/\.json$/, ".checks.json"), JSON.stringify(result,null,2))
console.log(JSON.stringify({elapsedSeconds:result.elapsedSeconds,routing:routing.length,placement:placement.filter(x=>x.type.includes("error")).length}))
for(const item of routing) console.log(item.message)
