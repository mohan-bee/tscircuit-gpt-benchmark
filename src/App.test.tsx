import "@testing-library/jest-dom/vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { App } from "./App"
import { benchmarkRuns } from "./benchmarks"

afterEach(cleanup)

describe("PCB Bench", () => {
  it("switches both platform viewers between PCB and schematic snapshots", () => {
    render(<App />)

    expect(screen.getByRole("heading", { name: "GPT-5" })).toBeInTheDocument()
    const availableOutputs = benchmarkRuns.flatMap(({ platforms }) => platforms).filter(({ status }) => status === "available")
    expect(screen.getAllByAltText(/pcb snapshot/i)).toHaveLength(availableOutputs.length)
    expect(screen.getByLabelText("KiCad output pending")).toBeEmptyDOMElement()

    fireEvent.click(screen.getAllByRole("tab", { name: "Schematic" })[0])
    expect(screen.getAllByAltText(/schematic snapshot/i)).toHaveLength(availableOutputs.length)
    expect(screen.queryByAltText(/pcb snapshot/i)).not.toBeInTheDocument()
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
