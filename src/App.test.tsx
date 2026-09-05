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
    expect(screen.getByText("KiCanvas · KiCad 10.0.1")).toBeInTheDocument()
    expect(kicanvasPcbViewers[0]).toHaveAttribute("src", "/benchmarks/run-002/kicad/esp32-c3-compact.kicad_pcb")
    expect(kicanvasPcbViewers[0]).toHaveAttribute("controls", "full")
    expect(kicanvasPcbViewers[0]).toHaveAttribute("controlslist", "nodownload flipview")
    expect(kicanvasPcbViewers[0]).toHaveAttribute("theme", "kicad")
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

  it("keeps filters and the selected board prompt above the visualization", () => {
    render(<App />)

    expect(screen.getByRole("heading", { name: "Benchmark explorer" })).toBeInTheDocument()
    const filters = within(screen.getByLabelText("Benchmark filters"))
    expect(filters.getAllByRole("combobox")).toHaveLength(2)
    expect(screen.getByLabelText("Filter by model")).toHaveValue("all")
    expect(screen.getByLabelText("Filter by complexity")).toHaveValue("all")
    expect(screen.queryByRole("option", { name: /^GPT-5$/ })).not.toBeInTheDocument()
    expect(screen.getByLabelText("Board list")).toBeInTheDocument()
    expect(within(screen.getByLabelText("Select a board")).getAllByRole("button")).toHaveLength(2)
    expect(screen.getByText("Board prompt")).toBeInTheDocument()
    expect(screen.getByLabelText("Prompt for ESP32-C3 development board")).toHaveTextContent("USB-C for power and programming")
    expect(screen.queryByText("Connect a 1 kΩ resistor and 100 nF capacitor as an RC filter.")).not.toBeInTheDocument()
    expect(screen.getByLabelText("Benchmark visualization for GPT-5.6 SOL Medium")).toBeInTheDocument()
  })

  it("renders only dashboard-visible benchmark metadata", () => {
    render(<App />)

    expect(benchmarkRuns).toHaveLength(3)
    const visibleRuns = benchmarkRuns.filter((run) => run.visible)
    expect(visibleRuns).toHaveLength(2)
    for (const run of visibleRuns) {
      fireEvent.click(within(screen.getByLabelText("Select a board")).getByRole("button", { name: new RegExp(run.circuit) }))
      expect(screen.getByLabelText(`Benchmark visualization for ${run.model}`)).toBeInTheDocument()
    }
    expect(screen.queryByLabelText("Benchmark visualization for GPT-5")).not.toBeInTheDocument()
  })

  it("shows both LoRa outputs with platform-specific details and versions", async () => {
    render(<App />)
    fireEvent.click(within(screen.getByLabelText("Select a board")).getByRole("button", { name: /ESP32 LoRa sensor board/ }))

    const details = screen.getByLabelText("KiCad benchmark details")
    expect(details).toHaveTextContent("Active time35–40 minutes (estimated; excludes interruption)")
    expect(details).toHaveTextContent("Board54 × 50 mm · 2 layers · 44 components · 31 nets · 48 vias")
    const features = screen.getByLabelText("KiCad board features")
    expect(features).not.toHaveAttribute("open")
    fireEvent.click(within(features).getByText("Board features"))
    expect(features).toHaveAttribute("open")
    expect(features).toHaveTextContent("TMP102 temperature sensor")
    expect(features).toHaveTextContent("no onboard charger")
    fireEvent.click(within(features).getByText("Board features"))
    expect(features).not.toHaveAttribute("open")
    expect(screen.getByText("KiCanvas · KiCad CLI 10.0.1")).toBeInTheDocument()
    expect(screen.getByLabelText("KiCanvas KiCad pcb viewer")).toHaveAttribute("src", "/benchmarks/run-003/kicad/sensor-node.kicad_pcb")
    expect(screen.getByRole("link", { name: "Download KiCad PCB" })).toHaveAttribute("href", "/benchmarks/run-003/kicad/sensor-node.kicad_pcb")
    expect(screen.getByRole("link", { name: "Download KiCad PCB" })).toHaveAttribute("download")
    expect(screen.queryByLabelText("tscircuit output pending")).not.toBeInTheDocument()
    expect(screen.getByLabelText("tscircuit benchmark details")).toHaveTextContent("60 × 44 mm · 2 layers · 41 components · 27 nets · 106 vias")
    expect(screen.getByLabelText("tscircuit benchmark details")).toHaveTextContent("final autorouting phase: 17.7 s")
    expect(screen.getByText("tscircuit 0.0.2463 · CLI 0.1.2021")).toBeInTheDocument()
    expect(await screen.findByTestId("tscircuit-pcb-viewer")).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledWith("/benchmarks/run-003/tscircuit/circuit.json", expect.any(Object))

    fireEvent.click(within(screen.getByRole("tablist", { name: "run-003 output view" })).getByRole("tab", { name: "Schematic" }))
    expect(screen.getByLabelText("KiCanvas KiCad schematic viewer")).toHaveAttribute("src", "/benchmarks/run-003/kicad/sensor-node.kicad_sch")
    expect(screen.getByRole("link", { name: "Download KiCad schematic" })).toHaveAttribute("href", "/benchmarks/run-003/kicad/sensor-node.kicad_sch")
    expect(screen.getByRole("link", { name: "Download KiCad schematic" })).toHaveAttribute("download")
    expect(screen.queryByRole("link", { name: "Download KiCad PCB" })).not.toBeInTheDocument()
    expect(await screen.findByTestId("tscircuit-schematic-viewer")).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText("Filter by model"), { target: { value: "GPT-5.6 SOL Medium" } })
    expect(screen.queryByLabelText("KiCad benchmark details")).not.toBeInTheDocument()
    expect(screen.getByLabelText("Prompt for ESP32-C3 development board")).toBeInTheDocument()
  })
})
