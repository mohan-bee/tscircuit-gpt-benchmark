import { createRouter } from "./routing"
import { UsbC } from "./components/UsbC"
import { Fragment } from "react"
import { ESP32_C3_WROOM_02U_N4 as Esp32 } from "./imports/ESP32_C3_WROOM_02U_N4"
import { TMP102AIDRLR as Temperature } from "./imports/TMP102AIDRLR"
import { ADXL345BCCZ_RL7 as Motion } from "./imports/ADXL345BCCZ_RL7"
import { AP2112K_3_3TRG1 as Regulator } from "./imports/AP2112K_3_3TRG1"
import { U_FL_R_SMT_1_10_ as Antenna } from "./imports/U_FL_R_SMT_1_10_"
import { TS_1088_AR02016 as Button } from "./imports/TS_1088_AR02016"
import { USBLC6_2SC6 as UsbEsd } from "./imports/USBLC6_2SC6"
import { SS14 as PowerDiode } from "./imports/SS14"
import { RFM95W } from "./components/RFM95W"

// Physical coordinates in mm; schematic sections have independent coordinates.
const resistors = [
  ["R1","5.1k",-7,-13,"USB",-28,24,"CC1","GND"],
  ["R2","5.1k",5,-13,"USB",-28,19.42,"CC2","GND"],
  ["R3","22",-1,8,"USB",-21,24,"USB_DP","MCU_DP"],
  ["R4","22",-1,6,"USB",-21,20,"USB_DM","MCU_DM"],
  ["R5","10k",-25,13,"MCU",-6,23,"V3V3","EN"],
  ["R6","10k",-17,-8,"MCU",-6,19,"V3V3","BOOT"],
  ["R7","10k",0,15,"MCU",-6,15,"V3V3","MISO"],
  ["R8","10k",-25,5,"MCU",-6,11,"V3V3","STATUS"],
  ["R9","1k",-18,-3,"MCU",8,10.46,"V3V3","LED_A"],
  ["R10","4.7k",-25,0,"Sensors",-27,-5,"V3V3","SDA"],
  ["R11","4.7k",-21,0,"Sensors",-27,-9,"V3V3","SCL"],
  ["R12","10k",0,3,"Radio",21,17,"V3V3","LORA_CS"],
  ["R13","10k",0,0,"Radio",21,13,"V3V3","LORA_RST"],
] as const
const capacitors = [
  ["C1","1uF",9,-16,"USB",-14,20,"VBUS"],
  ["C2","10uF",14,-9,"Power",16,-7,"VIN"],
  ["C3","22uF",21,-9,"Power",30,-7,"V3V3"],
  ["C4","100nF",18,-6,"Power",30,-11,"V3V3"],
  ["C5","10uF",-26,19,"MCU",-6,7,"V3V3"],
  ["C6","100nF",-26,16,"MCU",-6,3,"V3V3"],
  ["C7","1uF",-25,10,"MCU",8,3,"EN"],
  ["C8","10uF",24,16,"Radio",35,23,"V3V3"],
  ["C9","100nF",23,12,"Radio",35,19,"V3V3"],
  ["C10","100nF",-27,-7,"Sensors",-12,-5,"V3V3"],
  ["C11","1uF",-17,-15,"Sensors",-12,-9,"V3V3"],
  ["C12","100nF",-26,-15,"Sensors",-12,-13,"V3V3"],
] as const
const nets: Record<string,string[]> = {
  VBUS:["J1.VBUS1","J1.VBUS2","D1.anode","U6.pin5"],
  BAT:["J2.pin1","D2.anode"],
  VIN:["D1.cathode","D2.cathode","U3.VIN","U3.EN"],
  V3V3:["U3.VOUT","U1.pin1","U2.VCC","U4.V_POS","U5.pin1","U5.pin6","U5.pin7","J3.pin1","J4.pin1"],
  GND:["J1.GND1","J1.GND2","J1.SHELL1","J1.SHELL2","J1.SHELL3","J1.SHELL4",
    "J2.pin2","U3.GND","U1.pin9",...Array.from({length:9},(_,i)=>`U1.pin${19+i}`),
    "U2.GND1","U2.GND2","U2.GND3","J5.GND1","J5.GND2","U4.GND","U4.ADD0",
    "U5.pin2","U5.pin4","U5.pin5","U5.pin12","U6.pin2","SW1.pin2","SW2.pin2","J3.pin2","J4.pin2"],
  CC1:["J1.CC1"], CC2:["J1.CC2"],
  USB_DP:["J1.DP1","J1.DP2","U6.pin1","U6.pin6"],
  USB_DM:["J1.DM1","J1.DM2","U6.pin3","U6.pin4"],
  MCU_DP:["U1.IO19"], MCU_DM:["U1.IO18"],
  EN:["U1.EN","SW1.pin1"], BOOT:["U1.IO9","SW2.pin1"],
  SDA:["U1.IO4","U4.SDA","U5.pin13","J4.pin3"],
  SCL:["U1.IO5","U4.SCL","U5.pin14","J4.pin4"],
  MOTION_INT:["U1.IO0","U5.INT1"],
  SCK:["U1.IO6","U2.SCK"], MOSI:["U1.IO7","U2.MOSI"],
  MISO:["U1.IO2","U2.MISO"], LORA_CS:["U1.IO10","U2.NSS"],
  LORA_RST:["U1.IO3","U2.RESET"], LORA_IRQ:["U1.RXD","U2.DIO0"],
  STATUS:["U1.IO8","LED1.cathode"], LED_A:["LED1.anode"],
  GPIO1:["U1.IO1","J3.pin3"], GPIO21:["U1.TXD","J3.pin4"],
}
export default function SensorBoard() {
  return <board width={60} height={44} layers={2} thickness={1.6}
    title="FIELDNODE / ESP32-C3 + LoRa" borderRadius={1.5} autorouter={{local: true, algorithmFn: async input => createRouter(input)}} minTraceWidth={0.2} minViaHoleDiameter={0.3} minViaPadDiameter={0.6} minViaEdgeToPadEdgeClearance={0.15} minTraceToPadEdgeClearance={0.15}>
    {["USB","Power","MCU","Radio","Sensors","GPIO"].map(name=><schematicsection name={name}/>)}
    <UsbC name="J1" pcbX={-1} pcbY={-18} schSectionName="USB" schX={-35} schY={23}/>
    <pinheader name="J2" pinCount={2} pitch={2.54} pcbX={25} pcbY={-19} schSectionName="Power" schX={12} schY={-7.48}/>
    <PowerDiode name="D1" pcbX={10} pcbY={-12} schSectionName="Power" schX={18} schY={-3}/>
    <PowerDiode name="D2" pcbX={23} pcbY={-14} schSectionName="Power" schX={18} schY={-15}/>
    <Regulator schHeight={0.6} name="U3" pcbX={17} pcbY={-12} schSectionName="Power" schX={24} schY={-5}/>
    <UsbEsd name="U6" pcbX={-1} pcbY={-11} schSectionName="USB" schX={-20} schY={29}/>
    <Esp32 name="U1" pcbX={-13} pcbY={11} schSectionName="MCU" schX={1} schY={22} schWidth={2} schHeight={2.8}/>
    <RFM95W name="U2" pcbX={11} pcbY={11} schSectionName="Radio" schX={28} schY={26} schWidth={2} schHeight={1.8}/>
    <Antenna schHeight={0.4} name="J5" pcbX={23} pcbY={4} schSectionName="Radio" schX={36} schY={28}/>
    <trace from=".U2 > .ANT" to=".J5 > .SIN" thickness={1} pcbPath={[".U2 > .ANT",".J5 > .SIN"]}/>
    <Temperature name="U4" pcbX={-27} pcbY={-3} schSectionName="Sensors" schX={-20} schY={-4}/>
    <Motion name="U5" pcbX={-22} pcbY={-11} schSectionName="Sensors" schX={-20} schY={-13.78} schWidth={2.8} schHeight={1.6}/>
    <Button name="SW1" pcbX={-12} pcbY={-4} schSectionName="MCU" schX={8} schY={23}/>
    <Button name="SW2" pcbX={-12} pcbY={-10} schSectionName="MCU" schX={8} schY={19}/>
    <led name="LED1" color="green" footprint="0603" pcbX={-18} pcbY={-6} schSectionName="MCU" schX={8} schY={7}/>
    <pinheader name="J3" pinCount={4} pitch={2.54} pcbX={-17} pcbY={-20} schSectionName="GPIO" schX={0} schY={-7}/>
    <pinheader name="J4" pinCount={4} pitch={2.54} pcbX={10} pcbY={-20} schSectionName="GPIO" schX={5} schY={-7}/>
    {resistors.map(([name,resistance,pcbX,pcbY,section,schX,schY,a,b])=><Fragment key={name}>
      <resistor name={name} resistance={resistance} footprint="0603" pcbX={pcbX} pcbY={pcbY} schSectionName={section} schX={schX} schY={schY}/>
      <trace from={`.${name} > .pin1`} to={`net.${a}`} schDisplayLabel={a}/><trace from={`.${name} > .pin2`} to={`net.${b}`} schDisplayLabel={b}/>
    </Fragment>)}
    {capacitors.map(([name,capacitance,pcbX,pcbY,section,schX,schY,supply])=><Fragment key={name}>
      <capacitor schOrientation="vertical" name={name} capacitance={capacitance} footprint={capacitance==="22uF"?"0805":"0603"} pcbX={pcbX} pcbY={pcbY} schSectionName={section} schX={schX} schY={schY}/>
      <trace from={`.${name} > .pin1`} to={`net.${supply}`} schDisplayLabel={supply}/><trace from={`.${name} > .pin2`} to="net.GND" schDisplayLabel="GND"/>
    </Fragment>)}
    {Object.entries(nets).map(([name,pins])=><Fragment key={name}>
      <net name={name} isGroundNet={name==="GND"} isPowerNet={["VBUS","BAT","VIN","V3V3"].includes(name)} nominalTraceWidth={["VBUS","BAT","VIN","V3V3","GND"].includes(name)?0.5:0.2}/>
      {pins.map(pin=><trace key={pin} from={`.${pin.split(".")[0]} > .${pin.split(".")[1]}`} to={`net.${name}`} schDisplayLabel={name}/>)}
    </Fragment>)}
    <copperpour name="RfReference" layer="bottom" connectsTo="net.GND" unbroken outline={[{x:18,y:1},{x:27,y:1},{x:27,y:7},{x:18,y:7}]}/>
    {[ [20.5,2], [22,2], [24.5,2], [20.5,6], [22,6], [24.5,6], [-28,8], [-28,-11], [26,-8], [26,10] ].map(([x,y])=><via pcbX={x} pcbY={y} holeDiameter={0.3} outerDiameter={0.6} fromLayer="top" toLayer="bottom" connectsTo="net.GND"/>) }
    <copperpour name="GroundBottom" layer="bottom" connectsTo="net.GND" clearance={0.25} boardEdgeMargin={0.4}/>
    <copperpour name="GroundTop" layer="top" connectsTo="net.GND" clearance={0.25} boardEdgeMargin={0.4}/>
    <hole name="H1" diameter={2.2} pcbX={-27} pcbY={-19}/>
    <hole name="H2" diameter={2.2} pcbX={27} pcbY={19}/>
    <silkscreentext text="FIELDNODE | REV A" pcbX={0} pcbY={20.5} fontSize={1}/>
    <silkscreentext text="RESET" pcbX={-12} pcbY={-6.5} fontSize={0.8}/>
    <silkscreentext text="BOOT" pcbX={-12} pcbY={-12.5} fontSize={0.8}/>
    <silkscreentext text="BAT 4-5.5V" pcbX={24} pcbY={-16.5} fontSize={0.75}/>
    <silkscreentext text="TEMP" pcbX={-27} pcbY={-0.7} fontSize={0.7}/>
    <silkscreentext text="USB-C" pcbX={-1} pcbY={-14.5} fontSize={0.8}/>
  </board>
}
