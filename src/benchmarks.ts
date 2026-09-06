export type PlatformName = "tscircuit" | "KiCad"

export type AvailablePlatformOutput = {
  name: PlatformName
  status: "available"
  circuitJson?: string
  pcb: string
  pcbLayers?: {
    top: string
    bottom: string
  }
  schematic: string
  pcbSource: string
  schematicSource: string
  renderer: string
  activeTime?: string
  timingBreakdown?: Array<{ stage: string; duration: string; elapsed: string }>
  boardDetails?: string
  boardFeatures?: string
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
  visible: boolean
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

  let timingBreakdown: AvailablePlatformOutput["timingBreakdown"]
  if (value.timingBreakdown !== undefined) {
    if (!Array.isArray(value.timingBreakdown) || value.timingBreakdown.length === 0) {
      throw new Error(`${file}: timingBreakdown must be a non-empty array`)
    }
    timingBreakdown = value.timingBreakdown.map((item) => {
      if (!isRecord(item)) throw new Error(`${file}: each timingBreakdown item must be an object`)
      return {
        stage: requiredString(item, "stage", file),
        duration: requiredString(item, "duration", file),
        elapsed: requiredString(item, "elapsed", file),
      }
    })
  }

  let pcbLayers: AvailablePlatformOutput["pcbLayers"]
  if (value.pcbLayers !== undefined) {
    if (name !== "KiCad" || !isRecord(value.pcbLayers)) {
      throw new Error(`${file}: pcbLayers must be a KiCad layer map`)
    }
    pcbLayers = {
      top: requiredString(value.pcbLayers, "top", file),
      bottom: requiredString(value.pcbLayers, "bottom", file),
    }
  }

  return {
    name,
    status: "available",
    circuitJson: typeof value.circuitJson === "string" && value.circuitJson.trim() !== "" ? value.circuitJson : undefined,
    pcb: requiredString(value, "pcb", file),
    pcbLayers,
    schematic: requiredString(value, "schematic", file),
    pcbSource: requiredString(value, "pcbSource", file),
    schematicSource: requiredString(value, "schematicSource", file),
    renderer: requiredString(value, "renderer", file),
    activeTime: value.activeTime === undefined ? undefined : requiredString(value, "activeTime", file),
    timingBreakdown,
    boardDetails: value.boardDetails === undefined ? undefined : requiredString(value, "boardDetails", file),
    boardFeatures: value.boardFeatures === undefined ? undefined : requiredString(value, "boardFeatures", file),
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
    visible: value.visible !== false,
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
