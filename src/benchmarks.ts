export type PlatformName = "tscircuit" | "KiCad"

export type AvailablePlatformOutput = {
  name: PlatformName
  status: "available"
  pcb: string
  schematic: string
  pcbSource: string
  schematicSource: string
  renderer: string
}

export type PendingPlatformOutput = {
  name: PlatformName
  status: "pending"
}

export type PlatformOutput = AvailablePlatformOutput | PendingPlatformOutput

export type BenchmarkRun = {
  id: string
  model: string
  complexity: string
  circuit: string
  prompt: string
  components: number
  boardSize: string
  platforms: PlatformOutput[]
}

const benchmarkModules = import.meta.glob("./benchmarks/*/benchmark.json", {
  eager: true,
  import: "default",
}) as Record<string, unknown>

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function requiredString(object: Record<string, unknown>, field: string, file: string) {
  const value = object[field]
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${file}: ${field} must be a non-empty string`)
  }
  return value
}

function parsePlatform(value: unknown, file: string): PlatformOutput {
  if (!isRecord(value)) throw new Error(`${file}: each platform must be an object`)
  const name = requiredString(value, "name", file)
  if (name !== "tscircuit" && name !== "KiCad") {
    throw new Error(`${file}: platform name must be tscircuit or KiCad`)
  }
  if (value.status === "pending") return { name, status: "pending" }

  return {
    name,
    status: "available",
    pcb: requiredString(value, "pcb", file),
    schematic: requiredString(value, "schematic", file),
    pcbSource: requiredString(value, "pcbSource", file),
    schematicSource: requiredString(value, "schematicSource", file),
    renderer: requiredString(value, "renderer", file),
  }
}

function parseRun(value: unknown, file: string): BenchmarkRun {
  if (!isRecord(value)) throw new Error(`${file}: benchmark must be an object`)
  if (!Array.isArray(value.platforms)) throw new Error(`${file}: platforms must be an array`)
  const platforms = value.platforms.map((platform) => parsePlatform(platform, file))
  const names = new Set(platforms.map(({ name }) => name))
  if (platforms.length !== 2 || names.size !== 2) {
    throw new Error(`${file}: include exactly one tscircuit and one KiCad platform`)
  }
  if (!Number.isInteger(value.components) || Number(value.components) < 1) {
    throw new Error(`${file}: components must be a positive integer`)
  }

  return {
    id: requiredString(value, "id", file),
    model: requiredString(value, "model", file),
    complexity: requiredString(value, "complexity", file),
    circuit: requiredString(value, "circuit", file),
    prompt: requiredString(value, "prompt", file),
    components: Number(value.components),
    boardSize: requiredString(value, "boardSize", file),
    platforms,
  }
}

export const benchmarkRuns = Object.entries(benchmarkModules)
  .map(([file, value]) => parseRun(value, file))
  .sort((a, b) => a.id.localeCompare(b.id))

const duplicateIds = benchmarkRuns.filter((run, index) => (
  benchmarkRuns.findIndex(({ id }) => id === run.id) !== index
))

if (duplicateIds.length > 0) {
  throw new Error(`Duplicate benchmark id: ${duplicateIds[0].id}`)
}
