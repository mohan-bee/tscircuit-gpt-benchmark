import { AutoroutingPipelineSolver7_MultiGraph, type SimpleRouteJson } from "@tscircuit/capacity-autorouter"

// Pass spacing to the solver input itself. The CLI's cached phase result does
// not include the autorouter settings in its key; algorithmFn bypasses it.
// Route with 0.15 mm extra trace width and 0.8 mm via pads, then restore
// 0.2 mm minimum traces and 0.6/0.3 mm vias. This reserves clearance without
// weakening the board rules. Final copper is checked after restoration.
export function createRouter(input: SimpleRouteJson) {
  const solver = new AutoroutingPipelineSolver7_MultiGraph({
    ...input,
    defaultObstacleMargin: 0.25,
    minTraceWidth: input.minTraceWidth + 0.15,
    minViaPadDiameter: 0.8, min_via_pad_diameter: 0.8, minViaDiameter: 0.8,
    connections: input.connections.map(c => ({...c, width: (c.nominalTraceWidth ?? input.minTraceWidth) + 0.15, nominalTraceWidth: (c.nominalTraceWidth ?? input.minTraceWidth) + 0.15})),
    minTraceToPadEdgeClearance: 0.25,
    minViaEdgeToPadEdgeClearance: 0.25,
  }, { effort: 2, cacheProvider: null })
  const output = () => solver.getOutputSimplifiedPcbTraces().map(t => ({...t, route: t.route.map(p => p.route_type === "wire" ? {...p, width: Math.max(input.minTraceWidth, p.width - 0.15)} : {...p, via_diameter: 0.6, via_hole_diameter: 0.3})}))
  const listeners: Record<string, ((event: any) => void)[]> = {}
  let isRouting = false
  let started = 0
  const emit = (type: string, event: object) => listeners[type]?.forEach(fn => fn({type, ...event}))
  const tick = () => {
    if (!isRouting) return
    try {
      const deadline = Date.now() + 50
      while (!solver.solved && !solver.failed && Date.now() < deadline) solver.step()
      if (solver.failed || Date.now() - started > 120000) throw new Error(solver.error || "Routing exceeded 120 seconds")
      if (solver.solved) {
        isRouting = false
        emit("complete", {traces: output()})
      } else {
        emit("progress", {steps: solver.iterations, progress: 0, phase: solver.getCurrentPhase()})
        setTimeout(tick, 0)
      }
    } catch (error) { isRouting = false; emit("error", {error}) }
  }
  return {
    input,
    get isRouting() { return isRouting },
    on(type: string, fn: (event: any) => void) { (listeners[type] ??= []).push(fn) },
    start() { isRouting = true; started = Date.now(); setTimeout(tick, 0) },
    stop() { isRouting = false },
    solveSync() { solver.solve(); return output() },
    getOutputSimpleRouteJson() { return {...input, traces: output()} },
  }
}
