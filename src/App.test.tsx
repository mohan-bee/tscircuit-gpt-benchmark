import "@testing-library/jest-dom/vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
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
  it("shows official interactive tscircuit viewers and generated snapshot fallbacks", async () => {
    render(<App />)

    expect(screen.getByRole("heading", { name: "GPT-5" })).toBeInTheDocument()
    const availableOutputs = benchmarkRuns.flatMap(({ platforms }) => platforms)
      .filter((platform): platform is AvailablePlatformOutput => platform.status === "available")
    const generatedOutputs = availableOutputs.filter(({ circuitJson }) => !circuitJson)
    expect(screen.getAllByAltText(/pcb snapshot/i)).toHaveLength(generatedOutputs.length)
    expect(screen.getAllByAltText(/schematic snapshot/i)).toHaveLength(generatedOutputs.length)
    expect(await screen.findByTestId("tscircuit-pcb-viewer")).toBeInTheDocument()
    expect(await screen.findByTestId("tscircuit-schematic-viewer")).toBeInTheDocument()
    expect(screen.getAllByRole("link", { name: /view .* pcb snapshot/i })).toHaveLength(availableOutputs.length)
    expect(screen.getAllByRole("link", { name: /view .* schematic snapshot/i })).toHaveLength(availableOutputs.length)
    expect(screen.getByLabelText("KiCad output pending")).toBeEmptyDOMElement()

    const zoomReadout = screen.getAllByRole("button", { name: /reset .* pcb zoom/i })[0]
    expect(zoomReadout).toHaveTextContent("100%")
    fireEvent.click(screen.getAllByRole("button", { name: /zoom in .* pcb/i })[0])
    expect(zoomReadout).toHaveTextContent("125%")
  })

  it("filters and restores benchmark runs", () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText("MODEL"), { target: { value: "GPT-5" } })
    expect(screen.getByRole("heading", { name: "GPT-5" })).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Reset" }))
    expect(screen.getByRole("heading", { name: "GPT-5" })).toBeInTheDocument()
  })

  it("loads runs from benchmark metadata and exposes a run filter", () => {
    render(<App />)

    expect(benchmarkRuns).toHaveLength(2)
    expect(screen.getByLabelText("RUN")).toHaveValue("All runs")
    fireEvent.change(screen.getByLabelText("RUN"), { target: { value: "run-001" } })
    expect(screen.getByRole("heading", { name: "GPT-5" })).toBeInTheDocument()
  })
})
