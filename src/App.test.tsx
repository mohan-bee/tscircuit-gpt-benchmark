import "@testing-library/jest-dom/vitest"
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { App } from "./App"
import { benchmarkRuns, type AvailablePlatformOutput } from "./benchmarks"

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe("PCB Bench", () => {
  it("syncs trusted RunFrame tabs and returns from 3D through the shared controls", () => {
    render(<App />)
    const frame = screen.getByTitle("tscircuit RunFrame") as HTMLIFrameElement
    const tabs = within(screen.getByRole("tablist", { name: "bench-001 output view" }))
    const sendTab = (tab: string, origin = window.location.origin, source = frame.contentWindow) => {
      fireEvent(window, new MessageEvent("message", { origin, source, data: { type: "benchmark:runframe-tab", tab } }))
    }
    sendTab("schematic", "https://untrusted.example")
    sendTab("schematic", window.location.origin, window)
    expect(tabs.getByRole("tab", { name: "PCB" })).toHaveAttribute("aria-selected", "true")
    sendTab("schematic")
    expect(tabs.getByRole("tab", { name: "Schematic" })).toHaveAttribute("aria-selected", "true")
    expect(screen.getByTitle("tscircuit RunFrame")).toBe(frame)
    sendTab("cad")
    expect(tabs.getByRole("tab", { name: "Schematic" })).toHaveAttribute("aria-selected", "true")
    fireEvent.click(tabs.getByRole("tab", { name: "Schematic" }))
    const nextFrame = screen.getByTitle("tscircuit RunFrame") as HTMLIFrameElement
    expect(nextFrame).not.toBe(frame)
    expect(new URL(nextFrame.src).searchParams.get("view")).toBe("schematic")
  })

  it("switches PCB and schematic in one tabbed frame without stacking", async () => {
    render(<App />)
    fireEvent.click(within(screen.getByLabelText("Select a board")).getByRole("button", { name: /ESP32-C3 development board/ }))

    const availableOutputs = benchmarkRuns.filter((run) => run.visible).flatMap(({ platforms }) => platforms)
      .filter((platform): platform is AvailablePlatformOutput => platform.status === "available")
    const staticOutputs = availableOutputs.filter(({ circuitJson, name }) => !circuitJson && name !== "KiCad")
    expect(screen.queryAllByAltText(/pcb snapshot/i)).toHaveLength(staticOutputs.length)
    expect(screen.queryAllByAltText(/schematic snapshot/i)).toHaveLength(0)
    expect(screen.getByTitle("tscircuit RunFrame")).toBeInTheDocument()
    const kicanvasPcbViewers = screen.getAllByLabelText("KiCanvas KiCad pcb viewer")
    expect(kicanvasPcbViewers).toHaveLength(1)
    expect(screen.getByText("KiCanvas · KiCad 10.0.1")).toBeInTheDocument()
    expect(kicanvasPcbViewers[0]).toHaveAttribute("src", "/benchmarks/bench-003/kicad/esp32-c3-compact.kicad_pcb")
    expect(kicanvasPcbViewers[0]).toHaveAttribute("controls", "full")
    expect(kicanvasPcbViewers[0]).toHaveAttribute("controlslist", "nodownload flipview")
    expect(kicanvasPcbViewers[0]).toHaveAttribute("theme", "kicad")
    expect(kicanvasPcbViewers[0]).toHaveAttribute("zoom", "objects")
    expect(kicanvasPcbViewers[0]).toHaveAttribute("boardlayers", "F.Cu,F.SilkS,Edge.Cuts")

    const developmentBoardTabs = within(screen.getByRole("tablist", { name: "bench-003 output view" }))
    fireEvent.click(developmentBoardTabs.getByRole("tab", { name: "Schematic" }))
    expect(screen.getByTitle("tscircuit RunFrame")).toBeInTheDocument()
    const kicanvasSchematicViewer = screen.getByLabelText("KiCanvas KiCad schematic viewer")
    expect(kicanvasSchematicViewer).toHaveAttribute("src", "/benchmarks/bench-003/kicad/esp32-c3-compact.kicad_sch")
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
    expect(within(screen.getByLabelText("Select a board")).getAllByRole("button")).toHaveLength(benchmarkRuns.filter((run) => run.visible).length)
    expect(screen.getByText("Board prompt")).toBeInTheDocument()
    expect(screen.getByLabelText("Prompt for RP2040 robot controller")).toHaveTextContent("USB-C for power and programming")
    expect(screen.queryByText("Connect a 1 kΩ resistor and 100 nF capacitor as an RC filter.")).not.toBeInTheDocument()
    expect(screen.getByLabelText("Benchmark visualization for GPT 6 Astra medium")).toBeInTheDocument()
  })

  it("renders only dashboard-visible benchmark metadata", () => {
    render(<App />)

    expect(benchmarkRuns).toHaveLength(4)
    const visibleRuns = benchmarkRuns.filter((run) => run.visible)
    expect(visibleRuns.map(({ id, circuit }) => [id, circuit])).toEqual([
      ["bench-001", "RP2040 robot controller"],
      ["bench-002", "ESP32 LoRa sensor board"],
      ["bench-003", "ESP32-C3 development board"],
    ])
    for (const run of visibleRuns) {
      fireEvent.click(within(screen.getByLabelText("Select a board")).getByRole("button", { name: new RegExp(run.circuit) }))
      expect(screen.getByLabelText(`Benchmark visualization for ${run.model}`)).toBeInTheDocument()
    }
    expect(screen.queryByLabelText("Benchmark visualization for GPT-5")).not.toBeInTheDocument()
  })

  it("shows the robot controller with measured time and an empty KiCad comparison", async () => {
    render(<App />)
    fireEvent.click(within(screen.getByLabelText("Select a board")).getByRole("button", { name: /RP2040 robot controller/ }))

    expect(screen.getByLabelText("tscircuit benchmark details")).toHaveTextContent("55 min 32 s measured elapsed wall-clock time")
    expect(screen.getByLabelText("tscircuit benchmark details")).toHaveTextContent("64 × 50 mm · 2 layers · 85 components")
    expect(screen.getByTitle("tscircuit RunFrame")).toBeInTheDocument()
    expect(new URL((screen.getByTitle("tscircuit RunFrame") as HTMLIFrameElement).src).searchParams.get("circuit")).toBe("/benchmarks/bench-001/tscircuit/release/robot.circuit.json")
    expect(screen.getByLabelText("KiCad output pending")).toBeEmptyDOMElement()
    expect(screen.queryByRole("link", { name: "Download KiCad PCB" })).not.toBeInTheDocument()

    fireEvent.click(within(screen.getByRole("tablist", { name: "bench-001 output view" })).getByRole("tab", { name: "Schematic" }))
    expect(screen.getByTitle("tscircuit RunFrame")).toBeInTheDocument()
    expect(screen.getByLabelText("KiCad output pending")).toBeEmptyDOMElement()
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
    expect(screen.getByLabelText("KiCanvas KiCad pcb viewer")).toHaveAttribute("src", "/benchmarks/bench-002/kicad/sensor-node.kicad_pcb")
    expect(screen.getByRole("link", { name: "Download KiCad PCB" })).toHaveAttribute("href", "/benchmarks/bench-002/kicad/sensor-node.kicad_pcb")
    expect(screen.getByRole("link", { name: "Download KiCad PCB" })).toHaveAttribute("download")
    expect(screen.queryByLabelText("tscircuit output pending")).not.toBeInTheDocument()
    expect(screen.getByLabelText("tscircuit benchmark details")).toHaveTextContent("60 × 44 mm · 2 layers · 41 components · 27 nets · 106 vias")
    expect(screen.getByLabelText("tscircuit benchmark details")).toHaveTextContent("final autorouting phase: 17.7 s")
    expect(screen.getByText("tscircuit 0.0.2463 · CLI 0.1.2021")).toBeInTheDocument()
    expect(screen.getByTitle("tscircuit RunFrame")).toBeInTheDocument()
    expect(new URL((screen.getByTitle("tscircuit RunFrame") as HTMLIFrameElement).src).searchParams.get("circuit")).toBe("/benchmarks/bench-002/tscircuit/circuit.json")

    fireEvent.click(within(screen.getByRole("tablist", { name: "bench-002 output view" })).getByRole("tab", { name: "Schematic" }))
    expect(screen.getByLabelText("KiCanvas KiCad schematic viewer")).toHaveAttribute("src", "/benchmarks/bench-002/kicad/sensor-node.kicad_sch")
    expect(screen.getByRole("link", { name: "Download KiCad schematic" })).toHaveAttribute("href", "/benchmarks/bench-002/kicad/sensor-node.kicad_sch")
    expect(screen.getByRole("link", { name: "Download KiCad schematic" })).toHaveAttribute("download")
    expect(screen.queryByRole("link", { name: "Download KiCad PCB" })).not.toBeInTheDocument()
    expect(screen.getByTitle("tscircuit RunFrame")).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText("Filter by model"), { target: { value: "GPT-5.6 SOL Medium" } })
    expect(screen.queryByLabelText("KiCad benchmark details")).not.toBeInTheDocument()
    expect(screen.getByLabelText("Prompt for ESP32-C3 development board")).toBeInTheDocument()
  })
})
