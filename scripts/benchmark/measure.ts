import { z } from "zod"
import type { Definition, Measurements } from "../../src/evaluation/schema"
const itemSchema = z.object({ uuid: z.string() }).passthrough()
const violationSchema = z
  .object({
    type: z.string(),
    severity: z.string(),
    items: z.array(itemSchema),
  })
  .passthrough()
export const drcSchema = z
  .object({
    violations: z.array(violationSchema),
    unconnected_items: z.array(violationSchema),
    schematic_parity: z.array(violationSchema),
  })
  .passthrough()
export const boardSchema = z.object({
  widthMm: z.number().positive(),
  heightMm: z.number().positive(),
  layers: z.number().int().positive(),
  kicadVersion: z.string(),
  pads: z.array(
    z.object({
      reference: z.string(),
      pin: z.string(),
      net: z.number(),
      uuid: z.string(),
    }),
  ),
  itemNets: z.record(z.number()),
  components: z.array(
    z.object({
      reference: z.string(),
      value: z.string(),
      side: z.number(),
      bounds: z.tuple([z.number(), z.number(), z.number(), z.number()]),
    }),
  ),
})
export function measure({
  definition,
  board,
  drc,
}: {
  definition: Definition
  board: z.infer<typeof boardSchema>
  drc: z.infer<typeof drcSchema>
}): Measurements {
  const unrouted = new Set<number>()
  for (const connection of drc.unconnected_items) {
    for (const item of connection.items) {
      const net = board.itemNets[item.uuid]
      if (net === undefined)
        throw new Error("Cannot resolve DRC endpoint to a native net")
      unrouted.add(net)
    }
  }
  let missingConnections = 0
  let requiredConnections = 0
  let completedConnections = 0
  const shortedNets = new Set<number>()
  for (const violation of drc.violations) {
    if (violation.type !== "shorting_items") continue
    for (const item of violation.items) {
      const net = board.itemNets[item.uuid]
      if (net === undefined)
        throw new Error("Cannot resolve shorted copper to a native net")
      shortedNets.add(net)
    }
  }
  const expectedNets = definition.requirements.nets.map((net) => {
    const terminals = net.pins.map((terminal) =>
      board.pads.filter(
        (pad) =>
          pad.reference === terminal.reference && pad.pin === terminal.pin,
      ),
    )
    const codes = new Set(terminals.flat().map((pad) => pad.net))
    const valid =
      terminals.every((pads) => pads.length > 0) &&
      codes.size === 1 &&
      !codes.has(0)
    return { net, codes, valid }
  })
  for (const [index, expected] of expectedNets.entries()) {
    const shorted =
      [...expected.codes].some((net) => shortedNets.has(net)) ||
      expectedNets.some(
        (other, otherIndex) =>
          otherIndex !== index &&
          [...expected.codes].some((net) => net !== 0 && other.codes.has(net)),
      )
    if (!expected.valid || shorted)
      missingConnections += Math.max(1, expected.net.pins.length - 1)
    const connections = expected.net.pins.length - 1
    requiredConnections += connections
    if (
      expected.valid &&
      !shorted &&
      ![...expected.codes].some((net) => unrouted.has(net))
    )
      completedConnections += connections
  }
  let componentOverlaps = 0
  for (const [index, first] of board.components.entries()) {
    for (const second of board.components.slice(index + 1)) {
      if (first.side !== second.side) continue
      if (
        Math.min(first.bounds[2], second.bounds[2]) >
          Math.max(first.bounds[0], second.bounds[0]) &&
        Math.min(first.bounds[3], second.bounds[3]) >
          Math.max(first.bounds[1], second.bounds[1])
      )
        componentOverlaps++
    }
  }
  const incorrectComponents = definition.requirements.components.filter(
    (required) => {
      const matches = board.components.filter(
        (component) => component.reference === required.reference,
      )
      return (
        matches.length !== 1 ||
        !required.allowedValues.includes(matches[0].value)
      )
    },
  ).length
  const unexpectedComponents = board.components.filter(
    (component) =>
      !definition.requirements.components.some(
        (required) => required.reference === component.reference,
      ),
  ).length
  const clearanceTypes = new Set([
    "clearance",
    "copper_edge_clearance",
    "hole_clearance",
    "shorting_items",
  ])
  return {
    drcErrors: [...drc.violations, ...drc.schematic_parity].filter(
      (violation) => violation.severity === "error",
    ).length,
    unroutedNets: unrouted.size,
    componentOverlaps,
    missingConnections,
    incorrectComponents,
    unexpectedComponents,
    widthMm: board.widthMm,
    heightMm: board.heightMm,
    layers: board.layers,
    clearanceViolations: drc.violations.filter((violation) =>
      clearanceTypes.has(violation.type),
    ).length,
    requiredClearanceMm: definition.requirements.clearanceMm,
    requiredConnections,
    completedConnections,
  }
}
