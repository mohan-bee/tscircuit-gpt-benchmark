import { ESP32_C3_MINI_1_N4 } from "./imports/ESP32_C3_MINI_1_N4"
import { CH340C } from "./imports/CH340C"
import { AP2112K_3_3TRG1 } from "./imports/AP2112K_3_3TRG1"

const smdButtonFootprint = (
  <footprint>
    <smtpad portHints={["pin1"]} pcbX="-2mm" width="1.6mm" height="2.2mm" shape="rect" />
    <smtpad portHints={["pin2"]} pcbX="2mm" width="1.6mm" height="2.2mm" shape="rect" />
    <silkscreenrect width="5.8mm" height="3.8mm" />
    <courtyardrect width="6.2mm" height="4.2mm" />
  </footprint>
)

export default function CompactEsp32C3Board() {
  return (
    <board
      name="ESP32_C3_DEV"
      width="30mm"
      height="58mm"
      routingDisabled={false}
    >
      <schematicsection name="usb" displayName="USB-C and USB-UART" />
      <schematicsection name="power" displayName="5 V to 3.3 V Power" />
      <schematicsection name="mcu" displayName="ESP32-C3 Module" />
      <schematicsection name="program" displayName="Boot, Reset and Auto-Program" />
      <schematicsection name="io" displayName="GPIO Breakout" />

      <connector
        name="J1"
        standard="usb_c"
        manufacturerPartNumber="USB4105-GF-A"
        footprint="kicad:Connector_USB/USB_C_Receptacle_GCT_USB4105-xx-A_16P_TopMnt_Horizontal"
        layer="top"
        pcbX={0}
        pcbY={-25.2}
        pcbRotation={0}
        shouldBeOnEdgeOfBoard
        schSectionName="usb"
        schX={-10}
        schY={0}
      />

      <CH340C name="U2" layer="top" pcbX={0} pcbY={-16.3} pcbRotation={0} schSectionName="usb" schX={-1.5} schY={0} />
      <resistor name="R1" resistance="5.1k" footprint="0402" layer="top" pcbX={-7.5} pcbY={-21.2} pcbRotation={90} schSectionName="usb" schX={-6} schY={-4} />
      <resistor name="R2" resistance="5.1k" footprint="0402" layer="top" pcbX={6} pcbY={-21.2} pcbRotation={90} schSectionName="usb" schX={-4} schY={-4} />
      <capacitor name="C1" capacitance="100nF" footprint="0402" layer="top" pcbX={-6.8} pcbY={-15.5} schSectionName="usb" schX={0} schY={-3} schOrientation="vertical" />
      <capacitor name="C2" capacitance="100nF" footprint="0402" layer="top" pcbX={-6.8} pcbY={-17.4} schSectionName="usb" schX={2} schY={-3} schOrientation="vertical" />

      <AP2112K_3_3TRG1 name="U3" layer="top" pcbX={8.3} pcbY={-10.4} pcbRotation={0} schSectionName="power" schX={-5} schY={0} schHeight={0.6} />
      <capacitor name="C3" capacitance="10uF" footprint="0603" layer="top" pcbX={8.3} pcbY={-14.2} pcbRotation={90} schSectionName="power" schX={-7} schY={-3} schOrientation="vertical" />
      <capacitor name="C4" capacitance="10uF" footprint="0603" layer="top" pcbX={11.2} pcbY={-10.8} pcbRotation={90} schSectionName="power" schX={1} schY={-3} schOrientation="vertical" />

      <ESP32_C3_MINI_1_N4 name="U1" layer="top" pcbX={0} pcbY={16.8} pcbRotation={0} schSectionName="mcu" schX={8} schY={0} schHeight={5.4} />
      <capacitor name="C5" capacitance="10uF" footprint="0603" layer="top" pcbX={-9.2} pcbY={10} pcbRotation={90} schSectionName="mcu" schX={4} schY={-4} schOrientation="vertical" />
      <capacitor name="C6" capacitance="100nF" footprint="0402" layer="top" pcbX={-7.5} pcbY={8.5} pcbRotation={90} schSectionName="mcu" schX={6} schY={-4} schOrientation="vertical" />

      <resistor name="R3" resistance="10k" footprint="0402" layer="top" pcbX={-8.2} pcbY={6.8} schSectionName="program" schX={-8} schY={2} />
      <capacitor name="C7" capacitance="1uF" footprint="0402" layer="top" pcbX={-8.2} pcbY={4.8} schSectionName="program" schX={-6} schY={-2} schOrientation="vertical" />
      <resistor name="R4" resistance="10k" footprint="0402" layer="top" pcbX={8.2} pcbY={6.8} schSectionName="program" schX={2} schY={2} />
      <pushbutton name="SW1" footprint={smdButtonFootprint} layer="top" pcbX={-7.8} pcbY={0.3} pcbRotation={90} schSectionName="program" schX={-3} schY={-3} />
      <pushbutton name="SW2" footprint={smdButtonFootprint} layer="top" pcbX={7.8} pcbY={0.3} pcbRotation={90} schSectionName="program" schX={5} schY={-3} />
      <transistor name="Q1" type="npn" footprint="sot23" layer="top" pcbX={-4.2} pcbY={-7.7} pcbRotation={90} schSectionName="program" schX={-5} schY={-8} />
      <transistor name="Q2" type="npn" footprint="sot23" layer="top" pcbX={4.2} pcbY={-7.7} pcbRotation={270} schSectionName="program" schX={3} schY={-8} />
      <resistor name="R5" resistance="10k" footprint="0402" layer="top" pcbX={-2.2} pcbY={-10.5} schSectionName="program" schX={-7} schY={-8.7} />
      <resistor name="R6" resistance="10k" footprint="0402" layer="top" pcbX={2.2} pcbY={-10.5} schSectionName="program" schX={1} schY={-8.7} />

      <led name="D1" color="green" footprint="0603" layer="top" pcbX={0} pcbY={4} pcbRotation={90} schSectionName="io" schX={9} schY={-5} />
      <resistor name="R7" resistance="1k" footprint="0402" layer="top" pcbX={0} pcbY={7} pcbRotation={90} schSectionName="io" schX={7} schY={-5} />

      <pinheader
        name="J2"
        pinCount={9}
        pitch="2.54mm"
        gender="female"
        layer="top"
        pcbX={-12.1}
        pcbY={7.5}
        pcbOrientation="vertical"
        showSilkscreenPinLabels
        pcbPinLabels={{ pin1: "3V3", pin2: "GND", pin3: "EN", pin4: "IO0", pin5: "IO1", pin6: "IO2", pin7: "IO3", pin8: "IO4", pin9: "IO5" }}
        schSectionName="io"
        schX={14}
        schY={0}
      />
      <pinheader
        name="J3"
        pinCount={9}
        pitch="2.54mm"
        gender="female"
        layer="top"
        pcbX={12.1}
        pcbY={7.5}
        pcbOrientation="vertical"
        showSilkscreenPinLabels
        pcbPinLabels={{ pin1: "VBUS", pin2: "GND", pin3: "IO6", pin4: "IO7", pin5: "IO8", pin6: "IO9", pin7: "IO10", pin8: "RX", pin9: "TX" }}
        schSectionName="io"
        schX={19}
        schY={0}
      />

      <keepout
        shape="rect"
        pcbX={0}
        pcbY={25.5}
        width="14mm"
        height="7mm"
        layers={["top", "bottom"]}
        excludeRefs={[".U1"]}
      />
      <copperpour name="GND_PLANE" layer="bottom" connectsTo="net.GND" clearance="0.2mm" boardEdgeMargin="0.3mm" useThermalReliefs />

      {/* USB-C power, data and configuration */}
      <trace from=".J1 > .pin2" to="net.VBUS" />
      <trace from=".J1 > .pin2" to=".J1 > .pin7" />
      <trace from=".J1 > .pin7" to=".J1 > .pin10" />
      <trace from=".J1 > .pin10" to=".J1 > .pin15" />
      <trace from=".J1 > .pin1" to="net.GND" />
      <trace from=".J1 > .pin1" to=".J1 > .pin8" />
      <trace from=".J1 > .pin8" to=".J1 > .pin9" />
      <trace from=".J1 > .pin9" to=".J1 > .pin16" />
      <trace from=".J1 > .pin17" to="net.GND" />
      <trace from=".J1 > .pin3" to=".R1 > .pin1" />
      <trace from=".R1 > .pin2" to="net.GND" />
      <trace from=".J1 > .pin11" to=".R2 > .pin1" />
      <trace from=".R2 > .pin2" to="net.GND" />
      <trace from=".J1 > .pin4" to="net.USB_DP" />
      <trace from=".J1 > .pin12" to="net.USB_DP" />
      <trace from=".J1 > .pin5" to="net.USB_DM" />
      <trace from=".J1 > .pin13" to="net.USB_DM" />
      <trace from=".U2 > .D_POS" to="net.USB_DP" />
      <trace from=".U2 > .D_NEG" to="net.USB_DM" />

      {/* Regulation and local decoupling */}
      <trace from=".U3 > .VIN" to="net.VBUS" />
      <trace from=".U3 > .EN" to="net.VBUS" />
      <trace from=".U3 > .GND" to="net.GND" />
      <trace from=".U3 > .VOUT" to="net.VCC_3V3" />
      <trace from=".C3 > .pin1" to="net.VBUS" />
      <trace from=".C3 > .pin2" to="net.GND" />
      <trace from=".C4 > .pin1" to="net.VCC_3V3" />
      <trace from=".C4 > .pin2" to="net.GND" />
      <trace from=".U2 > .VCC" to="net.VCC_3V3" />
      <trace from=".U2 > .V3" to="net.VCC_3V3" />
      <trace from=".U2 > .GND" to="net.GND" />
      <trace from=".C1 > .pin1" to="net.VCC_3V3" />
      <trace from=".C1 > .pin2" to="net.GND" />
      <trace from=".C2 > .pin1" to="net.VCC_3V3" />
      <trace from=".C2 > .pin2" to="net.GND" />

      {/* ESP32-C3 supply and ground */}
      <trace from=".U1 > .3V3" to="net.VCC_3V3" />
      <trace from=".U1 > .pin1" to="net.GND" />
      <trace from=".U1 > .pin2" to="net.GND" />
      <trace from=".U1 > .pin11" to="net.GND" />
      <trace from=".U1 > .pin14" to="net.GND" />
      <trace from=".U1 > .pin36" to="net.GND" />
      <trace from=".U1 > .pin37" to="net.GND" />
      <trace from=".U1 > .pin38" to="net.GND" />
      <trace from=".U1 > .pin39" to="net.GND" />
      <trace from=".U1 > .pin40" to="net.GND" />
      <trace from=".U1 > .pin41" to="net.GND" />
      <trace from=".U1 > .pin42" to="net.GND" />
      <trace from=".U1 > .pin43" to="net.GND" />
      <trace from=".U1 > .pin44" to="net.GND" />
      <trace from=".U1 > .pin45" to="net.GND" />
      <trace from=".U1 > .pin46" to="net.GND" />
      <trace from=".U1 > .pin47" to="net.GND" />
      <trace from=".U1 > .pin48" to="net.GND" />
      <trace from=".U1 > .pin49" to="net.GND" />
      <trace from=".U1 > .pin50" to="net.GND" />
      <trace from=".U1 > .pin51" to="net.GND" />
      <trace from=".U1 > .pin52" to="net.GND" />
      <trace from=".U1 > .pin53" to="net.GND" />
      <trace from=".C5 > .pin1" to="net.VCC_3V3" />
      <trace from=".C5 > .pin2" to="net.GND" />
      <trace from=".C6 > .pin1" to="net.VCC_3V3" />
      <trace from=".C6 > .pin2" to="net.GND" />

      {/* UART and cross-coupled DTR/RTS automatic bootloader entry */}
      <trace from=".U2 > .TXD" to=".U1 > .RXD0" />
      <trace from=".U2 > .RXD" to=".U1 > .TXD0" />
      <trace from=".U2 > .N_DTR" to="net.DTR_N" />
      <trace from=".U2 > .N_RTS" to="net.RTS_N" />
      <trace from="net.DTR_N" to=".R5 > .pin1" />
      <trace from=".R5 > .pin2" to=".Q1 > .base" />
      <trace from=".Q1 > .emitter" to="net.RTS_N" />
      <trace from=".Q1 > .collector" to="net.EN" />
      <trace from="net.RTS_N" to=".R6 > .pin1" />
      <trace from=".R6 > .pin2" to=".Q2 > .base" />
      <trace from=".Q2 > .emitter" to="net.DTR_N" />
      <trace from=".Q2 > .collector" to="net.IO9" />

      {/* Manual reset and boot controls */}
      <trace from=".U1 > .EN" to="net.EN" />
      <trace from=".R3 > .pin1" to="net.VCC_3V3" />
      <trace from=".R3 > .pin2" to="net.EN" />
      <trace from=".C7 > .pin1" to="net.EN" />
      <trace from=".C7 > .pin2" to="net.GND" />
      <trace from=".SW1 > .pin1" to="net.EN" />
      <trace from=".SW1 > .pin2" to="net.GND" />
      <trace from=".U1 > .IO9" to="net.IO9" />
      <trace from=".R4 > .pin1" to="net.VCC_3V3" />
      <trace from=".R4 > .pin2" to="net.IO9" />
      <trace from=".SW2 > .pin1" to="net.IO9" />
      <trace from=".SW2 > .pin2" to="net.GND" />

      {/* User status LED on GPIO8, active high */}
      <trace from=".U1 > .IO8" to=".R7 > .pin1" />
      <trace from=".R7 > .pin2" to=".D1 > .anode" />
      <trace from=".D1 > .cathode" to="net.GND" />

      {/* Left GPIO header */}
      <trace from=".J2 > .pin1" to="net.VCC_3V3" />
      <trace from=".J2 > .pin2" to="net.GND" />
      <trace from=".J2 > .pin3" to="net.EN" />
      <trace from=".J2 > .pin4" to=".U1 > .IO0" />
      <trace from=".J2 > .pin5" to=".U1 > .IO1" />
      <trace from=".J2 > .pin6" to=".U1 > .IO2" />
      <trace from=".J2 > .pin7" to=".U1 > .IO3" />
      <trace from=".J2 > .pin8" to=".U1 > .IO4" />
      <trace from=".J2 > .pin9" to=".U1 > .IO5" />

      {/* Right GPIO header */}
      <trace from=".J3 > .pin1" to="net.VBUS" />
      <trace from=".J3 > .pin2" to="net.GND" />
      <trace from=".J3 > .pin3" to=".U1 > .IO6" />
      <trace from=".J3 > .pin4" to=".U1 > .IO7" />
      <trace from=".J3 > .pin5" to=".U1 > .IO8" />
      <trace from=".J3 > .pin6" to="net.IO9" />
      <trace from=".J3 > .pin7" to=".U1 > .IO10" />
      <trace from=".J3 > .pin8" to=".U1 > .RXD0" />
      <trace from=".J3 > .pin9" to=".U1 > .TXD0" />

      <silkscreentext text="ESP32-C3" pcbX={0} pcbY={27.1} fontSize="1mm" />
      <silkscreentext text="RESET" pcbX={-7.7} pcbY={-3.1} fontSize="0.7mm" />
      <silkscreentext text="BOOT" pcbX={7.7} pcbY={-3.1} fontSize="0.7mm" />
      <silkscreentext text="USB-C" pcbX={0} pcbY={-28} fontSize="0.7mm" />
    </board>
  )
}
