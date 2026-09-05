import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises"
import { dirname, join, resolve, relative } from "node:path"
import { fileURLToPath } from "node:url"
import { randomUUID } from "node:crypto"
import { z } from "zod"
import {
  definitionSchema,
  resultSchema,
  type EvaluationResult,
} from "../../src/evaluation/schema"
import { scoreResult } from "../../src/evaluation/scoring"
import { build, kicadCli } from "./build"
import { command } from "./commands"
import { generate, modelSchema, responseSchema } from "./provider"
import { hash, listFiles, readJson, writeJson } from "./files"

const configSchema = z
  .object({
    benchmark: z.string(),
    models: z.array(modelSchema).nonempty(),
  })
  .strict()
export async function runBenchmark({
  configPath,
  replayPath,
}: {
  configPath: string
  replayPath?: string
}) {
  const repository = resolve(dirname(fileURLToPath(import.meta.url)), "../..")
  const config = configSchema.parse(await readJson(configPath))
  const definitionPath = resolve(dirname(configPath), config.benchmark)
  const definitionText = await readFile(definitionPath, "utf8")
  const definition = definitionSchema.parse(JSON.parse(definitionText))
  const definitionHash = hash(definitionText)
  const lock = JSON.parse(
    await readFile(join(repository, "benchmarks/versions.json"), "utf8"),
  )
  if (lock[definition.id + "/v" + definition.version] !== definitionHash)
    throw new Error("Definition is not frozen in benchmarks/versions.json")
  const batchId = randomUUID()
  const batch = join(repository, "public/evaluations", batchId)
  await mkdir(batch, { recursive: true })
  await writeFile(join(batch, "definition.json"), definitionText)
  const kicadVersion = await command({
    executable: kicadCli,
    args: ["--version"],
    cwd: repository,
    log: join(batch, "tools.log"),
  })
  const tscircuitVersion = await command({
    executable: join(repository, "node_modules/.bin/tsci"),
    args: ["--version"],
    cwd: repository,
    log: join(batch, "tools.log"),
  })
  const evaluatorFiles = [
    ...(await listFiles(join(repository, "scripts/benchmark"))),
    join(repository, "src/evaluation/schema.ts"),
    join(repository, "src/evaluation/scoring.ts"),
  ]
  const evaluatorHash = hash(
    (await Promise.all(evaluatorFiles.map((file) => readFile(file))))
      .map((contents) => hash(contents))
      .join("\n"),
  )
  const protocol = {
    evaluatorHash,
    lockHash: hash(await readFile(join(repository, "package-lock.json"))),
    kicadVersion,
    tscircuitVersion,
    nodeVersion: process.version,
    os: process.platform,
    architecture: process.arch,
    generation: definition.generation,
    mode: "api",
  }
  if (replayPath) protocol.mode = "replay"
  const protocolHash = hash(JSON.stringify(protocol))
  await writeJson(join(batch, "protocol.json"), protocol)
  let failed = false
  for (const model of config.models) {
    const modelId = randomUUID()
    const modelDirectory = join(batch, modelId)
    await mkdir(modelDirectory)
    await writeJson(join(modelDirectory, "request.json"), {
      model: model.name,
      prompt: definition.prompt,
      generation: definition.generation,
    })
    let response: z.infer<typeof responseSchema> | undefined
    let generationError: string | undefined
    try {
      if (replayPath) {
        await copyFile(replayPath, join(modelDirectory, "response.json"))
        response = responseSchema.parse(await readJson(replayPath))
      } else
        response = await generate({
          model,
          definition,
          output: join(modelDirectory, "response.json"),
        })
    } catch (error) {
      generationError = String(error)
    }
    for (const platform of ["tscircuit", "kicad"] as const) {
      const directory = join(modelDirectory, platform)
      await mkdir(directory)
      const result: EvaluationResult = {
        id: randomUUID(),
        model: model.name,
        implementation: model.implementation,
        createdAt: new Date().toISOString(),
        benchmarkId: definition.id,
        benchmarkVersion: definition.version,
        definitionHash,
        protocolHash,
        platform,
        status: "failed",
        measurements: null,
        scores: scoreResult({ definition, measurements: null }),
        artifacts: {},
        provenance: { ...protocol, model, replay: Boolean(replayPath) },
      }
      try {
        if (!response)
          throw new Error(generationError || "No generated response")
        let sourceFiles: (keyof typeof response.files)[] = [
          "board.kicad_pcb",
          "board.kicad_sch",
        ]
        if (platform === "tscircuit") sourceFiles = ["index.circuit.tsx"]
        for (const filename of sourceFiles)
          await writeFile(join(directory, filename), response.files[filename])
        result.measurements = await build({
          directory,
          platform,
          definition,
          repository,
        })
        result.status = "complete"
      } catch (error) {
        result.error = String(error)
        failed = true
      }
      result.scores = scoreResult({
        definition,
        measurements: result.measurements,
      })
      const artifactFiles = [
        ...(await listFiles(directory)),
        join(batch, "definition.json"),
        join(batch, "protocol.json"),
        join(modelDirectory, "request.json"),
      ]
      try {
        await readFile(join(modelDirectory, "response.json"))
        artifactFiles.push(join(modelDirectory, "response.json"))
      } catch {}
      const artifactHashes: Record<string, string> = {}
      for (const file of artifactFiles) {
        const url =
          "/" + relative(join(repository, "public"), file).split("\\").join("/")
        artifactHashes[url] = hash(await readFile(file))
        result.artifacts[relative(directory, file)] = url
      }
      result.provenance.artifactHashes = artifactHashes
      await writeJson(
        join(directory, "result.json"),
        resultSchema.parse(result),
      )
      console.log(
        model.name +
          " / " +
          platform +
          ": " +
          result.status +
          " (" +
          result.scores.total.toFixed(2) +
          "/100)",
      )
    }
  }
  console.log("Saved " + batch)
  if (failed) process.exitCode = 1
}
