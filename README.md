# PCB Bench

A minimal benchmark viewer for comparing the same AI-generated circuit across tscircuit and KiCad. Filter by model and complexity, then switch both tool columns between PCB and schematic snapshots.

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
