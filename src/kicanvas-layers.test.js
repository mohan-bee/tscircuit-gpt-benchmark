// @vitest-environment node
import { readFileSync } from "node:fs"
import { JSDOM } from "jsdom"
import { afterAll, expect, test } from "vitest"

// Execute the shipped bundle so the test includes copper's virtual zone layers.
// q3 is LayerSet in the pinned KiCanvas revision (see vendor/REVISION).
const dom = new JSDOM("<body></body>", {
  runScripts: "outside-only",
  url: "http://localhost",
})
dom.window.URL.createObjectURL = () => "blob:test"
const LayerSet = dom.window.eval(
  readFileSync("public/vendor/kicanvas/kicanvas.js", "utf8") + ";q3",
)
afterAll(() => dom.window.close())

test.each(["F", "B"])("%s silkscreen renders above visible copper and fill", (side) => {
  const layers = new LayerSet({
    layers: ["F.Cu", "B.Cu", "F.Mask", "B.Mask", "F.SilkS", "B.SilkS"]
      .map(canonical_name => ({ canonical_name })),
  }, { copper: {} })
  const order = [...layers.in_display_order()].filter(layer => layer.visible)
    .map(layer => layer.name)
  const silk = order.indexOf(`${side}.SilkS`)
  expect(silk).toBeGreaterThan(-1)
  for (const name of [`${side}.Cu`, `:${side}.Cu:Zones`, `${side}.Mask`]) {
    expect(order.indexOf(name)).toBeGreaterThan(-1)
    expect(silk).toBeGreaterThan(order.indexOf(name))
  }
})
