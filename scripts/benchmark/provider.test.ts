// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest"
import { mkdtemp, readFile, rm } from "node:fs/promises"
import { join } from "node:path"
import { generate, responseSchema } from "./provider"
import { definitionSchema } from "../../src/evaluation/schema"
import rawDefinition from "../../benchmarks/rc-filter/v1/benchmark.json"
const definition = definitionSchema.parse(rawDefinition)
afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})
it("sends identical prompts and settings to each model and saves responses", async () => {
  const directory = await mkdtemp(join(process.cwd(), "work/provider-test-"))
  try {
    vi.stubEnv("TEST_BENCH_KEY", "secret")
    const response = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              files: {
                "index.circuit.tsx": "tsx",
                "board.kicad_pcb": "pcb",
                "board.kicad_sch": "sch",
              },
            }),
          },
        },
      ],
    }
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => response })
    vi.stubGlobal("fetch", fetchMock)
    for (const name of ["model-a", "model-b"])
      await generate({
        model: {
          name,
          implementation: "v1",
          endpoint: "https://example.invalid",
          apiKeyEnv: "TEST_BENCH_KEY",
        },
        definition,
        output: join(directory, name + ".json"),
      })
    const first = JSON.parse(fetchMock.mock.calls[0][1].body)
    const second = JSON.parse(fetchMock.mock.calls[1][1].body)
    expect(first.messages).toEqual([
      { role: "user", content: definition.prompt },
    ])
    expect({ ...first, model: second.model }).toEqual(second)
    expect(
      JSON.parse(await readFile(join(directory, "model-a.json"), "utf8")),
    ).toEqual(response)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
it("rejects extra files and missing native outputs", () => {
  expect(
    responseSchema.safeParse({ files: { "../escape": "bad" } }).success,
  ).toBe(false)
  expect(
    responseSchema.safeParse({
      files: {
        "index.circuit.tsx": "tsx",
        "board.kicad_pcb": "pcb",
        "board.kicad_sch": "sch",
        "script.sh": "bad",
      },
    }).success,
  ).toBe(false)
})
