import { z } from "zod"
import type { Definition } from "../../src/evaluation/schema"
import { writeJson } from "./files"
export const modelSchema = z
  .object({
    name: z.string().min(1),
    implementation: z.string().min(1),
    endpoint: z.string().url(),
    apiKeyEnv: z.string().min(1),
  })
  .strict()
export type Model = z.infer<typeof modelSchema>
export const responseSchema = z
  .object({
    files: z
      .object({
        "index.circuit.tsx": z.string().min(1),
        "board.kicad_pcb": z.string().min(1),
        "board.kicad_sch": z.string().min(1),
      })
      .strict(),
  })
  .strict()
async function request({
  model,
  messages,
  generation,
}: {
  model: Model
  messages: unknown[]
  generation: Definition["generation"]
}) {
  const key = process.env[model.apiKeyEnv]
  if (!key)
    throw new Error("Missing API key environment variable: " + model.apiKeyEnv)
  const response = await fetch(model.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + key,
    },
    body: JSON.stringify({
      model: model.name,
      messages,
      temperature: generation.temperature,
      seed: generation.seed,
      max_tokens: generation.maxTokens,
    }),
    signal: AbortSignal.timeout(180_000),
  })
  if (!response.ok)
    throw new Error("Model request failed with HTTP " + response.status)
  return z
    .object({
      choices: z
        .array(z.object({ message: z.object({ content: z.string() }) }))
        .nonempty(),
    })
    .passthrough()
    .parse(await response.json())
}
export async function generate({
  model,
  definition,
  output,
}: {
  model: Model
  definition: Definition
  output: string
}) {
  const response = await request({
    model,
    messages: [{ role: "user", content: definition.prompt }],
    generation: definition.generation,
  })
  await writeJson(output, response)
  return responseSchema.parse(JSON.parse(response.choices[0].message.content))
}
