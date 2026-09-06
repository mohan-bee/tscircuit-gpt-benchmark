import { useState } from "react"
import { TscircuitRunFrame } from "./TscircuitRunFrame"
import { CircuitBoard, Download, Minus, Plus, Workflow } from "lucide-react"
import { benchmarkRuns, type BenchmarkRun } from "./benchmarks"

type SnapshotKind = "pcb" | "schematic"

const MIN_ZOOM = 1
const MAX_ZOOM = 2.5
const ZOOM_STEP = 0.25

function SnapshotViewer({ kind, image, platform }: { kind: SnapshotKind; image: string; platform: string }) {
  const [zoom, setZoom] = useState(MIN_ZOOM)
  const changeZoom = (amount: number) => setZoom((current) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, current + amount)))

  return (
    <section className={`snapshot-viewer snapshot-viewer--${kind}`}>
      <div className="zoom-controls">
        <button type="button" onClick={() => changeZoom(-ZOOM_STEP)} disabled={zoom === MIN_ZOOM} aria-label={`Zoom out ${platform} ${kind}`}><Minus size={14} /></button>
        <button className="zoom-readout" type="button" onClick={() => setZoom(MIN_ZOOM)} aria-label={`Reset ${platform} ${kind} zoom`}>{Math.round(zoom * 100)}%</button>
        <button type="button" onClick={() => changeZoom(ZOOM_STEP)} disabled={zoom === MAX_ZOOM} aria-label={`Zoom in ${platform} ${kind}`}><Plus size={14} /></button>
      </div>
      <div className="snapshot-viewport">
        <div className="snapshot-canvas" style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}>
          <img src={image} alt={`${platform} ${kind} snapshot`} />
        </div>
      </div>
    </section>
  )
}

function KicadWorkspace({ kind, source }: { kind: SnapshotKind; source: string }) {
  return (
    <div className="snapshot-stage">
      <section className={`kicanvas-viewer kicanvas-viewer--${kind}`}>
        <kicanvas-embed
          key={source}
          src={source}
          controls="full"
          controlslist="nodownload flipview"
          theme="kicad"
          zoom="objects"
          boardlayers={kind === "pcb" ? "F.Cu,F.SilkS,Edge.Cuts" : undefined}
          aria-label={`KiCanvas KiCad ${kind} viewer`}
        />
      </section>
    </div>
  )
}


function BenchmarkCard({ run }: { run: BenchmarkRun }) {
  const [view, setView] = useState<SnapshotKind>("pcb")
  const [viewRevision, setViewRevision] = useState(0)
  const selectSharedView = (kind: SnapshotKind) => {
    setView(kind)
    setViewRevision((revision) => revision + 1)
  }

  return (
    <section className="benchmark" aria-label={`${run.model} benchmark`}>
      <div className="visualization" aria-label={`Benchmark visualization for ${run.model}`}>
        <header className="workspace-heading">
          <div>
            <h2>{run.circuit}</h2>
            <p>{run.model} <span>·</span> {run.complexity} <span>·</span> {run.boardSize}</p>
          </div>
          <div className="view-tabs" role="tablist" aria-label={`${run.id} output view`}>
            <button className={view === "pcb" ? "active" : ""} type="button" role="tab" aria-selected={view === "pcb"} onClick={() => selectSharedView("pcb")}>PCB</button>
            <button className={view === "schematic" ? "active" : ""} type="button" role="tab" aria-selected={view === "schematic"} onClick={() => selectSharedView("schematic")}>Schematic</button>
          </div>
        </header>
        <details className="prompt-panel" aria-label={`Prompt for ${run.circuit}`}>
          <summary className="prompt-heading">Board prompt</summary>
          <p>{run.prompt}</p>
        </details>

        <div className={`comparison${run.platforms.some(({ status }) => status === "pending") ? " comparison--pending" : ""}`}>
          {run.platforms.map((platform) => {
            if (platform.status === "pending") {
              return (
                <article className={`viewer viewer--${platform.name.toLowerCase()} viewer--pending`} key={platform.name}>
                  <header><h2>{platform.name}</h2><span>Pending</span></header>
                  <div className={`pending-workspace pending-workspace--${view}`} aria-label={`${platform.name} output pending`} />
                </article>
              )
            }
            const image = view === "pcb" ? platform.pcb : platform.schematic
            return (
              <article className={`viewer viewer--${platform.name.toLowerCase()}`} key={platform.name}>
                <header>
                  <h2>{platform.name}</h2>
                  <div className="viewer-actions">
                    <span>{platform.name === "KiCad" && "KiCanvas · "}{platform.renderer}</span>
                    {platform.name === "KiCad" && (
                      <a className="source-download" href={view === "pcb" ? platform.pcbSource : platform.schematicSource} download aria-label={`Download KiCad ${view === "pcb" ? "PCB" : "schematic"}`}>
                        {view === "pcb" ? <CircuitBoard size={15} aria-hidden="true" /> : <Workflow size={15} aria-hidden="true" />}
                        Download {view === "pcb" ? "PCB" : "schematic"}
                        <Download size={13} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </header>
                {(platform.activeTime || platform.boardDetails) && (
                  <dl className="board-details" aria-label={`${platform.name} benchmark details`}>
                    {platform.activeTime && <div><dt>Active time</dt><dd>{platform.activeTime}</dd></div>}
                    {platform.boardDetails && <div><dt>Board</dt><dd>{platform.boardDetails}</dd></div>}
                  </dl>
                )}
                {platform.boardFeatures && (
                  <details className="prompt-panel board-features" aria-label={`${platform.name} board features`}>
                    <summary className="prompt-heading">Board features</summary>
                    <p>{platform.boardFeatures}</p>
                  </details>
                )}
                {platform.name === "KiCad" ? (
                  <KicadWorkspace kind={view} source={view === "pcb" ? platform.pcbSource : platform.schematicSource} />
                ) : platform.circuitJson ? (
                  <TscircuitRunFrame key={viewRevision} defaultView={view} onViewChange={setView} circuitJsonUrl={platform.circuitJson} sourceUrl={platform.pcbSource} projectName={run.id} />
                ) : (
                  <div className="snapshot-stage">
                    <SnapshotViewer kind={view} image={image} platform={platform.name} />
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function App() {
  const [model, setModel] = useState("all")
  const [complexity, setComplexity] = useState("all")
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null)
  const dashboardRuns = benchmarkRuns.filter((run) => run.visible)
  const models = [...new Set(dashboardRuns.map((run) => run.model))]
  const complexities = [...new Set(dashboardRuns.map((run) => run.complexity))]
  const visibleRuns = dashboardRuns.filter((run) => (
    (model === "all" || run.model === model) &&
    (complexity === "all" || run.complexity === complexity)
  ))
  const selectedRun = visibleRuns.find(({ id }) => id === selectedRunId) ?? visibleRuns[0]

  return (
    <main className="benchmark-page">
      <header className="topbar">
        <div className="topbar-title">
          <span>One Shot Prompt Boards</span>
          <h1>Benchmark explorer</h1>
        </div>

        <div className="filters" aria-label="Benchmark filters">
          <label className="filter-control">
            <span>Model</span>
            <select value={model} onChange={(event) => setModel(event.target.value)} aria-label="Filter by model">
              <option value="all">All models</option>
              {models.map((name) => <option value={name} key={name}>{name}</option>)}
            </select>
          </label>
          <label className="filter-control">
            <span>Complexity</span>
            <select value={complexity} onChange={(event) => setComplexity(event.target.value)} aria-label="Filter by complexity">
              <option value="all">All complexities</option>
              {complexities.map((name) => <option value={name} key={name}>{name}</option>)}
            </select>
          </label>
        </div>
      </header>

      <div className="workspace-layout">
        <aside className="board-sidebar" aria-label="Board list">
          <header>
            <div>
              <h2>Benchmarks</h2>
              <p className="sidebar-description">Existing board runs</p>
            </div>
            <strong>{visibleRuns.length}</strong>
          </header>
          <nav aria-label="Select a board">
            {visibleRuns.map((run) => (
              <button
                className={run.id === selectedRun?.id ? "active" : ""}
                type="button"
                aria-pressed={run.id === selectedRun?.id}
                onClick={() => setSelectedRunId(run.id)}
                key={run.id}
              >
                <span>{run.circuit}</span>
                <small>{run.model}</small>
                <em>{run.complexity} · {run.boardSize}</em>
              </button>
            ))}
          </nav>
        </aside>

        <section className="visualization-list" aria-label="Benchmark visualizations">
          {selectedRun && <BenchmarkCard run={selectedRun} key={selectedRun.id} />}
          {!selectedRun && <p className="empty-state">No benchmarks match these filters.</p>}
        </section>
      </div>
    </main>
  )
}
