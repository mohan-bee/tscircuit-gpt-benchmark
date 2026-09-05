# Repeatable PCB benchmarks

Scores are **100% automatic**. Models generate files; no model grades a result.
The UI provides side-by-side SVGs for human inspection, individual metric points,
raw measurements, source downloads, and baseline/candidate score differences.

## Run

Use Node 22+, `npm ci`, and KiCad 10 with its matching `pcbnew` Python module.
The lockfile pins the tscircuit CLI, compiler, exporters and viewer dependencies.

1. Copy `benchmarks/models.example.json` and configure an OpenAI-compatible chat
   completions endpoint, exact model identifier, implementation label and key
   environment variable for each model. The benchmark path is relative to this config.
2. Set the named API-key environment variables outside the repository.
3. Run `npm run benchmark -- --config benchmarks/models.example.json`.
4. Run `npm run validate:evaluations`, then `npm run dev` to view results.

Every model receives the exact same single prompt and generation settings. That
prompt requests both formats in one JSON response. No repairs, retries, hidden
platform-specific instructions or automatically installed generated dependencies
are used. Providers must support temperature, seed and max_tokens; unsupported
requests fail explicitly. A seed reduces variability but does not guarantee a
remote provider is deterministic. Use immutable model IDs and repeat runs.

macOS defaults target /Applications/KiCad.app. Elsewhere set `KICAD_CLI` and
`KICAD_PYTHON` to absolute executable paths. Linux headless runs can use
`xvfb-run -a npm run benchmark:smoke`. CI uses KiCad's
[official Ubuntu PPA](https://www.kicad.org/download/linux-distros/); the installed
version is recorded and different versions cannot produce comparable deltas.
Some restricted macOS sessions cannot initialize KiCad's GUI services even in
CLI mode; these attempts are saved as failures, never substituted with drawings.

Generated TSX executes code. Run model generation/builds in a disposable isolated
machine with no personal files or credentials. Child processes receive a small
environment allowlist, never the model API key, but this is **not a sandbox**.
The runner imposes per-command timeouts and caps captured logs. File output is
restricted to three named native source files; response JSON cannot choose paths.

## Offline replay and native smoke test

`npm run benchmark:smoke` evaluates the existing RC sources without calling a
model. It runs both real builders and renderers. Saved results clearly identify
this as a fixture replay, not a newly generated model response. To replay another
saved response use:

```sh
npm run benchmark -- --config benchmarks/models.example.json --replay response.json
```

Replay expects `{"files":{"index.circuit.tsx":"…","board.kicad_pcb":"…","board.kicad_sch":"…"}}`.
The runner also saves the original provider envelope for online requests. Extract
its message's JSON content into a separate replay file. Replay and API runs have
different comparison protocols.

## Versioning and provenance

Definitions live at `benchmarks/<id>/v<number>/benchmark.json` and include the
literal prompt, expected component values, pin groups, board constraints,
generation settings and scoring weights. `benchmarks/versions.json` freezes each
file's SHA-256. To change any rule or prompt, add v2 and its checksum; retain v1.
Validation checks hashes and, with `BENCHMARK_BASE_REF=origin/main`, refuses changes
or removal of any previously published checksum. CI performs this check.

Each invocation creates a unique immutable batch under
`public/evaluations/<batch>/<attempt>/{tscircuit,kicad}/result.json`. Both platform
records are always saved, including compiler, renderer, API and DRC failures.
Original source files, renderer output, evaluated native boards, DRC JSON,
native geometry/net metadata, exact request/response and command logs are kept.
Every artifact has a SHA-256; validation recomputes measurements and scores from
the committed raw inputs. No central result registry needs editing.

Each result records model/implementation, timestamp, benchmark identity/hash,
dependency lock hash, evaluator source hash, runtime/OS/architecture and KiCad
version. A UI delta is permitted only for the same definition, CAD platform and
evaluation protocol. Changes to the **generation implementation label** can be
compared; changes to the evaluator require re-evaluating both designs under the
new evaluator. Arbitrary historical scores are never treated as a model regression.

## Automatic scoring, v1

| Metric | Maximum | Raw input / rule |
| --- | ---: | --- |
| DRC errors | 20 | Error-severity native violations plus schematic/PCB parity errors |
| Unrouted nets | 10 | Distinct native nets referenced by DRC unconnected endpoints |
| Component overlaps | 10 | Same-side footprint bounding-box intersections, excluding reference/value text |
| Missing connections | 25 | Missing required pins, inconsistent assigned net codes, or required nets merged together |
| Components | 10 | Exact reference and allowed value matches, penalizing unexpected parts |
| Board dimensions | 5 | Both dimensions within tolerance and exact copper layer count |
| Trace clearance | 10 | Native clearance, copper-edge, hole-clearance and short-circuit violations |
| Routing completion | 10 | Completed required pin connections / required pin connections |

Count metrics use `weight / (1 + count)`. Component points are
`weight × max(0, 1 − (incorrect + unexpected) / expected)`.
Dimension points are all-or-nothing. Routing requires every expected pin in the
net, a nonzero consistent assigned net, no merged required net, and no DRC
unconnected endpoints on that net. Singleton nets need no route and add no
routing denominator. A zero-denominator design gets zero routing points.
Failures score zero. Raw scores are stored without rounding; only display is rounded.
A change greater than 0.5 points is an improvement/regression; smaller changes
are unchanged. DRC and specific violation metrics intentionally overlap.

tscircuit is built through the pinned official CLI. Its original PCB/schematic
SVG and Circuit JSON are retained, and its official KiCad export is checked using
the same native DRC as KiCad-generated designs. This comparison measures the
whole generation/build/export pipeline, including exporter defects. The evaluated
KiCad SVG is also retained as `validated-pcb.svg`.

The runner replaces generated project rule preferences with benchmark-owned
minimum clearance rules and no exclusions, refills zones, and runs parity checks.
KiCad's Python API supplies footprint/net geometry; DRC supplies connectivity
violations. Board dimensions include the Edge.Cuts line width, accommodated by
the frozen tolerance. Overlaps are a conservative bounding-box proxy, not exact
courtyard polygon intersection. Clearance records are violations against a known
threshold, not a falsely precise measured global minimum. v1 does not validate
simulation behavior, fabrication suitability, or every possible footprint detail.
Do not compare scores across CAD tools as if their export paths were identical.

## Verification

```sh
npm run validate:benchmarks
npm run validate:evaluations
npm test
npm run build
npm run benchmark:smoke
```
