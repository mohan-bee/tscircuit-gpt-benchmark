# FIELDNODE — ESP32-C3 LoRa sensor board

Status: fully routed and digitally validated. Final tscircuit build: zero DRC errors. Independent copper geometry audit: zero shorts and zero disconnected nets across 27 nets. Netlist, schematic placement, PCB placement and TypeScript checks pass. Hardware, RF impedance and USB signal integrity have not been bench-validated.

An isolated tscircuit project created from scratch. No KiCad tools, files, libraries, or local designs were used as references. Component footprints come from JLCPCB/EasyEDA imports, native tscircuit primitives, and the HopeRF manufacturer drawing. The USB connector footprint is frozen from the native tscircuit standard-parts engine, with locator bores represented as non-plated holes.

## Hardware

- 60 × 44 mm, two copper layers, 1.6 mm FR-4, all components on top.
- ESP32-C3-WROOM-02U-N4 with native USB Serial/JTAG programming. Attach an external 2.4 GHz antenna to its onboard connector when using Wi-Fi/BLE.
- RFM95W-868S2 SPI LoRa module, separate U.FL antenna connector. Use an antenna suitable for the intended frequency. Firmware must configure the intended regional band; no radio firmware is included.
- TI TMP102 temperature sensor at I²C address 0x48.
- Analog Devices ADXL345 motion/acceleration sensor at I²C address 0x53, INT1 connected to GPIO0.
- One green status LED, active low, and dedicated reset/boot buttons.
- USB-C 5 V input with separate 5.1 kΩ CC resistors, 22 Ω USB series resistors and USBLC6 ESD protection.
- J2 battery input: pin 1 positive, pin 2 ground; 4–5.5 V input. Schottky ORing isolates USB and battery sources. AP2112 generates 3.3 V. No charger or single-cell lithium battery undervoltage protection is included. A single Li-ion cell is not supported over its full discharge range.
- J3: 3V3, GND, GPIO1, GPIO21. J4: 3V3, GND, GPIO4/SDA, GPIO5/SCL. All signal pins are 3.3 V logic. J4 shares the sensor bus.

## GPIO assignments

| Function | ESP32-C3 GPIO |
| --- | --- |
| USB D− / D+ | 18 / 19 |
| I²C SDA / SCL | 4 / 5 |
| LoRa SCK / MOSI / MISO | 6 / 7 / 2 |
| LoRa NSS / RESET / DIO0 | 10 / 3 / 20 |
| Motion INT1 | 0 |
| Status LED, active low | 8 |
| BOOT button | 9 |
| Free GPIO header | 1 / 21 |

GPIO2, GPIO8 and GPIO9 have 10 kΩ pull-ups for boot strapping. LoRa NSS and RESET also have pull-ups. To enter the ROM downloader manually, hold BOOT, press and release RESET, then release BOOT. USB programming does not require a USB-UART bridge.

## Layout and validation

The radio modules occupy the upper half of the board. The 3.2 mm LoRa RF feed is explicitly drawn on the top layer, with ground stitching and a reserved bottom ground reference region. Both layers have GND pours. The temperature sensor sits at the left edge, approximately 44 mm from the regulator; the motion sensor is close to the lower-left mounting point. Power conversion uses a linear regulator to avoid a switching node.

The short RF feed is a nominal layout, not a field-solver-verified 50 Ω structure. Confirm its impedance against the fabricator's actual stackup. USB differential geometry and complete routing must be inspected after autorouting. The AP2112 600 mA rating is not a guarantee of continuous thermal capacity at maximum battery input; this design targets duty-cycled sensing and radio transmissions. Sustained simultaneous Wi-Fi/LoRa operation needs a measured thermal and power budget.

Final checks are recorded in `reports/final-status.json` and `reports/copper-audit.json`. The audit checks actual copper polygons and through-hole connections, including ground pours. The CLI bitmap shorts command was unavailable because of a canvas runtime error; the independent Shapely audit was used instead. There are 125 routed trace objects and 106 vias, including ten explicit ground-stitching vias. Signal/power traces are 0.2 mm minimum; the short RF feed is 1 mm. The board has GND copper on both layers. Source metadata warnings, including the LED supplier-footprint comparison, remain in the build log; this is an engineering handoff, not a released assembly BOM.

## Build

```sh
npm install
npx tsci check netlist index.circuit.tsx
npx tsci check schematic-placement index.circuit.tsx
npx tsci check placement index.circuit.tsx
npm run build
python3 -m venv .venv
.venv/bin/pip install -r requirements-validation.txt
.venv/bin/python verify_copper.py dist/index/circuit.json
```

The local package override pins circuit-json to a version compatible with the installed core, and TypeScript to 5.9.3. Do not remove these pins without checking the CLI.

Routing is performed entirely with the tscircuit capacity autorouter. `routing.ts` reserves additional trace and via space during solving, restores the intended copper dimensions, and bypasses a stale phase-cache issue. Design-rule checks and the independent copper audit run against the restored final dimensions. The user authorized continuation after the initial failed routing attempt; no KiCad tools were used.

## Manufacturer references

- [Espressif ESP32-C3-WROOM-02/02U datasheet](https://documentation.espressif.com/esp32-c3-wroom-02_datasheet_en.html)
- [HopeRF RFM95W v2.0 datasheet](https://www.hoperf.com/uploads/RFM95W-V2.0_1695351437.pdf), pinout pp.10–11, dimensions p.122.
- [TI TMP102 datasheet](https://www.ti.com/lit/ds/symlink/tmp102.pdf)
- [Analog Devices ADXL345 datasheet](https://www.analog.com/media/en/technical-documentation/data-sheets/ADXL345.pdf)
- [Diodes AP2112 datasheet](https://www.diodes.com/datasheet/download/AP2112.pdf)

Unused pins are intentional: TMP102 ALERT; ADXL345 reserved, NC and INT2; RFM95 DIO1–DIO5; USB SBU. Firmware can poll the LoRa status registers when using features that normally use DIO1.

## Benchmark provenance

Exact tool versions and machine-readable counts are in benchmark.json. Use npm ci with the committed lockfile to reproduce.

The successful final routing phase took **17.7 seconds**, recorded in reports/routing-fix-5.txt. This excludes setup, design work, failed attempts, DRC and image export. Total active design time was not measured. This was a resumed, iterative design, not a one-shot completion. Validation reports identify circuit.json by SHA-256.

There are 41 electronic components. The 51 pcb_component records include ten explicit stitching-via components; all 106 vias are counted separately. Both PCB and schematic use index.circuit.tsx and its committed local imports.
