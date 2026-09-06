import { afterEach, expect, it, vi } from "vitest"

vi.mock("@tscircuit/runframe/standalone-preview?url", () => ({ default: "/assets/runframe.js" }))

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  vi.resetModules()
  document.body.innerHTML = ""
  delete window.CIRCUIT_JSON
  delete window.CIRCUIT_JSON_PREVIEW_PROPS
  history.replaceState(null, "", "/")
})

it("loads saved files and enables full preview tabs and file controls before loading RunFrame", async () => {
  history.replaceState(null, "", "/runframe.html?circuit=/circuit.json&source=/board.tsx&project=bench-001&view=schematic")
  const fetchMock = vi.fn()
    .mockResolvedValueOnce({ ok: true, json: async () => [] })
    .mockResolvedValueOnce({ ok: true, text: async () => "export default () => <board />" })
  vi.stubGlobal("fetch", fetchMock)
  await import("./runframe")
  await vi.waitFor(() => expect(document.querySelector("script")?.getAttribute("src")).toBe("/assets/runframe.js"))
  expect(fetchMock.mock.calls.map(([url]) => url.pathname)).toEqual(["/circuit.json", "/board.tsx"])
  expect(window.CIRCUIT_JSON_PREVIEW_PROPS).toMatchObject({
    circuitJson: [], code: "export default () => <board />", projectName: "bench-001",
    defaultActiveTab: "schematic", readOnly: true, showFileMenu: true, showToggleFullScreen: true,
    availableTabs: ["pcb", "schematic", "cad", "code", "assembly", "pinout", "bom", "circuit_json", "errors"],
  })
})

it("shows a loading failure without starting RunFrame", async () => {
  history.replaceState(null, "", "/runframe.html?circuit=/missing.json&source=/board.tsx")
  document.body.innerHTML = '<p id="status">Loading</p>'
  vi.spyOn(console, "error").mockImplementation(() => {})
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }))
  await import("./runframe")
  await vi.waitFor(() => expect(document.querySelector('[role="alert"]')?.textContent).toContain("Unable to display"))
  expect(document.querySelector("script")).toBeNull()
})
