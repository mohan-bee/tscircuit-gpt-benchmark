# Add a benchmark run

Each run is one metadata file plus the native CAD sources and snapshots generated from those sources. The dashboard discovers new runs automatically; do not edit `src/App.tsx`.

## 1. Copy the template

Copy `benchmark-template/benchmark.json` to:

```text
src/benchmarks/<run-id>/benchmark.json
```

Fill in the model, complexity, circuit, exact prompt, component count, board size, and renderer versions. Run IDs use lowercase letters, numbers, and hyphens.

## 2. Add source files and generated snapshots

Use this layout:

```text
public/benchmarks/<run-id>/
├── kicad/
│   ├── board.kicad_pcb
│   ├── board.kicad_sch
│   ├── pcb.png
│   └── schematic.svg
└── tscircuit/
    ├── index.circuit.tsx
    ├── pcb.svg
    └── schematic.svg
```

The metadata paths are public URLs, so `/benchmarks/run-002/kicad/pcb.png` points to `public/benchmarks/run-002/kicad/pcb.png`.

Snapshots must be renderer output from the source committed in the same run. Never add a hand-drawn approximation or placeholder.

## 3. Generate and verify

For KiCad, use a local `kicad-cli` and record its exact version in `renderer`:

```bash
/Applications/KiCad.app/Contents/MacOS/kicad-cli sch upgrade public/benchmarks/<run-id>/kicad/board.kicad_sch --force
/Applications/KiCad.app/Contents/MacOS/kicad-cli pcb upgrade public/benchmarks/<run-id>/kicad/board.kicad_pcb --force
/Applications/KiCad.app/Contents/MacOS/kicad-cli sch export svg --black-and-white --exclude-drawing-sheet --output public/benchmarks/<run-id>/kicad/schematic.svg public/benchmarks/<run-id>/kicad/board.kicad_sch
/Applications/KiCad.app/Contents/MacOS/kicad-cli pcb render --side top --quality high --output public/benchmarks/<run-id>/kicad/pcb.png public/benchmarks/<run-id>/kicad/board.kicad_pcb
```

For tscircuit, run `tsci check netlist`, `tsci check schematic-placement`, `tsci check placement`, and `tsci build`, then export the PCB and schematic snapshots from that result with the official renderer.

Open all four snapshots and confirm that they match the committed source. Then run:

```bash
npm run validate:benchmarks
npm test
npm run build
```

`validate:benchmarks` rejects missing artifacts, duplicate IDs, invalid platform pairs, and non-native source extensions.
