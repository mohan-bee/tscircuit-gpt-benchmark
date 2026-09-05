import type { Definition, EvaluationResult, Measurements } from "./schema"
export function scoreResult({
  definition,
  measurements,
}: {
  definition: Definition
  measurements: Measurements | null
}): EvaluationResult["scores"] {
  const ratios = Object.fromEntries(
    Object.keys(definition.scoring.weights).map((name) => [name, 0]),
  )
  if (measurements) {
    const requirements = definition.requirements
    ratios.drcErrors = 1 / (1 + measurements.drcErrors)
    ratios.unroutedNets = 1 / (1 + measurements.unroutedNets)
    ratios.componentOverlaps = 1 / (1 + measurements.componentOverlaps)
    ratios.missingConnections = 1 / (1 + measurements.missingConnections)
    ratios.components = Math.max(
      0,
      1 -
        (measurements.incorrectComponents + measurements.unexpectedComponents) /
          requirements.components.length,
    )
    if (
      Math.abs(measurements.widthMm - requirements.widthMm) <=
        requirements.toleranceMm &&
      Math.abs(measurements.heightMm - requirements.heightMm) <=
        requirements.toleranceMm &&
      measurements.layers === requirements.layers
    )
      ratios.boardDimensions = 1
    ratios.traceClearance = 1 / (1 + measurements.clearanceViolations)
    if (measurements.requiredConnections > 0)
      ratios.routingCompletion =
        measurements.completedConnections / measurements.requiredConnections
  }
  const metrics = Object.entries(definition.scoring.weights).map(
    ([name, maximum]) => ({
      name: name as keyof Definition["scoring"]["weights"],
      score: maximum * ratios[name],
      maximum,
    }),
  )
  const total = metrics.reduce((sum, metric) => sum + metric.score, 0)
  return { metrics, total }
}
export function compareResults({
  baseline,
  candidate,
  threshold,
}: {
  baseline: EvaluationResult
  candidate: EvaluationResult
  threshold: number
}) {
  if (
    baseline.definitionHash !== candidate.definitionHash ||
    baseline.protocolHash !== candidate.protocolHash ||
    baseline.platform !== candidate.platform
  )
    return { label: "Not comparable", delta: null }
  const delta = candidate.scores.total - baseline.scores.total
  if (delta > threshold) return { label: "Improved", delta }
  if (delta < -threshold) return { label: "Regressed", delta }
  return { label: "Unchanged", delta }
}
