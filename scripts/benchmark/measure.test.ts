// @vitest-environment node
import { describe, expect, it } from "vitest"
import rawDefinition from "../../src/evaluation/fixtures/rc-filter.json"
import { definitionSchema } from "../../src/evaluation/schema"
import { boardSchema, drcSchema, measure } from "./measure"
const definition = definitionSchema.parse(rawDefinition)
const board = boardSchema.parse({
  widthMm: 36,
  heightMm: 22,
  layers: 2,
  kicadVersion: "10.0.1",
  components: [
    { reference: "R1", value: "1k", side: 0, bounds: [0, 0, 2, 2] },
    { reference: "C1", value: "100nF", side: 0, bounds: [3, 0, 5, 2] },
  ],
  pads: [
    { reference: "R1", pin: "1", net: 1, uuid: "a" },
    { reference: "R1", pin: "2", net: 2, uuid: "b" },
    { reference: "C1", pin: "1", net: 2, uuid: "c" },
    { reference: "C1", pin: "2", net: 3, uuid: "d" },
  ],
  itemNets: { a: 1, b: 2, c: 2, d: 3 },
})
const drc = drcSchema.parse({
  violations: [],
  unconnected_items: [],
  schematic_parity: [],
})
describe("native board measurements", () => {
  it("checks expected pins, values and dimensions", () => {
    expect(measure({ definition, board, drc })).toMatchObject({
      missingConnections: 0,
      incorrectComponents: 0,
      componentOverlaps: 0,
      completedConnections: 1,
      requiredConnections: 1,
    })
  })
  it("counts each unrouted net once and gives no routing credit", () => {
    const report = {
      ...drc,
      unconnected_items: [
        {
          type: "unconnected_items",
          severity: "error",
          items: [{ uuid: "b" }, { uuid: "c" }],
        },
        {
          type: "unconnected_items",
          severity: "error",
          items: [{ uuid: "b" }],
        },
      ],
    }
    expect(measure({ definition, board, drc: report })).toMatchObject({
      unroutedNets: 1,
      completedConnections: 0,
    })
  })
  it("rejects missing pins even when DRC reports no unconnected items", () => {
    const measurements = measure({
      definition,
      board: { ...board, pads: board.pads.filter((pad) => pad.uuid !== "c") },
      drc,
    })
    expect(measurements.missingConnections).toBe(1)
    expect(measurements.completedConnections).toBe(0)
  })
  it("detects shorted required nets and unassigned pins", () => {
    expect(
      measure({
        definition,
        board: {
          ...board,
          pads: board.pads.map((pad) => ({ ...pad, net: 1 })),
        },
        drc,
      }),
    ).toMatchObject({ missingConnections: 3, completedConnections: 0 })
    expect(
      measure({
        definition,
        board: {
          ...board,
          pads: board.pads.map((pad) => ({ ...pad, net: 0 })),
        },
        drc,
      }),
    ).toMatchObject({ missingConnections: 3, completedConnections: 0 })
  })
  it("finds same-side bounding-box overlaps and wrong components", () => {
    const components = [
      { ...board.components[0], value: "10k" },
      {
        ...board.components[1],
        bounds: [1, 0, 3, 2] as [number, number, number, number],
      },
    ]
    expect(
      measure({ definition, board: { ...board, components }, drc }),
    ).toMatchObject({ componentOverlaps: 1, incorrectComponents: 1 })
    components[1].side = 31
    expect(
      measure({ definition, board: { ...board, components }, drc })
        .componentOverlaps,
    ).toBe(0)
  })
  it("counts clearance and parity errors and rejects incomplete native reports", () => {
    const violation = { type: "clearance", severity: "error", items: [] }
    expect(
      measure({
        definition,
        board,
        drc: { ...drc, violations: [violation], schematic_parity: [violation] },
      }),
    ).toMatchObject({ drcErrors: 2, clearanceViolations: 1 })
    expect(drcSchema.safeParse({}).success).toBe(false)
    expect(() =>
      measure({
        definition,
        board,
        drc: {
          ...drc,
          unconnected_items: [{ ...violation, items: [{ uuid: "unknown" }] }],
        },
      }),
    ).toThrow("Cannot resolve")
  })
})
