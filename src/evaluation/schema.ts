import { z } from "zod"
const count = z.number().int().nonnegative()
const identifier = z.string().regex(/^[a-z0-9][a-z0-9-]*$/)
export const platformSchema = z.enum(["tscircuit", "kicad"])
const pin = z
  .object({ reference: z.string().min(1), pin: z.string().min(1) })
  .strict()
export const metricNames = [
  "drcErrors",
  "unroutedNets",
  "componentOverlaps",
  "missingConnections",
  "components",
  "boardDimensions",
  "traceClearance",
  "routingCompletion",
] as const
export const definitionSchema = z
  .object({
    id: identifier,
    version: z.number().int().positive(),
    title: z.string().min(1),
    prompt: z.string().min(1),
    requirements: z
      .object({
        components: z
          .array(
            z
              .object({
                reference: z.string().min(1),
                allowedValues: z.array(z.string()).nonempty(),
              })
              .strict(),
          )
          .nonempty(),
        nets: z
          .array(
            z
              .object({
                name: z.string().min(1),
                pins: z.array(pin).nonempty(),
              })
              .strict(),
          )
          .nonempty(),
        widthMm: z.number().positive(),
        heightMm: z.number().positive(),
        toleranceMm: z.number().nonnegative(),
        clearanceMm: z.number().positive(),
        layers: z.number().int().positive(),
      })
      .strict(),
    scoring: z
      .object({
        version: z.literal(1),
        weights: z
          .object(
            Object.fromEntries(
              metricNames.map((name) => [name, z.number().nonnegative()]),
            ) as Record<(typeof metricNames)[number], z.ZodNumber>,
          )
          .strict(),
        regressionThreshold: z.number().nonnegative(),
      })
      .strict(),
    generation: z
      .object({
        temperature: z.number().min(0).max(2),
        seed: count,
        maxTokens: z.number().int().positive(),
      })
      .strict(),
  })
  .strict()
  .superRefine((definition, context) => {
    if (
      Object.values(definition.scoring.weights).reduce(
        (sum, weight) => sum + weight,
        0,
      ) !== 100
    )
      context.addIssue({
        code: "custom",
        message: "Objective weights must total 100",
      })
    const references = definition.requirements.components.map(
      (component) => component.reference,
    )
    const pins = definition.requirements.nets.flatMap((net) =>
      net.pins.map((terminal) => JSON.stringify(terminal)),
    )
    if (
      new Set(references).size !== references.length ||
      new Set(pins).size !== pins.length
    )
      context.addIssue({
        code: "custom",
        message: "Component references and required pins must be unique",
      })
    for (const net of definition.requirements.nets)
      for (const terminal of net.pins) {
        if (!references.includes(terminal.reference))
          context.addIssue({
            code: "custom",
            message: "Net references an undeclared component",
          })
      }
  })
export type Definition = z.infer<typeof definitionSchema>
export const measurementsSchema = z
  .object({
    drcErrors: count,
    unroutedNets: count,
    componentOverlaps: count,
    missingConnections: count,
    incorrectComponents: count,
    unexpectedComponents: count,
    widthMm: z.number().positive(),
    heightMm: z.number().positive(),
    layers: count,
    clearanceViolations: count,
    requiredClearanceMm: z.number().positive(),
    requiredConnections: count,
    completedConnections: count,
  })
  .strict()
  .refine(
    (measurements) =>
      measurements.completedConnections <= measurements.requiredConnections,
    "Completed connections cannot exceed required connections",
  )
export type Measurements = z.infer<typeof measurementsSchema>
const scoreSchema = z.object({
  metrics: z.array(
    z.object({
      name: z.enum(metricNames),
      score: z.number().nonnegative(),
      maximum: z.number().nonnegative(),
    }),
  ),
  total: z.number().min(0).max(100),
})
export const resultSchema = z
  .object({
    id: identifier,
    model: z.string().min(1),
    implementation: z.string().min(1),
    createdAt: z.string().datetime(),
    benchmarkId: identifier,
    benchmarkVersion: z.number().int().positive(),
    definitionHash: z.string().length(64),
    protocolHash: z.string().length(64),
    platform: platformSchema,
    status: z.enum(["complete", "failed"]),
    error: z.string().optional(),
    measurements: measurementsSchema.nullable(),
    scores: scoreSchema,
    artifacts: z.record(z.string()),
    provenance: z.record(z.unknown()),
  })
  .strict()
export type EvaluationResult = z.infer<typeof resultSchema>
