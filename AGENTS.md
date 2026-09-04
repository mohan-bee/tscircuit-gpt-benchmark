# PCB benchmark repository instructions

This repository compares AI-generated PCB outputs across CAD tools. Every visible snapshot must be generated from the source files committed beside it.

## Required benchmark inputs

- The original RC-filter fixture remains the baseline run and keeps the paths below.
- Keep the tscircuit source in `public/examples/tscircuit/index.circuit.tsx`.
- Keep the KiCad sources in `public/examples/kicad/rc-filter.kicad_sch` and `public/examples/kicad/rc-filter.kicad_pcb`.
- A benchmark run must identify its model, complexity, circuit, prompt, and renderer version.
- Do not add benchmark scores unless a scoring method and its raw inputs are also committed.

## Adding benchmark runs

- Add one auto-discovered metadata file at `src/benchmarks/<run-id>/benchmark.json`; do not edit the dashboard or a central registry.
- Start from `benchmark-template/benchmark.json` and follow `benchmark.schema.json`.
- Commit new-run sources and generated artifacts under `public/benchmarks/<run-id>/{tscircuit,kicad}/`.
- Each run must contain exactly one tscircuit output and one KiCad output, each with PCB, schematic, source, and renderer metadata.
- Run `npm run validate:benchmarks` before committing. Missing files, duplicate IDs, invalid platform pairs, and non-native sources must fail validation.

## Snapshot policy

- Never hand-draw, trace, approximate, or cosmetically recreate a PCB or schematic snapshot.
- Never use a placeholder diagram as a fallback for a failed renderer.
- tscircuit snapshots must come from the committed TSX through `tsci build` or the official tscircuit renderer.
- KiCad snapshots must come from the committed native KiCad files through local `kicad-cli`.
- Baseline snapshot filenames are `public/assets/{tool}-pcb.*` and `public/assets/{tool}-schematic.svg`; new snapshots live beside their run under `public/benchmarks/<run-id>/`.
- If generation fails, fix the source or renderer invocation. Do not edit the generated image by hand.

## KiCad verification

Use a local KiCad CLI. On macOS the default executable is:

```text
/Applications/KiCad.app/Contents/MacOS/kicad-cli
```

Before committing KiCad snapshots:

1. Run `kicad-cli sch upgrade <file> --force` and `kicad-cli pcb upgrade <file> --force`.
2. Export the schematic with `kicad-cli sch export svg --black-and-white --exclude-drawing-sheet`.
3. Render the PCB with `kicad-cli pcb render --side top --quality high`.
4. Open both generated files and visually confirm that R1, C1, their connection, and labels are present.
5. Record the exact KiCad version in the benchmark UI.

## tscircuit verification

Before committing tscircuit snapshots:

1. Run `tsci check netlist`.
2. Run `tsci check schematic-placement` and `tsci check placement`.
3. Run `tsci build` and generate both PCB and schematic snapshots from that result.
4. Visually confirm that the snapshot matches the committed TSX.

## UI contract

- Use one shared two-tab control: `PCB` and `Schematic`.
- A tab change must update both tool columns together.
- Keep filters for model, complexity, circuit, and run metadata.
- Prefer a minimal black-and-white light theme. The snapshots, not decoration, are the focus.

Run `npm run validate:benchmarks`, `npm test`, and `npm run build` before pushing.
