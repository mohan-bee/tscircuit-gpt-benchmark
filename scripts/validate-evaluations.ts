import { readFile } from "node:fs/promises"
import { execFileSync } from "node:child_process"
import { join, resolve, sep } from "node:path"
import { definitionSchema, resultSchema } from "../src/evaluation/schema"
import { scoreResult } from "../src/evaluation/scoring"
import { hash, listFiles, readJson } from "./benchmark/files"
import { boardSchema, drcSchema, measure } from "./benchmark/measure"
const repository = process.cwd()
const versions = (await readJson(
  join(repository, "benchmarks/versions.json"),
)) as Record<string, string>
if (process.env.BENCHMARK_BASE_REF) {
  const baseRef = process.env.BENCHMARK_BASE_REF
  const tracked = execFileSync(
    "git",
    ["ls-tree", "--name-only", baseRef, "benchmarks/versions.json"],
    { encoding: "utf8" },
  ).trim()
  if (tracked) {
    const published = JSON.parse(
      execFileSync("git", ["show", baseRef + ":benchmarks/versions.json"], {
        encoding: "utf8",
      }),
    ) as Record<string, string>
    for (const [version, checksum] of Object.entries(published)) {
      if (versions[version] !== checksum)
        throw new Error(
          "Published benchmark versions are immutable: " + version,
        )
    }
  }
}
for (const [version, checksum] of Object.entries(versions)) {
  const contents = await readFile(
    join(repository, "benchmarks", version, "benchmark.json"),
    "utf8",
  )
  const definition = definitionSchema.parse(JSON.parse(contents))
  if (
    version !== definition.id + "/v" + definition.version ||
    hash(contents) !== checksum
  )
    throw new Error("Changed frozen benchmark: " + version)
}
const publicDirectory = join(repository, "public")
const resultFiles = (
  await listFiles(join(publicDirectory, "evaluations"))
).filter((file) => file.endsWith("/result.json"))
const ids = new Set<string>()
const platformPairs = new Map<string, Set<string>>()
for (const file of resultFiles) {
  const result = resultSchema.parse(await readJson(file))
  if (ids.has(result.id)) throw new Error("Duplicate evaluation id")
  ids.add(result.id)
  const pair = resolve(file, "../..")
  const platforms = platformPairs.get(pair) || new Set()
  platforms.add(result.platform)
  platformPairs.set(pair, platforms)
  const checksums = result.provenance.artifactHashes as Record<string, string>
  if (!checksums || typeof checksums !== "object")
    throw new Error("Missing artifact checksums")
  for (const url of Object.values(result.artifacts)) {
    const path = resolve(publicDirectory, "." + url)
    if (
      !url.startsWith("/evaluations/") ||
      !path.startsWith(publicDirectory + sep)
    )
      throw new Error("Unsafe artifact path")
    if (hash(await readFile(path)) !== checksums[url])
      throw new Error("Artifact changed: " + url)
  }
  const definitionUrl = result.artifacts["../../definition.json"]
  const definitionText = await readFile(
    join(publicDirectory, definitionUrl),
    "utf8",
  )
  const definition = definitionSchema.parse(JSON.parse(definitionText))
  if (
    result.benchmarkId !== definition.id ||
    result.benchmarkVersion !== definition.version
  )
    throw new Error("Result benchmark identity mismatch")
  if (
    hash(definitionText) !== result.definitionHash ||
    versions[definition.id + "/v" + definition.version] !==
      result.definitionHash
  )
    throw new Error("Definition hash mismatch")
  const protocol = await readJson(
    join(publicDirectory, result.artifacts["../../protocol.json"]),
  )
  if (hash(JSON.stringify(protocol)) !== result.protocolHash)
    throw new Error("Protocol hash mismatch")
  if (result.measurements) {
    const board = boardSchema.parse(
      await readJson(join(publicDirectory, result.artifacts["board.json"])),
    )
    const drc = drcSchema.parse(
      await readJson(join(publicDirectory, result.artifacts["drc.json"])),
    )
    if (
      JSON.stringify(measure({ definition, board, drc })) !==
      JSON.stringify(result.measurements)
    )
      throw new Error("Raw measurements do not match score inputs")
    for (const artifact of [
      "pcb.svg",
      "schematic.svg",
      "native/board.kicad_pcb",
      "native/board.kicad_sch",
    ]) {
      if (!result.artifacts[artifact])
        throw new Error("Missing rendered artifact: " + artifact)
    }
  }
  if (result.status === "failed" && (result.measurements || !result.error))
    throw new Error("Invalid failed result")
  if (result.status !== "failed" && !result.measurements)
    throw new Error("Missing measurements")
  const recomputed = scoreResult({
    definition,
    measurements: result.measurements,
  })
  if (JSON.stringify(recomputed) !== JSON.stringify(result.scores))
    throw new Error("Scores do not match raw inputs: " + file)
}
for (const platforms of platformPairs.values())
  if (platforms.size !== 2)
    throw new Error("Each model attempt needs both platform results")
console.log(
  "Validated " +
    resultFiles.length +
    " scored evaluations and " +
    Object.keys(versions).length +
    " frozen definitions.",
)
