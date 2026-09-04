import { lazy, Suspense, useEffect, useMemo, useState, type ComponentProps, type ReactNode } from "react"
import { ChevronDown, Code2, Download, ExternalLink, Maximize2, Minus, Plus, SlidersHorizontal } from "lucide-react"
import { benchmarkRuns, type BenchmarkRun } from "./benchmarks"

type SnapshotKind = "pcb" | "schematic"

const MIN_ZOOM = 1
const MAX_ZOOM = 2.5
const ZOOM_STEP = 0.25

const PCBViewer = lazy(() => import("@tscircuit/pcb-viewer").then((module) => ({ default: module.PCBViewer })))
const SchematicViewer = lazy(() => import("@tscircuit/schematic-viewer").then((module) => ({ default: module.SchematicViewer })))

type CircuitJsonState =
  | { status: "loading" }
  | { status: "ready"; data: Array<Record<string, unknown>> }
  | { status: "error" }

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

function SnapshotViewer({ kind, image, source, platform }: { kind: SnapshotKind; image: string; source: string; platform: string }) {
  const [zoom, setZoom] = useState(MIN_ZOOM)
  const label = kind === "pcb" ? "PCB" : "Schematic"
  const changeZoom = (amount: number) => setZoom((current) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, current + amount)))

  return (
    <section className={`snapshot-viewer snapshot-viewer--${kind}`}>
      <header className="snapshot-toolbar">
        <div><span className="snapshot-kind">{label}</span><span className="snapshot-format">SVG · GENERATED</span></div>
        <div className="snapshot-actions">
          <button type="button" onClick={() => changeZoom(-ZOOM_STEP)} disabled={zoom === MIN_ZOOM} aria-label={`Zoom out ${platform} ${kind}`}><Minus size={14} /></button>
          <button className="zoom-readout" type="button" onClick={() => setZoom(MIN_ZOOM)} aria-label={`Reset ${platform} ${kind} zoom`}>{Math.round(zoom * 100)}%</button>
          <button type="button" onClick={() => changeZoom(ZOOM_STEP)} disabled={zoom === MAX_ZOOM} aria-label={`Zoom in ${platform} ${kind}`}><Plus size={14} /></button>
          <span className="snapshot-action-separator" />
          <a href={image} target="_blank" rel="noreferrer" aria-label={`View ${platform} ${kind} snapshot`}><Maximize2 size={14} /></a>
          <a href={source} download aria-label={`Download ${platform} ${kind} source`}><Download size={14} /></a>
          <a href={source} target="_blank" rel="noreferrer" aria-label={`Open ${platform} ${kind} source`}><Code2 size={14} /></a>
        </div>
      </header>
      <div className="snapshot-viewport">
        <div className="snapshot-canvas" style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}>
          <img src={image} alt={`${platform} ${kind} snapshot`} />
        </div>
      </div>
    </section>
  )
}

function InteractiveViewerFrame({ kind, image, source, platform, children }: { kind: SnapshotKind; image: string; source: string; platform: string; children: ReactNode }) {
  const label = kind === "pcb" ? "PCB" : "Schematic"

  return (
    <section className={`snapshot-viewer snapshot-viewer--${kind}`}>
      <header className="snapshot-toolbar">
        <div><span className="snapshot-kind">{label}</span><span className="snapshot-format">CIRCUIT JSON · INTERACTIVE</span></div>
        <div className="snapshot-actions">
          <span className="interaction-hint">PAN · ZOOM{kind === "pcb" ? " · LAYERS" : " · SEARCH"}</span>
          <span className="snapshot-action-separator" />
          <a href={image} target="_blank" rel="noreferrer" aria-label={`View ${platform} ${kind} snapshot`}><Maximize2 size={14} /></a>
          <a href={source} download aria-label={`Download ${platform} ${kind} source`}><Download size={14} /></a>
          <a href={source} target="_blank" rel="noreferrer" aria-label={`Open ${platform} ${kind} source`}><Code2 size={14} /></a>
        </div>
      </header>
      <div className={`official-viewer official-viewer--${kind}`}>{children}</div>
    </section>
  )
}

function ViewerLoader({ kind }: { kind: SnapshotKind }) {
  return <div className={`viewer-loader viewer-loader--${kind}`} role="status">Loading interactive {kind} viewer…</div>
}

function TscircuitWorkspace({ kind, circuitJsonUrl, image, source, platform }: { kind: SnapshotKind; circuitJsonUrl: string; image: string; source: string; platform: string }) {
  const [circuitJson, setCircuitJson] = useState<CircuitJsonState>({ status: "loading" })

  useEffect(() => {
    const controller = new AbortController()
    setCircuitJson({ status: "loading" })
    fetch(circuitJsonUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load ${circuitJsonUrl}`)
        return response.json()
      })
      .then((data: unknown) => {
        if (!Array.isArray(data)) throw new Error("Circuit JSON must be an array")
        setCircuitJson({ status: "ready", data: data as Array<Record<string, unknown>> })
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return
        setCircuitJson({ status: "error" })
      })
    return () => controller.abort()
  }, [circuitJsonUrl])

  if (circuitJson.status === "error") {
    return (
      <div className="snapshot-stage">
        <p className="viewer-error" role="alert">Interactive viewer unavailable. Showing generated snapshots.</p>
        <SnapshotViewer kind={kind} image={image} source={source} platform={platform} />
      </div>
    )
  }

  if (circuitJson.status === "loading") {
    return <div className="snapshot-stage"><ViewerLoader kind={kind} /></div>
  }

  const pcbCircuitJson = circuitJson.data as unknown as NonNullable<ComponentProps<typeof PCBViewer>["circuitJson"]>
  const schematicCircuitJson = circuitJson.data as unknown as ComponentProps<typeof SchematicViewer>["circuitJson"]

  return (
    <div className="snapshot-stage">
      <InteractiveViewerFrame kind={kind} image={image} source={source} platform={platform}>
        <Suspense fallback={<ViewerLoader kind={kind} />}>
          {kind === "pcb" ? (
            <PCBViewer circuitJson={pcbCircuitJson} height={680} allowEditing={false} focusOnHover={false} clickToInteractEnabled={false} />
          ) : (
            <SchematicViewer circuitJson={schematicCircuitJson} containerStyle={{ width: "100%", height: "100%" }} clickToInteractEnabled={false} searchEnabled />
          )}
        </Suspense>
      </InteractiveViewerFrame>
    </div>
  )
}

function BenchmarkCard({ run }: { run: BenchmarkRun }) {
  const [view, setView] = useState<SnapshotKind>("pcb")

  return (
    <section className="benchmark">
      <header className="benchmark-header">
        <div>
          <div className="benchmark-title"><span className="status-dot" /><h2>{run.model}</h2><span className="tag">{run.complexity}</span></div>
          <p>{run.prompt}</p>
        </div>
        <div className="facts"><span>{run.components} components</span><span>{run.boardSize}</span><span>{run.id}</span></div>
      </header>

      <div className="view-tabs" role="tablist" aria-label={`${run.id} output view`}>
        <button className={view === "pcb" ? "active" : ""} type="button" role="tab" aria-selected={view === "pcb"} onClick={() => setView("pcb")}>PCB</button>
        <button className={view === "schematic" ? "active" : ""} type="button" role="tab" aria-selected={view === "schematic"} onClick={() => setView("schematic")}>Schematic</button>
      </div>

      <div className={`comparison${run.platforms.some(({ status }) => status === "pending") ? " comparison--pending" : ""}`}>
        {run.platforms.map((platform) => {
          if (platform.status === "pending") {
            return (
              <article className={`viewer viewer--${platform.name.toLowerCase()} viewer--pending`} key={platform.name}>
                <header>
                  <div><h3>{platform.name}</h3><span>Pending</span></div>
                </header>
                <div className={`pending-workspace pending-workspace--${view}`} aria-label={`${platform.name} output pending`} />
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
              </header>
              {platform.name === "tscircuit" && platform.circuitJson ? (
                <TscircuitWorkspace kind={view} circuitJsonUrl={platform.circuitJson} image={image} source={source} platform={platform.name} />
              ) : (
                <div className="snapshot-stage">
                  <SnapshotViewer kind={view} image={image} source={source} platform={platform.name} />
                </div>
              )}
              <footer><span>{view.toUpperCase()}</span><span>{platform.circuitJson ? "INTERACTIVE" : "GENERATED"}</span></footer>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export function App() {
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
            {visibleRuns.map((run) => <BenchmarkCard run={run} key={run.id} />)}
          </div>
        ) : (
          <section className="empty"><p>No benchmark runs match these filters.</p><button type="button" onClick={resetFilters}>Clear filters</button></section>
        )}
      </main>
    </div>
  )
}
