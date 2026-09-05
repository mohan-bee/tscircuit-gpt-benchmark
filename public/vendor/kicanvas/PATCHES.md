# Local integration patch

The bundle is built from the revision recorded in `REVISION` with small embed API additions:

- `zoom="objects"` fits board embeds to `Edge.Cuts` and hides the drawing sheet.
- `zoom="objects"` fits schematic embeds to their actual circuit content and hides the drawing sheet.
- `boardlayers="..."` selects the physical PCB layers visible on initial load.
- `theme="kicad"` is forwarded through the embed app to the PCB and schematic viewers.
- In `src/viewers/board/layers.ts`, move `LayerNames.f_silks` immediately before
  `f_cu`, and `b_silks` immediately before `b_cu`. Layer insertion is front to
  back, and rendering reverses it. This keeps each side's silkscreen above its
  opaque copper zones and mask instead of disappearing beneath them. Pad and
  drill ordering and explicit layer highlighting are unchanged.

`src/kicanvas-layers.test.js` executes this shipped bundle's `LayerSet` (minified
as `q3` in the pinned revision) and checks both sides with copper and fills
visible. Update that symbol if rebuilding with a different minifier output.

All KiCanvas controls remain available, so viewers can reveal other layers or flip the board interactively.
