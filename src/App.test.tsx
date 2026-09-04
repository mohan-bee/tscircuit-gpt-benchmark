import "@testing-library/jest-dom/vitest"
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { App } from "./App"
import { benchmarkRuns, type AvailablePlatformOutput } from "./benchmarks"

vi.mock("@tscircuit/pcb-viewer", () => ({
  PCBViewer: () => <div data-testid="tscircuit-pcb-viewer">Interactive PCB</div>,
}))

vi.mock("@tscircuit/schematic-viewer", () => ({
  SchematicViewer: () => <div data-testid="tscircuit-schematic-viewer">Interactive schematic</div>,
}))

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [{ type: "pcb_board", pcb_board_id: "board" }],
  }))
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe("PCB Bench", () => {
  it("switches PCB and schematic in one tabbed frame without stacking", async () => {
    render(<App />)

    const availableOutputs = benchmarkRuns.filter((run) => run.visible).flatMap(({ platforms }) => platforms)
      .filter((platform): platform is AvailablePlatformOutput => platform.status === "available")
    const staticOutputs = availableOutputs.filter(({ circuitJson, name }) => !circuitJson && name !== "KiCad")
    expect(screen.queryAllByAltText(/pcb snapshot/i)).toHaveLength(staticOutputs.length)
    expect(screen.queryAllByAltText(/schematic snapshot/i)).toHaveLength(0)
    expect(await screen.findByTestId("tscircuit-pcb-viewer")).toBeInTheDocument()
    expect(screen.queryByTestId("tscircuit-schematic-viewer")).not.toBeInTheDocument()
    const kicanvasPcbViewers = screen.getAllByLabelText("KiCanvas KiCad pcb viewer")
    expect(kicanvasPcbViewers).toHaveLength(1)
    expect(screen.getByText("KiCanvas")).toBeInTheDocument()
    expect(kicanvasPcbViewers[0]).toHaveAttribute("src", "/benchmarks/run-002/kicad/esp32-c3-compact.kicad_pcb")
    expect(kicanvasPcbViewers[0]).toHaveAttribute("controls", "full")
    expect(kicanvasPcbViewers[0]).toHaveAttribute("controlslist", "nodownload flipview")
    expect(kicanvasPcbViewers[0]).toHaveAttribute("zoom", "objects")
    expect(kicanvasPcbViewers[0]).toHaveAttribute("boardlayers", "F.Cu,F.SilkS,Edge.Cuts")

    const run002Tabs = within(screen.getByRole("tablist", { name: "run-002 output view" }))
    fireEvent.click(run002Tabs.getByRole("tab", { name: "Schematic" }))
    expect(await screen.findByTestId("tscircuit-schematic-viewer")).toBeInTheDocument()
    expect(screen.queryByTestId("tscircuit-pcb-viewer")).not.toBeInTheDocument()
    const kicanvasSchematicViewer = screen.getByLabelText("KiCanvas KiCad schematic viewer")
    expect(kicanvasSchematicViewer).toHaveAttribute("src", "/benchmarks/run-002/kicad/esp32-c3-compact.kicad_sch")
    expect(kicanvasSchematicViewer).not.toBe(kicanvasPcbViewers[0])
    expect(screen.queryAllByAltText(/schematic snapshot/i)).toHaveLength(staticOutputs.length)
    expect(screen.queryAllByAltText(/pcb snapshot/i)).toHaveLength(0)
  })

  it("keeps model and complexity filters above the visualization", () => {
    render(<App />)

    expect(screen.getByRole("heading", { name: "Benchmark explorer" })).toBeInTheDocument()
    const filters = within(screen.getByLabelText("Benchmark filters"))
    expect(filters.getAllByRole("combobox")).toHaveLength(2)
    expect(screen.getByLabelText("Filter by model")).toHaveValue("all")
    expect(screen.getByLabelText("Filter by complexity")).toHaveValue("all")
    expect(screen.queryByRole("option", { name: /^GPT-5$/ })).not.toBeInTheDocument()
    expect(screen.queryByText("Prompt")).not.toBeInTheDocument()
    expect(screen.queryByText("Connect a 1 kΩ resistor and 100 nF capacitor as an RC filter.")).not.toBeInTheDocument()
    expect(screen.getByLabelText("Benchmark visualization for GPT-5.6 SOL Medium")).toBeInTheDocument()
  })

  it("renders only dashboard-visible benchmark metadata", () => {
    render(<App />)

    expect(benchmarkRuns).toHaveLength(2)
    const visibleRuns = benchmarkRuns.filter((run) => run.visible)
    expect(visibleRuns).toHaveLength(1)
    for (const run of visibleRuns) {
      expect(screen.getByLabelText(`Benchmark visualization for ${run.model}`)).toBeInTheDocument()
    }
    expect(screen.queryByLabelText("Benchmark visualization for GPT-5")).not.toBeInTheDocument()
  })
})
