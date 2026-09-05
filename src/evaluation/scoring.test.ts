import { describe, expect, it } from "vitest"
import rawDefinition from "../../benchmarks/rc-filter/v1/benchmark.json"
import {
  definitionSchema,
  measurementsSchema,
  type EvaluationResult,
} from "./schema"
import { compareResults, scoreResult } from "./scoring"
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
import { makeResult } from "./test-fixtures"
describe("automatic scoring", () => {
  it("gives a clean fully connected board 100 and a failed build zero", () => {
    expect(scoreResult({ definition, measurements: clean }).total).toBe(100)
    const failed = scoreResult({ definition, measurements: null })
    expect(failed.total).toBe(0)
    expect(failed.metrics.every((metric) => metric.score === 0)).toBe(true)
  })
  it("penalizes DRC, missing nets and incomplete routing separately", () => {
    const scores = scoreResult({
      definition,
      measurements: {
        ...clean,
        drcErrors: 1,
        missingConnections: 1,
        completedConnections: 0,
      },
    })
    expect(scores.total).toBe(67.5)
    expect(
      scores.metrics.find((metric) => metric.name === "routingCompletion")
        ?.score,
    ).toBe(0)
  })
  it("does not award routing credit to a zero-connection design", () => {
    const scores = scoreResult({
      definition,
      measurements: {
        ...clean,
        requiredConnections: 0,
        completedConnections: 0,
      },
    })
    expect(
      scores.metrics.find((metric) => metric.name === "routingCompletion")
        ?.score,
    ).toBe(0)
  })
  it("requires both dimensions and layer count, and rejects invalid numeric inputs", () => {
    expect(
      scoreResult({ definition, measurements: { ...clean, layers: 4 } }).total,
    ).toBe(95)
    expect(
      scoreResult({ definition, measurements: { ...clean, heightMm: 23 } })
        .total,
    ).toBe(95)
    expect(
      measurementsSchema.safeParse({ ...clean, drcErrors: -1 }).success,
    ).toBe(false)
    expect(
      measurementsSchema.safeParse({ ...clean, completedConnections: 2 })
        .success,
    ).toBe(false)
    expect(
      definitionSchema.safeParse({
        ...definition,
        scoring: {
          ...definition.scoring,
          weights: { ...definition.scoring.weights, drcErrors: 0 },
        },
      }).success,
    ).toBe(false)
  })
})
describe("comparability", () => {
  it("reports a regression and an improvement from the selected baseline", () => {
    const baseline = makeResult()
    const candidate = makeResult({
      id: "candidate",
      scores: { ...baseline.scores, total: 90 },
    })
    expect(compareResults({ baseline, candidate, threshold: 0.5 })).toEqual({
      label: "Regressed",
      delta: -10,
    })
    expect(
      compareResults({
        baseline: candidate,
        candidate: baseline,
        threshold: 0.5,
      }),
    ).toEqual({ label: "Improved", delta: 10 })
  })
  it("refuses differences across rules, evaluator versions, or CAD tools", () => {
    const baseline = makeResult()
    for (const candidate of [
      makeResult({ definitionHash: "c".repeat(64) }),
      makeResult({ protocolHash: "c".repeat(64) }),
      makeResult({ platform: "kicad" }),
    ]) {
      expect(
        compareResults({ baseline, candidate, threshold: 0.5 }).label,
      ).toBe("Not comparable")
    }
    expect(
      compareResults({ baseline, candidate: baseline, threshold: 0.5 }).label,
    ).toBe("Unchanged")
  })
})
