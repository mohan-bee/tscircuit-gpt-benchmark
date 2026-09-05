import "./styles.css"
import { useState, type ReactNode } from "react"
import type { Definition, EvaluationResult } from "./schema"
import { compareResults } from "./scoring"

type View = "pcb" | "schematic"
const metricLabels = {
  drcErrors: "DRC errors",
  unroutedNets: "Unrouted nets",
  componentOverlaps: "Component overlaps",
  missingConnections: "Missing connections",
  components: "Required components",
  boardDimensions: "Board dimensions",
  traceClearance: "Trace clearance",
  routingCompletion: "Routing completion",
}

function ResultCard({
  result,
  renderCircuit,
  view,
}: {
  result: EvaluationResult
  view: View
  renderCircuit: (options: {
    url: string
    image: string
    kind: View
  }) => ReactNode
}) {
  const [interactive, setInteractive] = useState(false)
  const total = result.scores.total.toFixed(1) + " / 100"
  return (
    <article className="scored-result">
      <header>
        <div>
          <h3>{result.model}</h3>
          <p>
            {result.implementation} · {result.platform}
          </p>
        </div>
        <strong>{total}</strong>
      </header>
      <p>
        {new Date(result.createdAt).toLocaleString()} · {result.status}
      </p>
      {Boolean(result.provenance.replay) && (
        <p className="replay-label">
          Fixture replay · not a new model generation
        </p>
      )}
      {result.error && <p role="alert">{result.error}</p>}
      {result.artifacts[view + ".svg"] && (
        <a
          href={result.artifacts[view + ".svg"]}
          target="_blank"
          rel="noreferrer"
        >
          <img
            className="scored-preview"
            src={result.artifacts[view + ".svg"]}
            alt={
              result.model +
              " " +
              result.platform +
              " scored " +
              view.toUpperCase()
            }
          />
        </a>
      )}
      {result.artifacts["circuit.json"] && (
        <details onToggle={(event) => setInteractive(event.currentTarget.open)}>
          <summary>Interactive tscircuit {view}</summary>
          {interactive &&
            renderCircuit({
              url: result.artifacts["circuit.json"],
              image: result.artifacts[view + ".svg"],
              kind: view,
            })}
        </details>
      )}
      {!result.artifacts[view + ".svg"] && (
        <p className="empty-state">Build failed. No PCB render available.</p>
      )}
      <table>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {result.scores.metrics.map((metric) => (
            <tr key={metric.name}>
              <td>{metricLabels[metric.name]}</td>
              <td>
                {metric.score.toFixed(2)} / {metric.maximum}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {result.measurements && (
        <details>
          <summary>Raw measurements</summary>
          <dl className="measurement-list">
            {Object.entries(result.measurements).map(([name, measurement]) => (
              <div key={name}>
                <dt>{name}</dt>
                <dd>{measurement}</dd>
              </div>
            ))}
          </dl>
        </details>
      )}
      <details>
        <summary>Files and provenance</summary>
        <p>
          Benchmark {result.benchmarkId} v{result.benchmarkVersion}
        </p>
        <p className="checksum">Protocol {result.protocolHash}</p>
        <ul>
          {Object.entries(result.artifacts).map(([name, url]) => (
            <li key={name}>
              <a href={url} download>
                {name}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </article>
  )
}
export function ScoredComparison({
  results,
  definitions,
  renderCircuit,
}: {
  results: EvaluationResult[]
  definitions: Definition[]
  renderCircuit: (options: {
    url: string
    image: string
    kind: View
  }) => ReactNode
}) {
  const [view, setView] = useState<View>("pcb")
  const [benchmark, setBenchmark] = useState("all")
  const [platform, setPlatform] = useState("all")
  const [model, setModel] = useState("all")
  const [baselineId, setBaselineId] = useState("")
  const [candidateId, setCandidateId] = useState("")
  const filtered = results.filter(
    (result) =>
      (benchmark === "all" ||
        result.benchmarkId + "/v" + result.benchmarkVersion === benchmark) &&
      (platform === "all" || result.platform === platform) &&
      (model === "all" || result.model === model),
  )
  const baseline =
    filtered.find((result) => result.id === baselineId) || filtered[0]
  const candidate =
    filtered.find(
      (result) => result.id === candidateId && result.id !== baseline?.id,
    ) ||
    filtered.find(
      (result) =>
        result.id !== baseline?.id && result.platform === baseline?.platform,
    ) ||
    filtered[1]
  const definition = definitions.find(
    (entry) =>
      entry.id === baseline?.benchmarkId &&
      entry.version === baseline?.benchmarkVersion,
  )
  let comparison = null
  if (baseline && candidate && definition)
    comparison = compareResults({
      baseline,
      candidate,
      threshold: definition.scoring.regressionThreshold,
    })
  return (
    <section
      className="scored-benchmarks"
      aria-label="Scored benchmark comparison"
    >
      <header>
        <h2>Repeatable benchmarks</h2>
        <p>Fixed prompts · automatic checks · 100 objective points</p>
      </header>
      <div className="score-filters">
        <label>
          Benchmark version
          <select
            aria-label="Scored benchmark version"
            value={benchmark}
            onChange={(event) => setBenchmark(event.target.value)}
          >
            <option value="all">All versions</option>
            {definitions.map((entry) => (
              <option
                key={entry.id + entry.version}
                value={entry.id + "/v" + entry.version}
              >
                {entry.title} v{entry.version}
              </option>
            ))}
          </select>
        </label>
        <label>
          CAD tool
          <select
            aria-label="Scored CAD tool"
            value={platform}
            onChange={(event) => setPlatform(event.target.value)}
          >
            <option value="all">Both tools</option>
            <option value="tscircuit">tscircuit</option>
            <option value="kicad">KiCad</option>
          </select>
        </label>
        <label>
          Model
          <select
            aria-label="Scored model"
            value={model}
            onChange={(event) => setModel(event.target.value)}
          >
            <option value="all">All models</option>
            {[...new Set(results.map((result) => result.model))].map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>
      </div>
      {filtered.length === 0 && (
        <p>
          No scored runs yet. Run{" "}
          <code>
            npm run benchmark -- --config benchmarks/models.example.json
          </code>{" "}
          after configuring model endpoints.
        </p>
      )}
      {baseline && (
        <div className="score-filters">
          <label>
            Baseline
            <select
              aria-label="Baseline run"
              value={baseline.id}
              onChange={(event) => setBaselineId(event.target.value)}
            >
              {filtered.map((result) => (
                <option value={result.id} key={result.id}>
                  {result.model} · {result.implementation} · {result.platform} ·{" "}
                  {result.createdAt}
                </option>
              ))}
            </select>
          </label>
          <label>
            Candidate
            <select
              aria-label="Candidate run"
              value={candidate?.id || ""}
              onChange={(event) => setCandidateId(event.target.value)}
            >
              <option value="">Select another run</option>
              {filtered
                .filter((result) => result.id !== baseline.id)
                .map((result) => (
                  <option value={result.id} key={result.id}>
                    {result.model} · {result.implementation} · {result.platform}{" "}
                    · {result.createdAt}
                  </option>
                ))}
            </select>
          </label>
        </div>
      )}
      {comparison && (
        <p
          className={
            "score-change score-change--" +
            comparison.label.toLowerCase().replaceAll(" ", "-")
          }
          role="status"
        >
          {comparison.label}
          {comparison.delta !== null && (
            <span> · {comparison.delta.toFixed(2)} points vs baseline</span>
          )}
        </p>
      )}
      {definition && (
        <details className="fixed-prompt">
          <summary>
            Frozen prompt and scoring rules · v{definition.version}
          </summary>
          <p>{definition.prompt}</p>
          <pre>{JSON.stringify(definition.requirements, null, 2)}</pre>
          <p>
            Count metrics use weight / (1 + violations). Dimensions and layer
            count must match. Routing uses the fraction of required connections
            completed.
          </p>
        </details>
      )}
      <div className="view-tabs" role="tablist" aria-label="Scored output view">
        <button
          role="tab"
          aria-selected={view === "pcb"}
          onClick={() => setView("pcb")}
        >
          PCB
        </button>
        <button
          role="tab"
          aria-selected={view === "schematic"}
          onClick={() => setView("schematic")}
        >
          Schematic
        </button>
      </div>
      <div className="scored-grid">
        {baseline && (
          <ResultCard
            result={baseline}
            renderCircuit={renderCircuit}
            view={view}
          />
        )}
        {candidate && candidate.id !== baseline?.id && (
          <ResultCard
            result={candidate}
            renderCircuit={renderCircuit}
            view={view}
          />
        )}
      </div>
    </section>
  )
}
