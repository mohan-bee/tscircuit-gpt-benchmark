# ESP32 LoRa sensor board

Original native KiCad design from the GPT-6 (Codex) board-creation task. No tscircuit output was created; its comparison entry is pending.

Active board-creation time is **estimated at 35–40 minutes, excluding the interruption**. This was inferred from saved file timestamps, not measured with an active-time timer. It excludes the subsequent viewer/PR work. No reliable token count was recorded.

The board is 54 × 50 mm, 1.0 mm thick, with two copper layers, 44 components and 31 nets. `validation.json` records 157 verified pin connections, 346 track segments and 48 vias. The included DRC/ERC reports have no violations and the PCB has no unconnected items. The design has not been fabricated or bench-tested; these are CAD results, not physical performance measurements.

It uses an ESP32-C3-WROOM-02U, RFM95W-868S2, TMP102 and LIS3DH. Battery input is for an externally charged, protected 1S LiPo; no charger is included. The native PCB and schematic are displayed with the repository's existing KiCanvas viewer. The generated 3D snapshot lacks USB-C and RFM95 module bodies because their library footprints have no 3D models; their native footprint geometry is present.

Snapshots were regenerated from the sources in this directory with **KiCad CLI 10.0.1**:

```sh
kicad-cli sch upgrade sensor-node.kicad_sch --force
kicad-cli pcb upgrade sensor-node.kicad_pcb --force
kicad-cli sch export svg --black-and-white --exclude-drawing-sheet -o ./ sensor-node.kicad_sch
kicad-cli pcb render --side top --quality high --width 1500 --height 1500 -o pcb.png sensor-node.kicad_pcb
```

The project-local symbols and footprints derive from [KiCad libraries](https://www.kicad.org/libraries/), under [CC BY-SA 4.0 with the KiCad library exception](https://www.kicad.org/libraries/license/). Routing used [Freerouting 2.4.1](https://github.com/freerouting/freerouting). The LIS3DH symbol is configured for I²C mode and connector silk overhangs are moved to the fabrication layer.
