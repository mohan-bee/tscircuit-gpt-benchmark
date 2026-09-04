import "@testing-library/jest-dom/vitest"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { App } from "./App"

describe("PCB Mirror", () => {
  it("shows both CAD platforms and all four views", () => {
    render(<App />)
    expect(screen.getByRole("heading", { name: "tscircuit" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "KiCad" })).toBeInTheDocument()
    expect(screen.getAllByText("Schematic")).toHaveLength(2)
    expect(screen.getAllByText("PCB")).toHaveLength(2)
    expect(screen.getAllByRole("img")).toHaveLength(4)
  })
})

