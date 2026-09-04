import { existsSync, readFileSync, readdirSync } from "node:fs"
import { dirname, extname, join, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const benchmarksDirectory = join(repositoryRoot, "src", "benchmarks")
const publicDirectory = join(repositoryRoot, "public")
const requiredRunStrings = ["id", "model", "complexity", "circuit", "prompt", "boardSize"]
const requiredPlatformStrings = ["name", "pcb", "schematic", "pcbSource", "schematicSource", "renderer"]
const allowedSnapshots = new Set([".png", ".svg"])

function fail(file, message) {
  throw new Error(`${file}: ${message}`)
}

function requireString(object, field, file) {
  if (typeof object[field] !== "string" || object[field].trim() === "") {
    fail(file, `${field} must be a non-empty string`)
  }
}

function publicFile(url, file, field) {
  if (!url.startsWith("/") || url.includes("..")) fail(file, `${field} must be a safe public URL`)
  const path = resolve(publicDirectory, url.slice(1))
  if (!path.startsWith(`${publicDirectory}${sep}`) || !existsSync(path)) {
    fail(file, `${field} does not exist: ${url}`)
  }
  return path
}

const files = readdirSync(benchmarksDirectory, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => join(benchmarksDirectory, entry.name, "benchmark.json"))

if (files.length === 0) fail(benchmarksDirectory, "no benchmark runs found")

const ids = new Set()
for (const file of files) {
  if (!existsSync(file)) fail(file, "missing benchmark.json")
  const run = JSON.parse(readFileSync(file, "utf8"))
  for (const field of requiredRunStrings) requireString(run, field, file)
  if (!/^[a-z0-9-]+$/.test(run.id)) fail(file, "id must use lowercase letters, numbers, and hyphens")
  if (ids.has(run.id)) fail(file, `duplicate id ${run.id}`)
  ids.add(run.id)
  if (!Number.isInteger(run.components) || run.components < 1) fail(file, "components must be a positive integer")
  if (!Array.isArray(run.platforms) || run.platforms.length !== 2) {
    fail(file, "platforms must contain exactly tscircuit and KiCad")
  }

  const names = new Set()
  for (const platform of run.platforms) {
    requireString(platform, "name", file)
    if (platform.name !== "tscircuit" && platform.name !== "KiCad") {
      fail(file, "platform name must be tscircuit or KiCad")
    }
    if (names.has(platform.name)) fail(file, `duplicate ${platform.name} platform`)
    names.add(platform.name)
    if (platform.status === "pending") {
      const extraFields = Object.keys(platform).filter((field) => field !== "name" && field !== "status")
      if (extraFields.length > 0) fail(file, `pending ${platform.name} platform must not include output files`)
      continue
    }
    if (platform.status !== undefined) fail(file, `${platform.name} platform status must be pending or omitted`)
    for (const field of requiredPlatformStrings.slice(1)) requireString(platform, field, file)

    const pcb = publicFile(platform.pcb, file, "pcb")
    const schematic = publicFile(platform.schematic, file, "schematic")
    const pcbSource = publicFile(platform.pcbSource, file, "pcbSource")
    const schematicSource = publicFile(platform.schematicSource, file, "schematicSource")
    if (!allowedSnapshots.has(extname(pcb)) || !allowedSnapshots.has(extname(schematic))) {
      fail(file, "snapshots must be SVG or PNG files")
    }
    if (platform.name === "tscircuit" && (extname(pcbSource) !== ".tsx" || extname(schematicSource) !== ".tsx")) {
      fail(file, "tscircuit sources must be TSX files")
    }
    if (platform.name === "KiCad" && (extname(pcbSource) !== ".kicad_pcb" || extname(schematicSource) !== ".kicad_sch")) {
      fail(file, "KiCad sources must be native .kicad_pcb and .kicad_sch files")
    }
  }

  if (names.size !== 2) fail(file, "platforms must contain exactly tscircuit and KiCad")
}

console.log(`Validated ${files.length} benchmark run${files.length === 1 ? "" : "s"}.`)
