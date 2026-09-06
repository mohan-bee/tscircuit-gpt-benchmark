# PCB Bench

A minimal benchmark viewer for comparing the same AI-generated circuit across tscircuit and KiCad. Filter by model and complexity, then switch both tool columns between PCB and schematic snapshots.

The tscircuit column embeds the full RunFrame preview with PCB, schematic, 3D, source code, assembly, pinout, BOM, Circuit JSON, and error tabs, plus its File menu and fullscreen control. It loads the saved benchmark output and displays source code read-only. PCB and schematic selections stay synchronized with the comparison tabs; other RunFrame views stay within the tscircuit column.

## Run locally

```bash
npm install
npm run dev
```

## Verify

```bash
npm test
npm run build
```

Regenerate every snapshot from its committed source with:

```bash
./scripts/render-snapshots.sh
```

The KiCad images are generated locally with KiCad CLI 10.0.1. See `AGENTS.md` for the no-placeholder snapshot policy and verification workflow.

## Add a model run

Copy `benchmark-template/benchmark.json` to `src/benchmarks/<run-id>/benchmark.json`, add the available native sources and generated snapshots under `public/benchmarks/<run-id>/`, and fill in the exact model, prompt, complexity, circuit, and renderer versions. Mark an unavailable platform as pending so its column stays empty. The dashboard discovers the run and builds its filters automatically.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the file layout, renderer commands, and validation checklist.

## Automatic scoring and model comparisons

Run fixed, versioned prompts against multiple models, build both native CAD formats, and score objective checks out of 100. See [the benchmark runner guide](benchmarks/README.md) for setup, metrics, replay, provenance, and comparison rules. No AI judges are used.
