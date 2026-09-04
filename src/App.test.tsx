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

    expect(screen.getByRole("heading", { name: "GPT-5" })).toBeInTheDocument()
    const availableOutputs = benchmarkRuns.flatMap(({ platforms }) => platforms)
      .filter((platform): platform is AvailablePlatformOutput => platform.status === "available")
    const generatedOutputs = availableOutputs.filter(({ circuitJson }) => !circuitJson)
    expect(screen.getAllByAltText(/pcb snapshot/i)).toHaveLength(generatedOutputs.length)
    expect(screen.queryAllByAltText(/schematic snapshot/i)).toHaveLength(0)
    expect(await screen.findByTestId("tscircuit-pcb-viewer")).toBeInTheDocument()
    expect(screen.queryByTestId("tscircuit-schematic-viewer")).not.toBeInTheDocument()
    expect(screen.getAllByAltText("KiCad pcb snapshot")).toHaveLength(2)

    const zoomReadout = screen.getAllByRole("button", { name: /reset .* pcb zoom/i })[0]
    expect(zoomReadout).toHaveTextContent("100%")
    fireEvent.click(screen.getAllByRole("button", { name: /zoom in .* pcb/i })[0])
    expect(zoomReadout).toHaveTextContent("125%")

    const run002Tabs = within(screen.getByRole("tablist", { name: "run-002 output view" }))
    fireEvent.click(run002Tabs.getByRole("tab", { name: "Schematic" }))
    expect(await screen.findByTestId("tscircuit-schematic-viewer")).toBeInTheDocument()
    expect(screen.queryByTestId("tscircuit-pcb-viewer")).not.toBeInTheDocument()

    const run001Tabs = within(screen.getByRole("tablist", { name: "run-001 output view" }))
    fireEvent.click(run001Tabs.getByRole("tab", { name: "Schematic" }))
    expect(screen.getAllByAltText(/schematic snapshot/i)).toHaveLength(generatedOutputs.length)
    expect(screen.queryAllByAltText(/pcb snapshot/i)).toHaveLength(0)
  })

  it("keeps the page focused on model, prompt, and visualization", () => {
    render(<App />)

    expect(screen.getAllByText("Model")).toHaveLength(benchmarkRuns.length)
    expect(screen.getAllByText("Prompt")).toHaveLength(benchmarkRuns.length)
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument()
    expect(screen.queryByLabelText("Benchmark filters")).not.toBeInTheDocument()
    expect(screen.getByLabelText("Benchmark visualization for GPT-5.6 SOL Medium")).toBeInTheDocument()
  })

  it("renders every run from benchmark metadata", () => {
    render(<App />)

    expect(benchmarkRuns).toHaveLength(2)
    for (const run of benchmarkRuns) {
      expect(screen.getByRole("heading", { name: run.model })).toBeInTheDocument()
      expect(screen.getByLabelText(`Benchmark visualization for ${run.model}`)).toBeInTheDocument()
    }
  })
})
