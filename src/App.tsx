import { useMemo, useState } from "react"
import { ChevronDown, Code2, Download, ExternalLink, SlidersHorizontal } from "lucide-react"

type View = "pcb" | "schematic"

const run = {
  id: "run-001",
  model: "GPT-5",
  complexity: "Basic",
  circuit: "RC filter",
  prompt: "Connect a 1 kΩ resistor and 100 nF capacitor as an RC filter.",
  platforms: [
    {
      name: "tscircuit",
      pcb: "/assets/tscircuit-pcb.svg",
      schematic: "/assets/tscircuit-schematic.svg",
      pcbSource: "/examples/tscircuit/index.circuit.tsx",
      schematicSource: "/examples/tscircuit/index.circuit.tsx",
      renderer: "@tscircuit/core 0.0.1812",
    },
    {
      name: "KiCad",
      pcb: "/assets/kicad-pcb.png",
      schematic: "/assets/kicad-schematic.svg",
      pcbSource: "/examples/kicad/rc-filter.kicad_pcb",
      schematicSource: "/examples/kicad/rc-filter.kicad_sch",
      renderer: "KiCad CLI 10.0.1",
    },
  ],
} as const

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

  const visible = useMemo(() => (
    (model === "All models" || model === run.model)
    && (complexity === "All levels" || complexity === run.complexity)
    && (circuit === "All circuits" || circuit === run.circuit)
  ), [model, complexity, circuit])

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
          <div className="run-id"><span>ACTIVE RUN</span><b>001</b></div>
        </section>

        <section className="filterbar" aria-label="Benchmark filters">
          <div className="filter-title"><SlidersHorizontal size={15} /><span>Filters</span></div>
          <Filter label="MODEL" value={model} options={["All models", "GPT-5"]} onChange={setModel} />
          <Filter label="COMPLEXITY" value={complexity} options={["All levels", "Basic"]} onChange={setComplexity} />
          <Filter label="CIRCUIT" value={circuit} options={["All circuits", "RC filter"]} onChange={setCircuit} />
          <button className="reset" type="button" onClick={() => { setModel("All models"); setComplexity("All levels"); setCircuit("All circuits") }}>Reset</button>
        </section>

        {visible ? (
          <section className="benchmark" id="runs">
            <header className="benchmark-header">
              <div>
                <div className="benchmark-title"><span className="status-dot" /><h2>{run.model}</h2><span className="tag">{run.complexity}</span></div>
                <p>{run.prompt}</p>
              </div>
              <div className="facts"><span>2 components</span><span>36 × 22 mm</span><span>Run 001</span></div>
            </header>

            <div className="view-tabs" role="tablist" aria-label="Output view">
              <button className={view === "pcb" ? "active" : ""} role="tab" aria-selected={view === "pcb"} onClick={() => setView("pcb")}>PCB</button>
              <button className={view === "schematic" ? "active" : ""} role="tab" aria-selected={view === "schematic"} onClick={() => setView("schematic")}>Schematic</button>
            </div>

            <div className="comparison">
              {run.platforms.map((platform) => {
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
        ) : (
          <section className="empty"><p>No benchmark runs match these filters.</p><button type="button" onClick={() => { setModel("All models"); setComplexity("All levels"); setCircuit("All circuits") }}>Clear filters</button></section>
        )}
      </main>
    </div>
  )
}
