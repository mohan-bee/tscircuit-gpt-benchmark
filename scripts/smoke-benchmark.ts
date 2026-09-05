import { mkdir, readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { writeJson } from "./benchmark/files"
import { runBenchmark } from "./benchmark/run"
await mkdir("work", { recursive: true })
await writeJson("work/fixture-response.json", {
  files: {
    "index.circuit.tsx": await readFile(
      "public/examples/tscircuit/index.circuit.tsx",
      "utf8",
    ),
    "board.kicad_pcb": await readFile(
      "public/examples/kicad/rc-filter.kicad_pcb",
      "utf8",
    ),
    "board.kicad_sch": await readFile(
      "public/examples/kicad/rc-filter.kicad_sch",
      "utf8",
    ),
  },
})
await writeJson("work/fixture-config.json", {
  benchmark: "../src/evaluation/fixtures/rc-filter.json",
  models: [
    {
      name: "Existing RC fixture",
      implementation: "pipeline-smoke-test",
      endpoint: "https://example.invalid",
      apiKeyEnv: "UNUSED",
    },
  ],
})
await runBenchmark({
  configPath: resolve("work/fixture-config.json"),
  replayPath: resolve("work/fixture-response.json"),
})
