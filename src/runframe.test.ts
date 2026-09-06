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

it("loads saved Circuit JSON and enables preview tabs without code", async () => {
  history.replaceState(null, "", "/runframe.html?circuit=/circuit.json&project=bench-001&view=schematic")
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] })
  vi.stubGlobal("fetch", fetchMock)
  await import("./runframe")
  await vi.waitFor(() => expect(document.querySelector("script")?.getAttribute("src")).toBe("/assets/runframe.js"))
  expect(fetchMock.mock.calls.map(([url]) => url.pathname)).toEqual(["/circuit.json"])
  expect(window.CIRCUIT_JSON_PREVIEW_PROPS).toMatchObject({
    circuitJson: [], projectName: "bench-001", defaultActiveTab: "schematic",
    readOnly: true, showCodeTab: false, showFileMenu: true, showToggleFullScreen: true,
    availableTabs: ["pcb", "schematic", "cad", "assembly", "pinout", "bom", "circuit_json", "errors"],
  })
  expect(window.CIRCUIT_JSON_PREVIEW_PROPS).not.toHaveProperty("code")
})

it("shows a loading failure without starting RunFrame", async () => {
  history.replaceState(null, "", "/runframe.html?circuit=/missing.json")
  document.body.innerHTML = '<p id="status">Loading</p>'
  vi.spyOn(console, "error").mockImplementation(() => {})
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }))
  await import("./runframe")
  await vi.waitFor(() => expect(document.querySelector('[role="alert"]')?.textContent).toContain("Unable to display"))
  expect(document.querySelector("script")).toBeNull()
})
