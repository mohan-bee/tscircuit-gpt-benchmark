import { parseArgs } from "node:util"
import { runBenchmark } from "./benchmark/run"
const { values } = parseArgs({
  options: { config: { type: "string" }, replay: { type: "string" } },
})
if (!values.config)
  throw new Error(
    "Usage: npm run benchmark -- --config models.json [--replay response.json]",
  )
await runBenchmark({ configPath: values.config, replayPath: values.replay })
