import rawDefinition from "../../benchmarks/rc-filter/v1/benchmark.json"
import {
  definitionSchema,
  measurementsSchema,
  type EvaluationResult,
} from "./schema"
import { scoreResult } from "./scoring"
const definition = definitionSchema.parse(rawDefinition)
const clean = measurementsSchema.parse({
  drcErrors: 0,
  unroutedNets: 0,
  componentOverlaps: 0,
  missingConnections: 0,
  incorrectComponents: 0,
  unexpectedComponents: 0,
  widthMm: 36,
  heightMm: 22,
  layers: 2,
  clearanceViolations: 0,
  requiredClearanceMm: 0.2,
  requiredConnections: 1,
  completedConnections: 1,
})
export function makeResult(
  overrides: Partial<EvaluationResult> = {},
): EvaluationResult {
  return {
    id: "baseline",
    model: "Model A",
    implementation: "original",
    createdAt: "2026-09-06T00:00:00.000Z",
    benchmarkId: definition.id,
    benchmarkVersion: 1,
    definitionHash: "a".repeat(64),
    protocolHash: "b".repeat(64),
    platform: "tscircuit",
    status: "complete",
    measurements: clean,
    scores: scoreResult({ definition, measurements: clean }),
    artifacts: { "pcb.svg": "/evaluations/test/pcb.svg" },
    provenance: {},
    ...overrides,
  }
}
