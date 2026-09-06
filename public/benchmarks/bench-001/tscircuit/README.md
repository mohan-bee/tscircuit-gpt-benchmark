# Rover RP2040 — revision A

Original 64 × 50 mm, two-layer robot controller designed in tscircuit. The motor and bulk-power area is on the left; RP2040, flash, USB and sensor circuitry occupy the right. Both layers have ground copper, with thermal and stitching vias. All 85 fitted components are on the top side.

## Included hardware

- RP2040, 2 MB QSPI flash, 12 MHz crystal, BOOT and RESET jumpers, and SWD header.
- Two independent DRV8837 H-bridges, two motor connectors and separate motor supply input.
- Two quadrature encoder headers, with series resistors, pull-ups and input filtering.
- LSM6DS3TR-C six-axis IMU on I²C, address **0x6A**, with interrupt to GPIO22.
- Four servo headers; ten-pin GPIO expansion; separate I²C expansion; status LED.
- USB-C for USB full-speed programming and logic power, CC pull-downs, ESD protection, and 27 Ω data resistors.
- Diode-isolated USB/external logic power and AP2112K 3.3 V regulator.

## Power and operating assumptions

| Connection | Supply / function |
|---|---|
| J_VM | Pin 1: motor +5–9 V; pin 2: GND |
| J_5V | Pin 1: regulated external +5 V; pin 2: GND |
| USB-C | Powers logic and programs RP2040; does not power the servo rail |
| J_S1–J_S4 | Pin 1: GND; pin 2: external 5 V; pin 3: servo signal |

Motor voltage and stall current were not supplied. This revision assumes small 5–9 V motors, with **1 A per motor as a provisional design target, not a verified continuous rating**. Motor stall current, driver dissipation and copper heating require bench validation. Size the regulated servo supply for the actual servos; use an initial total servo budget of 2 A pending thermal testing. Motor power alone does not power the MCU: supply USB or J_5V as well. The inputs have no fuse or reverse-polarity protection.

Encoder and expansion signals are **3.3 V only**. Encoders may be 3.3 V push-pull or open-collector; do not connect 5 V push-pull outputs. Servo signals are 3.3 V, so select compatible servos. BOOT and RESET are two-pin jumper headers, not fitted pushbuttons. To enter USB boot mode, short J_BOOT while applying power or resetting, then remove the short. J_RESET pulls RUN low.

## Connector pinout

Pin 1 is the square pad. Numbering follows the PCB, including rotated headers. The bottom preview is viewed through the board from above, not mirrored.

| Header | Pins in numerical order |
|---|---|
| J_M1 / J_M2 | Motor A, Motor B |
| J_ENC1 / J_ENC2 | 3.3 V, GND, A, B |
| J_SWD | 3.3 V reference, SWDIO, SWCLK, GND |
| J_BOOT | BOOT_SW, GND |
| J_RESET | RUN, GND |
| J_I2C | 3.3 V, GND, SDA, SCL |
| J_GPIO | GND, 3.3 V, GPIO16, GPIO17, GPIO18, GPIO19, GPIO8, GPIO9, GPIO26/ADC0, GPIO27/ADC1 |

J_VM and the motor connectors use 3.5 mm pitch through-hole land patterns. Select mechanically matching connectors; the footprint is not a verified terminal-block body model. Other headers use 2.54 mm pitch.

## Firmware assignments

| RP2040 GPIO | Function |
|---|---|
| 0, 1 | Motor 1 IN1, IN2 |
| 2, 3 | Motor 2 IN1, IN2 |
| 4, 5 | Encoder 1 A, B |
| 6, 7 | Encoder 2 A, B |
| 11 | Shared motor nSLEEP enable; pulled low at reset |
| 12–15 | Servo 1–4 signals |
| 20, 21 | I²C SDA, SCL |
| 22 | IMU INT1 |
| 25 | Status LED, active high |
| 8, 9, 16–19, 26, 27 | Expansion |

## Validation and fabrication status

The final tscircuit build completes. Independent tscircuit netlist, schematic, PCB routing and placement-error checks report zero errors. CLI PCB placement reports zero errors and zero warnings. The independent placement library additionally reports 20 missing-courtyard warnings for manually placed ground/thermal vias; these are not fitted parts. Schematic placement has no collisions or excessive-padding violations. Two contradictory suggestions to move J_VM up and down merely shorten separate VM/GND schematic wires; the connector remains centered.

An additional polygon-based copper check includes pads, traces, vias and the ground pours: **zero copper shorts, one connected ground network, no disconnected ground pads**. Floating pour islands were removed. See the machine-readable checks and CLI logs in the project ZIP.

These are **prototype fabrication outputs**, not an electrically tested production release. Confirm the imported land patterns, connector body clearances, assembly rotations, paste openings and component substitutions with the assembler. The BOM specifies generic passive values and packages; it is not a fully sourced purchasing BOM. Automatic supplier substitutions from the parts engine were not adopted because several footprints differ. The checked MPNs/JLC references are listed for the principal ICs and connector.

Design rules: 1.6 mm FR-4, two copper layers, nominal 1 oz copper, 0.15 mm signal traces, 0.10 mm minimum checked pad/trace clearance, 0.20 mm ground-pour clearance and 0.40 mm copper-to-edge margin. Autorouted vias are 0.45/0.20 mm pad/drill; thermal vias are 0.40/0.20 mm, stitching vias 0.60/0.30 mm. Discuss the exposed-pad via and stencil treatment with the assembler. Main motor output traces target 0.60 mm, motor/servo supply traces 0.80 mm, with narrower component escape segments. Current capability remains subject to thermal validation.

USB is full-speed, with short routes; controlled impedance and signal integrity have not been qualified against a fabricator stackup. Bring-up should verify rails, USB enumeration, flash boot, IMU identity, encoder counting and motor/servo operation under progressively increasing load. No firmware is included.

## Rebuilding and editing

The project ZIP contains `checked.circuit.tsx` and `checked-routes.json`. The TSX uses tscircuit's custom-autorouter hook to replay the verified paths. `index.circuit.tsx` is the editable automatic-routing variant; editing component positions or connectivity requires a fresh route and full revalidation. The final `robot.circuit.json` is the authoritative exported geometry, including removal of floating copper islands.

```sh
bun install --frozen-lockfile
bunx tsci build checked.circuit.tsx
bun finalize.ts
python3 -m venv scratch/geometry-env
scratch/geometry-env/bin/pip install numpy shapely==2.0.7
scratch/geometry-env/bin/python scratch/copper-check.py
scratch/geometry-env/bin/python scratch/copper-check.py
bun finalize.ts --existing
```

The first copper check removes disconnected pour islands only when all ground pads already connect to the main network; the second records the resulting clean geometry. Export files appear under `release/`. Use `bunx tsci dev checked.circuit.tsx` for interactive viewing. Do not reuse fixed routes after changing the circuit.

No KiCad tools were used. No KiCad files on this machine were read or used as references. All design work took place in an isolated project directory, using native tscircuit JSX and component imports.

## Primary references

- [RP2040 datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf)
- [Raspberry Pi hardware design guidance](https://datasheets.raspberrypi.com/rp2040/hardware-design-with-rp2040.pdf)
- [TI DRV8837 datasheet](https://www.ti.com/lit/ds/symlink/drv8837.pdf)
- [ST LSM6DS3TR-C datasheet](https://www.st.com/resource/en/datasheet/lsm6ds3tr-c.pdf)
- [ST USBLC6-2 datasheet](https://www.st.com/resource/en/datasheet/usblc6-2.pdf)
- [Diodes AP2112 datasheet](https://www.diodes.com/datasheet/download/AP2112.pdf)

Timing is recorded separately in `TIMING.md` and `timing.csv`. It measures elapsed design/tool time, including routing iterations and validation, not physical fabrication or assembly.
