import "@testing-library/jest-dom/vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, it } from "vitest"
import { ScoredComparison } from "./ScoredComparison"
import { makeResult } from "./test-fixtures"
import { definitionSchema } from "./schema"
import rawDefinition from "./fixtures/rc-filter.json"
afterEach(cleanup)
const definitions = [definitionSchema.parse(rawDefinition)]
it("shows two PCB renders, individual metrics and a regression", () => {
  const baseline = makeResult()
  const candidate = makeResult({
    id: "candidate",
    model: "Model B",
    scores: { ...baseline.scores, total: 90 },
  })
  render(
    <ScoredComparison
      results={[baseline, candidate]}
      definitions={definitions}
      renderCircuit={() => null}
    />,
  )
  expect(screen.getAllByRole("img")).toHaveLength(2)
  expect(screen.getByText("100.0 / 100")).toBeInTheDocument()
  expect(screen.getByRole("status")).toHaveTextContent("Regressed")
  expect(screen.getByRole("status")).toHaveTextContent("-10.00")
  expect(screen.getAllByText("DRC errors")).toHaveLength(2)
  fireEvent.change(screen.getByLabelText("Scored CAD tool"), {
    target: { value: "kicad" },
  })
  expect(screen.queryAllByRole("img")).toHaveLength(0)
})
it("shows failures without fabricating previews and blocks incompatible deltas", () => {
  const baseline = makeResult()
  const failed = makeResult({
    id: "failed",
    status: "failed",
    platform: "kicad",
    measurements: null,
    artifacts: {},
    error: "Compiler failed",
    scores: { ...baseline.scores, total: 0 },
  })
  render(
    <ScoredComparison
      results={[baseline, failed]}
      definitions={definitions}
      renderCircuit={() => null}
    />,
  )
  expect(screen.getByRole("alert")).toHaveTextContent("Compiler failed")
  expect(screen.getByRole("status")).toHaveTextContent("Not comparable")
  expect(screen.getAllByRole("img")).toHaveLength(1)
})
