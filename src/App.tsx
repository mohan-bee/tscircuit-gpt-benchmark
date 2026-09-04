import { lazy, Suspense, useEffect, useState, type ComponentProps, type ReactNode } from "react"
import { Minus, Plus } from "lucide-react"
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

function InteractiveViewerFrame({ kind, children }: { kind: SnapshotKind; children: ReactNode }) {
  return (
    <section className={`snapshot-viewer snapshot-viewer--${kind}`}>
      <div className={`official-viewer official-viewer--${kind}`}>{children}</div>
    </section>
  )
}

function ViewerLoader({ kind }: { kind: SnapshotKind }) {
  return <div className={`viewer-loader viewer-loader--${kind}`} role="status">Loading {kind}…</div>
}

function TscircuitWorkspace({ kind, circuitJsonUrl, image, platform }: { kind: SnapshotKind; circuitJsonUrl: string; image: string; platform: string }) {
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
        <p className="viewer-error" role="alert">Interactive view unavailable.</p>
        <SnapshotViewer kind={kind} image={image} platform={platform} />
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
      <InteractiveViewerFrame kind={kind}>
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
        <p className="field-label">Model</p>
        <h1>{run.model}</h1>
        <p className="field-label">Prompt</p>
        <p className="prompt">{run.prompt}</p>
      </header>

      <div className="visualization" aria-label={`Benchmark visualization for ${run.model}`}>
        <div className="view-tabs" role="tablist" aria-label={`${run.id} output view`}>
          <button className={view === "pcb" ? "active" : ""} type="button" role="tab" aria-selected={view === "pcb"} onClick={() => setView("pcb")}>PCB</button>
          <button className={view === "schematic" ? "active" : ""} type="button" role="tab" aria-selected={view === "schematic"} onClick={() => setView("schematic")}>Schematic</button>
        </div>

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
                <header><h2>{platform.name}</h2>{platform.name === "KiCad" && <span>KiCanvas</span>}</header>
                {platform.name === "KiCad" ? (
                  <KicadWorkspace kind={view} source={view === "pcb" ? platform.pcbSource : platform.schematicSource} />
                ) : platform.circuitJson ? (
                  <TscircuitWorkspace kind={view} circuitJsonUrl={platform.circuitJson} image={image} platform={platform.name} />
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
  return (
    <main className="benchmark-page">
      {benchmarkRuns.map((run) => <BenchmarkCard run={run} key={run.id} />)}
    </main>
  )
}
