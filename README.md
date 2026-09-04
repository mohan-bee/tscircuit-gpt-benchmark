# PCB Mirror

A small, visual side-by-side viewer for the same RC circuit in tscircuit and KiCad. It deliberately avoids scores and analysis: two tools, two schematics, and two PCB views.

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

The original circuit sources live in `public/examples`. The tscircuit SVGs are rendered from `index.circuit.tsx`; the KiCad views correspond to the included `.kicad_pcb` and legacy `.sch` files.
