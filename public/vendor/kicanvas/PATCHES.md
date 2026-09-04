# Local integration patch

The bundle is built from the revision recorded in `REVISION` with two small embed API additions:

- `zoom="objects"` fits board embeds to `Edge.Cuts` and hides the drawing sheet.
- `boardlayers="..."` selects the physical PCB layers visible on initial load.

All KiCanvas controls remain available, so viewers can reveal other layers or flip the board interactively.
