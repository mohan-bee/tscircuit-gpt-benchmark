import { useMemo, useState } from "react"
import { ChevronDown, Code2, Download, ExternalLink, SlidersHorizontal } from "lucide-react"
import { benchmarkRuns } from "./benchmarks"

type View = "pcb" | "schematic"

const unique = (values: string[]) => [...new Set(values)].sort((a, b) => a.localeCompare(b))
const modelOptions = ["All models", ...unique(benchmarkRuns.map(({ model }) => model))]
const complexityOptions = ["All levels", ...unique(benchmarkRuns.map(({ complexity }) => complexity))]
const circuitOptions = ["All circuits", ...unique(benchmarkRuns.map(({ circuit }) => circuit))]
const runOptions = ["All runs", ...benchmarkRuns.map(({ id }) => id)]

function Filter({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="filter">
      <span>{label}</span>
      <span className="select-wrap">
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          {options.map((option) => <option key={option}>{option}</option>)}
        </select>
        <ChevronDown size={13} aria-hidden="true" />
      </span>
    </label>
  )
}

export function App() {
  const [view, setView] = useState<View>("pcb")
  const [model, setModel] = useState("All models")
  const [complexity, setComplexity] = useState("All levels")
  const [circuit, setCircuit] = useState("All circuits")
  const [runId, setRunId] = useState("All runs")

  const visibleRuns = useMemo(() => benchmarkRuns.filter((run) => (
    (model === "All models" || model === run.model)
    && (complexity === "All levels" || complexity === run.complexity)
    && (circuit === "All circuits" || circuit === run.circuit)
    && (runId === "All runs" || runId === run.id)
  )), [model, complexity, circuit, runId])

  const resetFilters = () => {
    setModel("All models")
    setComplexity("All levels")
    setCircuit("All circuits")
    setRunId("All runs")
  }

  return (
    <div className="app">
      <header className="topbar">
        <a className="wordmark" href="#top">PCB<span>/</span>BENCH</a>
        <nav>
          <a className="active" href="#runs">Runs</a>
          <a href="#datasets">Datasets</a>
          <a href="#models">Models</a>
        </nav>
        <a className="github-link" href="https://github.com/mohan-bee/pcb-cad-viewer" target="_blank" rel="noreferrer">
          <ExternalLink size={14} /> GitHub
        </a>
      </header>

      <main id="top">
        <section className="page-heading">
          <div>
            <p className="kicker">MODEL OUTPUT COMPARISON</p>
            <h1>PCB benchmark</h1>
            <p>Compare identical prompts across electronics CAD workflows.</p>
          </div>
          <div className="run-id"><span>MATCHING RUNS</span><b>{String(visibleRuns.length).padStart(3, "0")}</b></div>
        </section>

        <section className="filterbar" aria-label="Benchmark filters">
          <div className="filter-title"><SlidersHorizontal size={15} /><span>Filters</span></div>
          <Filter label="MODEL" value={model} options={modelOptions} onChange={setModel} />
          <Filter label="COMPLEXITY" value={complexity} options={complexityOptions} onChange={setComplexity} />
          <Filter label="CIRCUIT" value={circuit} options={circuitOptions} onChange={setCircuit} />
          <Filter label="RUN" value={runId} options={runOptions} onChange={setRunId} />
          <button className="reset" type="button" onClick={resetFilters}>Reset</button>
        </section>

        {visibleRuns.length > 0 ? (
          <div className="benchmark-list" id="runs">
            {visibleRuns.map((run) => (
              <section className="benchmark" key={run.id}>
                <header className="benchmark-header">
                  <div>
                    <div className="benchmark-title"><span className="status-dot" /><h2>{run.model}</h2><span className="tag">{run.complexity}</span></div>
                    <p>{run.prompt}</p>
                  </div>
                  <div className="facts"><span>{run.components} components</span><span>{run.boardSize}</span><span>{run.id}</span></div>
                </header>

                <div className="view-tabs" role="tablist" aria-label="Output view">
                  <button className={view === "pcb" ? "active" : ""} role="tab" aria-selected={view === "pcb"} onClick={() => setView("pcb")}>PCB</button>
                  <button className={view === "schematic" ? "active" : ""} role="tab" aria-selected={view === "schematic"} onClick={() => setView("schematic")}>Schematic</button>
                </div>

                <div className="comparison">
                  {run.platforms.map((platform) => {
                    if (platform.status === "pending") {
                      return (
                        <article className={`viewer viewer--${platform.name.toLowerCase()} viewer--pending`} key={platform.name}>
                          <header>
                            <div><h3>{platform.name}</h3><span>Pending</span></div>
                          </header>
                          <div className={`viewport viewport--${view}`} aria-label={`${platform.name} output pending`} />
                          <footer><span>PENDING</span></footer>
                        </article>
                      )
                    }
                    const image = view === "pcb" ? platform.pcb : platform.schematic
                    const source = view === "pcb" ? platform.pcbSource : platform.schematicSource
                    return (
                      <article className={`viewer viewer--${platform.name.toLowerCase()}`} key={platform.name}>
                        <header>
                          <div><h3>{platform.name}</h3><span>{platform.renderer}</span></div>
                          <div className="viewer-actions">
                            <a href={source} download aria-label={`Download ${platform.name} source`}><Download size={15} /></a>
                            <a href={source} target="_blank" aria-label={`Open ${platform.name} source`}><Code2 size={15} /></a>
                          </div>
                        </header>
                        <div className={`viewport viewport--${view}`}>
                          <img src={image} alt={`${platform.name} ${view} snapshot`} />
                        </div>
                        <footer><span>SNAPSHOT</span><span>{view.toUpperCase()}</span><span>GENERATED</span></footer>
                      </article>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <section className="empty"><p>No benchmark runs match these filters.</p><button type="button" onClick={resetFilters}>Clear filters</button></section>
        )}
      </main>
    </div>
  )
}
