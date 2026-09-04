# Local integration patch

The bundle is built from the revision recorded in `REVISION` with small embed API additions:

- `zoom="objects"` fits board embeds to `Edge.Cuts` and hides the drawing sheet.
- `zoom="objects"` fits schematic embeds to their actual circuit content and hides the drawing sheet.
- `boardlayers="..."` selects the physical PCB layers visible on initial load.
- `theme="kicad"` is forwarded through the embed app to the PCB and schematic viewers.

All KiCanvas controls remain available, so viewers can reveal other layers or flip the board interactively.
