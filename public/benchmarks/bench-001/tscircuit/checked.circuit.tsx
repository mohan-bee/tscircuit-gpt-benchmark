import { checkedRouting } from "./checked-routing"
import { UsbC } from "./imports/UsbC"
import { RP2040 } from "./imports/RP2040"
import { DRV8837DSGR } from "./imports/DRV8837DSGR"
import { LSM6DS3TR_C } from "./imports/LSM6DS3TR_C"
import { W25Q16JVSSIQ } from "./imports/W25Q16JVSSIQ"
import { AP2112K_3_3TRG1 } from "./imports/AP2112K_3_3TRG1"
import { USBLC6_2SC6 } from "./imports/USBLC6_2SC6"
import { ABM8_272_T3 } from "./imports/ABM8_272_T3"
export default function RobotController() { return (
<board width={64} height={50} layers={2} thickness={1.6} title="Rover RP2040 rev A" solderMaskColor="blue"
 autorouter={{local:true, algorithmFn:checkedRouting}} minTraceWidth={0.15} defaultTraceWidth={0.15} minTraceToPadEdgeClearance={0.1}
 minViaHoleDiameter={0.2} minViaPadDiameter={0.45} schTraceAutoLabelEnabled schMaxTraceDistance={0.01} isViaInPadAllowed>
<schematicsection name="MCU" />
<schematicsection name="USB" />
<schematicsection name="Power" />
<schematicsection name="Motors" />
<schematicsection name="Encoders" />
<schematicsection name="IMU" />
<schematicsection name="Servos" />
<schematicsection name="Expansion" />
<RP2040 name={"U1"} pcbX={7} pcbY={4} schX={0} schY={0} schSectionName={"MCU"} schHeight={5.8} />
<W25Q16JVSSIQ name={"U2"} pcbX={7} pcbY={15} schX={9} schY={8} schSectionName={"MCU"} pcbRotation={90} />
<ABM8_272_T3 name={"Y1"} pcbX={7} pcbY={-5} schX={14} schY={8} schSectionName={"MCU"} />
<resistor name={"R_XTAL"} pcbX={6.8} pcbY={-2.2} schX={19} schY={8} schSectionName={"MCU"} resistance={"1k"} footprint={"0402"} pcbRotation={90} />
<capacitor name={"C_X1"} pcbX={5} pcbY={-7.5} schX={9} schY={4} schSectionName={"MCU"} capacitance={"15pF"} footprint={"0402"} pcbRotation={0} schOrientation={"vertical"} />
<capacitor name={"C_X2"} pcbX={9} pcbY={-8.5} schX={14} schY={4} schSectionName={"MCU"} capacitance={"15pF"} footprint={"0402"} pcbRotation={0} schOrientation={"vertical"} />
<resistor name={"R_BOOT"} pcbX={8} pcbY={21} schX={19} schY={4} schSectionName={"MCU"} resistance={"1k"} footprint={"0402"} pcbRotation={0} />
<pinheader name={"J_BOOT"} pcbX={12.5} pcbY={21} schX={9} schY={0} schSectionName={"MCU"} pinCount={2} footprint={"pinrow2_p2.54mm"} pcbRotation={0} />
<resistor name={"R_CS"} pcbX={3.8} pcbY={20} schX={14} schY={0} schSectionName={"MCU"} resistance={"10k"} footprint={"0402"} pcbRotation={0} />
<resistor name={"R_RUN"} pcbX={12} pcbY={-3} schX={19} schY={0} schSectionName={"MCU"} resistance={"10k"} footprint={"0402"} pcbRotation={0} />
<pinheader name={"J_RESET"} pcbX={14} pcbY={-7} schX={9} schY={-4} schSectionName={"MCU"} pinCount={2} footprint={"pinrow2_p2.54mm"} pcbRotation={0} />
<capacitor name={"C_FLASH"} pcbX={1} pcbY={11.5} schX={14} schY={-4} schSectionName={"MCU"} capacitance={"100nF"} footprint={"0402"} pcbRotation={0} schOrientation={"vertical"} />
<capacitor name={"C_IO1"} pcbX={2} pcbY={6} schX={19} schY={-4} schSectionName={"MCU"} capacitance={"100nF"} footprint={"0402"} pcbRotation={90} schOrientation={"vertical"} />
<capacitor name={"C_IO2"} pcbX={2} pcbY={2} schX={9} schY={-8} schSectionName={"MCU"} capacitance={"100nF"} footprint={"0402"} pcbRotation={90} schOrientation={"vertical"} />
<capacitor name={"C_IO3"} pcbX={11} pcbY={-1.5} schX={14} schY={-8} schSectionName={"MCU"} capacitance={"100nF"} footprint={"0402"} pcbRotation={0} schOrientation={"vertical"} />
<capacitor name={"C_IO4"} pcbX={13} pcbY={2} schX={19} schY={-8} schSectionName={"MCU"} capacitance={"100nF"} footprint={"0402"} pcbRotation={90} schOrientation={"vertical"} />
<capacitor name={"C_IO5"} pcbX={13} pcbY={6} schX={9} schY={-12} schSectionName={"MCU"} capacitance={"100nF"} footprint={"0402"} pcbRotation={90} schOrientation={"vertical"} />
<capacitor name={"C_IO6"} pcbX={6.2} pcbY={10.5} schX={14} schY={-12} schSectionName={"MCU"} capacitance={"100nF"} footprint={"0402"} pcbRotation={0} schOrientation={"vertical"} />
<capacitor name={"C_USB"} pcbX={11.5} pcbY={10} schX={19} schY={-12} schSectionName={"MCU"} capacitance={"100nF"} footprint={"0402"} pcbRotation={0} schOrientation={"vertical"} />
<capacitor name={"C_CORE1"} pcbX={4} pcbY={10.5} schX={9} schY={-16} schSectionName={"MCU"} capacitance={"100nF"} footprint={"0402"} pcbRotation={0} schOrientation={"vertical"} />
<capacitor name={"C_CORE2"} pcbX={11} pcbY={-4.5} schX={14} schY={-16} schSectionName={"MCU"} capacitance={"100nF"} footprint={"0402"} pcbRotation={0} schOrientation={"vertical"} />
<capacitor name={"C_REGIN"} pcbX={15} pcbY={8.5} schX={19} schY={-16} schSectionName={"MCU"} capacitance={"1uF"} footprint={"0402"} pcbRotation={0} schOrientation={"vertical"} />
<capacitor name={"C_REGOUT"} pcbX={15.5} pcbY={6} schX={9} schY={-20} schSectionName={"MCU"} capacitance={"1uF"} footprint={"0402"} pcbRotation={0} schOrientation={"vertical"} />
<resistor name={"R_AVDD"} pcbX={16} pcbY={2} schX={14} schY={-20} schSectionName={"MCU"} resistance={"200"} footprint={"0402"} pcbRotation={90} />
<capacitor name={"C_AVDD"} pcbX={16} pcbY={0} schX={19} schY={-20} schSectionName={"MCU"} capacitance={"100nF"} footprint={"0402"} pcbRotation={0} schOrientation={"vertical"} />
<pinheader name={"J_SWD"} pcbX={5} pcbY={-11} schX={26} schY={-66} schSectionName={"Expansion"} pinCount={4} footprint={"pinrow4_p2.54mm"} pcbRotation={0} />
<UsbC name={"J_USB"} pcbX={21} pcbY={19.4} schX={26} schY={0} schSectionName={"USB"} pcbRotation={180} />
<resistor name={"R_CC1"} pcbX={15} pcbY={17} schX={32} schY={0} schSectionName={"USB"} resistance={"5.1k"} footprint={"0402"} pcbRotation={90} />
<resistor name={"R_CC2"} pcbX={27} pcbY={17} schX={38} schY={0} schSectionName={"USB"} resistance={"5.1k"} footprint={"0402"} pcbRotation={90} />
<USBLC6_2SC6 name={"U_ESD"} pcbX={23} pcbY={11} schX={26} schY={-7} schSectionName={"USB"} />
<resistor name={"R_DP"} pcbX={8} pcbY={10.5} schX={32} schY={-7} schSectionName={"USB"} resistance={"27"} footprint={"0402"} pcbRotation={90} />
<resistor name={"R_DM"} pcbX={9.2} pcbY={10.5} schX={38} schY={-7} schSectionName={"USB"} resistance={"27"} footprint={"0402"} pcbRotation={90} />
<capacitor name={"C_VBUS"} pcbX={27} pcbY={11} schX={26} schY={-14} schSectionName={"USB"} capacitance={"1uF"} footprint={"0603"} pcbRotation={0} schOrientation={"vertical"} />
<pinheader name={"J_5V"} pcbX={-11} pcbY={20} schX={52} schY={0} schSectionName={"Power"} pinCount={2} footprint={"pinrow2_p2.54mm"} pcbRotation={0} />
<diode name={"D_USB"} pcbX={16} pcbY={12} schX={58} schY={0} schSectionName={"Power"} footprint={"sma"} manufacturerPartNumber={"SS14"} supplierPartNumbers={{"jlcpcb": ["C2480"]}} />
<diode name={"D_EXT"} pcbX={-4} pcbY={20} schX={64} schY={0} schSectionName={"Power"} footprint={"sma"} manufacturerPartNumber={"SS14"} supplierPartNumbers={{"jlcpcb": ["C2480"]}} />
<AP2112K_3_3TRG1 name={"U_REG"} pcbX={-4} pcbY={14} schX={52} schY={-4.199} schSectionName={"Power"} schHeight={0.6} />
<capacitor name={"C_5LOG"} pcbX={-7.5} pcbY={14} schX={58} schY={-5} schSectionName={"Power"} capacitance={"1uF"} footprint={"0603"} pcbRotation={0} schOrientation={"vertical"} />
<capacitor name={"C_3V3"} pcbX={-0.5} pcbY={14} schX={64} schY={-5} schSectionName={"Power"} capacitance={"4.7uF"} footprint={"0603"} pcbRotation={0} schOrientation={"vertical"} />
<capacitor name={"C_5SERVO"} pcbX={-14} pcbY={-11} schX={52} schY={-10} schSectionName={"Power"} capacitance={"100uF"} footprint={"1210"} pcbRotation={0} schOrientation={"vertical"} />
<pinheader name={"J_VM"} pcbX={-22} pcbY={20} schX={0} schY={-32} schSectionName={"Motors"} pinCount={2} footprint={"pinrow2_p3.5mm"} pcbRotation={0} />
<capacitor name={"C_VM"} pcbX={-22} pcbY={15} schX={6} schY={-32} schSectionName={"Motors"} capacitance={"100uF"} footprint={"1210"} pcbRotation={0} schOrientation={"vertical"} />
<DRV8837DSGR name={"U_M1"} pcbX={-21} pcbY={8} schX={12} schY={-32} schSectionName={"Motors"} schHeight={1.0} />
<pinheader name={"J_M1"} pcbX={-28} pcbY={8} schX={0} schY={-37} schSectionName={"Motors"} pinCount={2} footprint={"pinrow2_p3.5mm"} pcbRotation={90} />
<capacitor name={"C_M1VM"} pcbX={-24} pcbY={10} schX={6} schY={-37} schSectionName={"Motors"} capacitance={"100nF"} footprint={"0603"} pcbRotation={90} schOrientation={"vertical"} />
<capacitor name={"C_M1BULK"} pcbX={-21} pcbY={12} schX={12} schY={-37} schSectionName={"Motors"} capacitance={"10uF"} footprint={"0805"} pcbRotation={0} schOrientation={"vertical"} />
<capacitor name={"C_M1LOG"} pcbX={-18} pcbY={9} schX={0} schY={-42} schSectionName={"Motors"} capacitance={"100nF"} footprint={"0402"} pcbRotation={90} schOrientation={"vertical"} />
<DRV8837DSGR name={"U_M2"} pcbX={-21} pcbY={-4} schX={6} schY={-42.38} schSectionName={"Motors"} schHeight={1.0} />
<pinheader name={"J_M2"} pcbX={-28} pcbY={-4} schX={12} schY={-42} schSectionName={"Motors"} pinCount={2} footprint={"pinrow2_p3.5mm"} pcbRotation={90} />
<capacitor name={"C_M2VM"} pcbX={-24} pcbY={-2} schX={0} schY={-47} schSectionName={"Motors"} capacitance={"100nF"} footprint={"0603"} pcbRotation={90} schOrientation={"vertical"} />
<capacitor name={"C_M2BULK"} pcbX={-21} pcbY={0} schX={6} schY={-47} schSectionName={"Motors"} capacitance={"10uF"} footprint={"0805"} pcbRotation={0} schOrientation={"vertical"} />
<capacitor name={"C_M2LOG"} pcbX={-18} pcbY={-3} schX={12} schY={-47} schSectionName={"Motors"} capacitance={"100nF"} footprint={"0402"} pcbRotation={90} schOrientation={"vertical"} />
<resistor name={"R_SLEEP"} pcbX={-16} pcbY={2} schX={0} schY={-52} schSectionName={"Motors"} resistance={"100k"} footprint={"0402"} pcbRotation={90} />
<pinheader name={"J_ENC1"} pcbX={-7} pcbY={7} schX={26} schY={-32} schSectionName={"Encoders"} pinCount={4} footprint={"pinrow4_p2.54mm"} pcbRotation={0} />
<resistor name={"R_E1A"} pcbX={-11} pcbY={4.5} schX={32} schY={-32} schSectionName={"Encoders"} resistance={"1k"} footprint={"0402"} pcbRotation={0} />
<resistor name={"R_P1A"} pcbX={-11} pcbY={2.7} schX={38} schY={-32} schSectionName={"Encoders"} resistance={"10k"} footprint={"0402"} pcbRotation={0} />
<capacitor name={"C_E1A"} pcbX={-5} pcbY={3.7} schX={26} schY={-37} schSectionName={"Encoders"} capacitance={"100pF"} footprint={"0402"} pcbRotation={90} schOrientation={"vertical"} />
<resistor name={"R_E1B"} pcbX={-8} pcbY={4.5} schX={32} schY={-37} schSectionName={"Encoders"} resistance={"1k"} footprint={"0402"} pcbRotation={0} />
<resistor name={"R_P1B"} pcbX={-8} pcbY={2.7} schX={38} schY={-37} schSectionName={"Encoders"} resistance={"10k"} footprint={"0402"} pcbRotation={0} />
<capacitor name={"C_E1B"} pcbX={-2} pcbY={3.7} schX={26} schY={-42} schSectionName={"Encoders"} capacitance={"100pF"} footprint={"0402"} pcbRotation={90} schOrientation={"vertical"} />
<pinheader name={"J_ENC2"} pcbX={-7} pcbY={0} schX={32} schY={-42} schSectionName={"Encoders"} pinCount={4} footprint={"pinrow4_p2.54mm"} pcbRotation={0} />
<resistor name={"R_E2A"} pcbX={-11} pcbY={-2.5} schX={38} schY={-42} schSectionName={"Encoders"} resistance={"1k"} footprint={"0402"} pcbRotation={0} />
<resistor name={"R_P2A"} pcbX={-11} pcbY={-4.3} schX={26} schY={-46.42} schSectionName={"Encoders"} resistance={"10k"} footprint={"0402"} pcbRotation={0} />
<capacitor name={"C_E2A"} pcbX={-5} pcbY={-3.3} schX={32} schY={-47} schSectionName={"Encoders"} capacitance={"100pF"} footprint={"0402"} pcbRotation={90} schOrientation={"vertical"} />
<resistor name={"R_E2B"} pcbX={-8} pcbY={-2.5} schX={38} schY={-47} schSectionName={"Encoders"} resistance={"1k"} footprint={"0402"} pcbRotation={0} />
<resistor name={"R_P2B"} pcbX={-8} pcbY={-4.3} schX={26} schY={-52} schSectionName={"Encoders"} resistance={"10k"} footprint={"0402"} pcbRotation={0} />
<capacitor name={"C_E2B"} pcbX={-2} pcbY={-3.3} schX={32} schY={-52} schSectionName={"Encoders"} capacitance={"100pF"} footprint={"0402"} pcbRotation={90} schOrientation={"vertical"} />
<LSM6DS3TR_C name={"U_IMU"} pcbX={22} pcbY={-7} schX={52} schY={-31.62} schSectionName={"IMU"} pcbRotation={180} />
<capacitor name={"C_IMU1"} pcbX={19} pcbY={-7} schX={58} schY={-32} schSectionName={"IMU"} capacitance={"100nF"} footprint={"0402"} pcbRotation={90} schOrientation={"vertical"} />
<capacitor name={"C_IMU2"} pcbX={25} pcbY={-7} schX={64} schY={-32} schSectionName={"IMU"} capacitance={"100nF"} footprint={"0402"} pcbRotation={90} schOrientation={"vertical"} />
<capacitor name={"C_IMU3"} pcbX={22} pcbY={-10} schX={52} schY={-37} schSectionName={"IMU"} capacitance={"1uF"} footprint={"0603"} pcbRotation={0} schOrientation={"vertical"} />
<resistor name={"R_SDA"} pcbX={18} pcbY={-3} schX={58} schY={-36.42} schSectionName={"IMU"} resistance={"4.7k"} footprint={"0402"} pcbRotation={0} />
<resistor name={"R_SCL"} pcbX={22} pcbY={-3} schX={64} schY={-37} schSectionName={"IMU"} resistance={"4.7k"} footprint={"0402"} pcbRotation={0} />
<pinheader name={"J_I2C"} pcbX={22} pcbY={-16} schX={52} schY={-42} schSectionName={"IMU"} pinCount={4} footprint={"pinrow4_p2.54mm"} pcbRotation={0} />
<pinheader name={"J_S1"} pcbX={-23.5} pcbY={-20} schX={0} schY={-66} schSectionName={"Servos"} pinCount={3} footprint={"pinrow3_p2.54mm"} pcbRotation={90} />
<resistor name={"R_S1"} pcbX={-21.7} pcbY={-14.5} schX={6} schY={-66} schSectionName={"Servos"} resistance={"220"} footprint={"0402"} pcbRotation={90} />
<pinheader name={"J_S2"} pcbX={-19} pcbY={-20} schX={12} schY={-66} schSectionName={"Servos"} pinCount={3} footprint={"pinrow3_p2.54mm"} pcbRotation={90} />
<resistor name={"R_S2"} pcbX={-17.2} pcbY={-14.5} schX={0} schY={-71} schSectionName={"Servos"} resistance={"220"} footprint={"0402"} pcbRotation={90} />
<pinheader name={"J_S3"} pcbX={-14} pcbY={-20} schX={6} schY={-71} schSectionName={"Servos"} pinCount={3} footprint={"pinrow3_p2.54mm"} pcbRotation={90} />
<resistor name={"R_S3"} pcbX={-12.2} pcbY={-14.5} schX={12} schY={-71} schSectionName={"Servos"} resistance={"220"} footprint={"0402"} pcbRotation={90} />
<pinheader name={"J_S4"} pcbX={-9} pcbY={-20} schX={0} schY={-76} schSectionName={"Servos"} pinCount={3} footprint={"pinrow3_p2.54mm"} pcbRotation={90} />
<resistor name={"R_S4"} pcbX={-7.2} pcbY={-14.5} schX={6} schY={-76} schSectionName={"Servos"} resistance={"220"} footprint={"0402"} pcbRotation={90} />
<pinheader name={"J_GPIO"} pcbX={13} pcbY={-21} schX={32} schY={-66} schSectionName={"Expansion"} pinCount={10} footprint={"pinrow10_p2.54mm"} pcbRotation={0} />
<resistor name={"R_LED"} pcbX={14} pcbY={-11} schX={38} schY={-66} schSectionName={"Expansion"} resistance={"1k"} footprint={"0402"} pcbRotation={0} />
<led name={"LED1"} pcbX={14} pcbY={-14} schX={26} schY={-71} schSectionName={"Expansion"} footprint={"0603"} color={"green"} />
<net name="V3V3" isPowerNet />
<trace name="V3V3_0" from=".U1 > .pin1" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_1" from=".U1 > .pin10" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_2" from=".U1 > .pin22" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_3" from=".U1 > .pin33" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_4" from=".U1 > .pin42" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_5" from=".U1 > .pin44" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_6" from=".U1 > .pin48" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_7" from=".U1 > .pin49" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_8" from=".U2 > .pin8" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_9" from=".R_CS > .pin1" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_10" from=".R_RUN > .pin1" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_11" from=".C_FLASH > .pin1" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_12" from=".C_IO1 > .pin1" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_13" from=".C_IO2 > .pin1" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_14" from=".C_IO3 > .pin1" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_15" from=".C_IO4 > .pin1" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_16" from=".C_IO5 > .pin1" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_17" from=".C_IO6 > .pin1" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_18" from=".C_USB > .pin1" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_19" from=".C_REGIN > .pin1" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_20" from=".R_AVDD > .pin1" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_21" from=".J_SWD > .pin1" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_22" from=".U_REG > .pin5" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_23" from=".C_3V3 > .pin1" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_24" from=".U_M1 > .pin8" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_25" from=".C_M1LOG > .pin1" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_26" from=".U_M2 > .pin8" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_27" from=".C_M2LOG > .pin1" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_28" from=".J_ENC1 > .pin1" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_29" from=".R_P1A > .pin1" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_30" from=".R_P1B > .pin1" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_31" from=".J_ENC2 > .pin1" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_32" from=".R_P2A > .pin1" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_33" from=".R_P2B > .pin1" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_34" from=".U_IMU > .pin5" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_35" from=".U_IMU > .pin8" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_36" from=".U_IMU > .pin12" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_37" from=".C_IMU1 > .pin1" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_38" from=".C_IMU2 > .pin1" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_39" from=".C_IMU3 > .pin1" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_40" from=".R_SDA > .pin1" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_41" from=".R_SCL > .pin1" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_42" from=".J_I2C > .pin1" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<trace name="V3V3_43" from=".J_GPIO > .pin2" to="net.V3V3" schDisplayLabel="V3V3" thickness={0.15} />
<net name="GND"  />
<trace name="GND_0" from=".U1 > .pin19" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_1" from=".U1 > .pin57" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_2" from=".U2 > .pin4" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_3" from=".Y1 > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_4" from=".Y1 > .pin4" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_5" from=".C_X1 > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_6" from=".C_X2 > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_7" from=".J_BOOT > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_8" from=".J_RESET > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_9" from=".C_FLASH > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_10" from=".C_IO1 > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_11" from=".C_IO2 > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_12" from=".C_IO3 > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_13" from=".C_IO4 > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_14" from=".C_IO5 > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_15" from=".C_IO6 > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_16" from=".C_USB > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_17" from=".C_CORE1 > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_18" from=".C_CORE2 > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_19" from=".C_REGIN > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_20" from=".C_REGOUT > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_21" from=".C_AVDD > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_22" from=".J_SWD > .pin4" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_23" from=".J_USB > .GND1" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_24" from=".J_USB > .GND2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_25" from=".J_USB > .SHELL1" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_26" from=".J_USB > .SHELL2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_27" from=".J_USB > .SHELL3" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_28" from=".J_USB > .SHELL4" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_29" from=".R_CC1 > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_30" from=".R_CC2 > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_31" from=".U_ESD > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_32" from=".C_VBUS > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_33" from=".J_5V > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_34" from=".U_REG > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_35" from=".C_5LOG > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_36" from=".C_3V3 > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_37" from=".C_5SERVO > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_38" from=".J_VM > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_39" from=".C_VM > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_40" from=".U_M1 > .pin4" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_41" from=".U_M1 > .pin9" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_42" from=".C_M1VM > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_43" from=".C_M1BULK > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_44" from=".C_M1LOG > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_45" from=".U_M2 > .pin4" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_46" from=".U_M2 > .pin9" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_47" from=".C_M2VM > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_48" from=".C_M2BULK > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_49" from=".C_M2LOG > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_50" from=".R_SLEEP > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_51" from=".J_ENC1 > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_52" from=".C_E1A > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_53" from=".C_E1B > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_54" from=".J_ENC2 > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_55" from=".C_E2A > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_56" from=".C_E2B > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_57" from=".U_IMU > .pin1" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_58" from=".U_IMU > .pin6" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_59" from=".U_IMU > .pin7" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_60" from=".C_IMU1 > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_61" from=".C_IMU2 > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_62" from=".C_IMU3 > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_63" from=".J_I2C > .pin2" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_64" from=".J_S1 > .pin1" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_65" from=".J_S2 > .pin1" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_66" from=".J_S3 > .pin1" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_67" from=".J_S4 > .pin1" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_68" from=".J_GPIO > .pin1" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<trace name="GND_69" from=".LED1 > .cathode" to="net.GND" schDisplayLabel="GND" thickness={0.15} />
<net name="XIN" />
<trace name="XIN_0" from=".U1 > .pin20" to="net.XIN" schDisplayLabel="XIN" thickness={0.15} />
<trace name="XIN_1" from=".Y1 > .pin1" to="net.XIN" schDisplayLabel="XIN" thickness={0.15} />
<trace name="XIN_2" from=".C_X1 > .pin1" to="net.XIN" schDisplayLabel="XIN" thickness={0.15} />
<net name="XOUT" />
<trace name="XOUT_0" from=".U1 > .pin21" to="net.XOUT" schDisplayLabel="XOUT" thickness={0.15} />
<trace name="XOUT_1" from=".R_XTAL > .pin1" to="net.XOUT" schDisplayLabel="XOUT" thickness={0.15} />
<net name="V1V1" isPowerNet />
<trace name="V1V1_0" from=".U1 > .pin23" to="net.V1V1" schDisplayLabel="V1V1" thickness={0.15} />
<trace name="V1V1_1" from=".U1 > .pin45" to="net.V1V1" schDisplayLabel="V1V1" thickness={0.15} />
<trace name="V1V1_2" from=".U1 > .pin50" to="net.V1V1" schDisplayLabel="V1V1" thickness={0.15} />
<trace name="V1V1_3" from=".C_CORE1 > .pin1" to="net.V1V1" schDisplayLabel="V1V1" thickness={0.15} />
<trace name="V1V1_4" from=".C_CORE2 > .pin1" to="net.V1V1" schDisplayLabel="V1V1" thickness={0.15} />
<trace name="V1V1_5" from=".C_REGOUT > .pin1" to="net.V1V1" schDisplayLabel="V1V1" thickness={0.15} />
<net name="SWCLK" />
<trace name="SWCLK_0" from=".U1 > .pin24" to="net.SWCLK" schDisplayLabel="SWCLK" thickness={0.15} />
<trace name="SWCLK_1" from=".J_SWD > .pin3" to="net.SWCLK" schDisplayLabel="SWCLK" thickness={0.15} />
<net name="SWDIO" />
<trace name="SWDIO_0" from=".U1 > .pin25" to="net.SWDIO" schDisplayLabel="SWDIO" thickness={0.15} />
<trace name="SWDIO_1" from=".J_SWD > .pin2" to="net.SWDIO" schDisplayLabel="SWDIO" thickness={0.15} />
<net name="RUN" />
<trace name="RUN_0" from=".U1 > .pin26" to="net.RUN" schDisplayLabel="RUN" thickness={0.15} />
<trace name="RUN_1" from=".R_RUN > .pin2" to="net.RUN" schDisplayLabel="RUN" thickness={0.15} />
<trace name="RUN_2" from=".J_RESET > .pin1" to="net.RUN" schDisplayLabel="RUN" thickness={0.15} />
<net name="AVDD" isPowerNet />
<trace name="AVDD_0" from=".U1 > .pin43" to="net.AVDD" schDisplayLabel="AVDD" thickness={0.15} />
<trace name="AVDD_1" from=".R_AVDD > .pin2" to="net.AVDD" schDisplayLabel="AVDD" thickness={0.15} />
<trace name="AVDD_2" from=".C_AVDD > .pin1" to="net.AVDD" schDisplayLabel="AVDD" thickness={0.15} />
<net name="USB_DM_MCU" />
<trace name="USB_DM_MCU_0" from=".U1 > .pin46" to="net.USB_DM_MCU" schDisplayLabel="USB_DM_MCU" thickness={0.15} />
<trace name="USB_DM_MCU_1" from=".R_DM > .pin1" to="net.USB_DM_MCU" schDisplayLabel="USB_DM_MCU" thickness={0.15} />
<net name="USB_DP_MCU" />
<trace name="USB_DP_MCU_0" from=".U1 > .pin47" to="net.USB_DP_MCU" schDisplayLabel="USB_DP_MCU" thickness={0.15} />
<trace name="USB_DP_MCU_1" from=".R_DP > .pin1" to="net.USB_DP_MCU" schDisplayLabel="USB_DP_MCU" thickness={0.15} />
<net name="QSPI_D3" />
<trace name="QSPI_D3_0" from=".U1 > .pin51" to="net.QSPI_D3" schDisplayLabel="QSPI_D3" thickness={0.15} />
<trace name="QSPI_D3_1" from=".U2 > .pin7" to="net.QSPI_D3" schDisplayLabel="QSPI_D3" thickness={0.15} />
<net name="QSPI_CLK" />
<trace name="QSPI_CLK_0" from=".U1 > .pin52" to="net.QSPI_CLK" schDisplayLabel="QSPI_CLK" thickness={0.15} />
<trace name="QSPI_CLK_1" from=".U2 > .pin6" to="net.QSPI_CLK" schDisplayLabel="QSPI_CLK" thickness={0.15} />
<net name="QSPI_D0" />
<trace name="QSPI_D0_0" from=".U1 > .pin53" to="net.QSPI_D0" schDisplayLabel="QSPI_D0" thickness={0.15} />
<trace name="QSPI_D0_1" from=".U2 > .pin5" to="net.QSPI_D0" schDisplayLabel="QSPI_D0" thickness={0.15} />
<net name="QSPI_D2" />
<trace name="QSPI_D2_0" from=".U1 > .pin54" to="net.QSPI_D2" schDisplayLabel="QSPI_D2" thickness={0.15} />
<trace name="QSPI_D2_1" from=".U2 > .pin3" to="net.QSPI_D2" schDisplayLabel="QSPI_D2" thickness={0.15} />
<net name="QSPI_D1" />
<trace name="QSPI_D1_0" from=".U1 > .pin55" to="net.QSPI_D1" schDisplayLabel="QSPI_D1" thickness={0.15} />
<trace name="QSPI_D1_1" from=".U2 > .pin2" to="net.QSPI_D1" schDisplayLabel="QSPI_D1" thickness={0.15} />
<net name="QSPI_CS" />
<trace name="QSPI_CS_0" from=".U1 > .pin56" to="net.QSPI_CS" schDisplayLabel="QSPI_CS" thickness={0.15} />
<trace name="QSPI_CS_1" from=".U2 > .pin1" to="net.QSPI_CS" schDisplayLabel="QSPI_CS" thickness={0.15} />
<trace name="QSPI_CS_2" from=".R_BOOT > .pin1" to="net.QSPI_CS" schDisplayLabel="QSPI_CS" thickness={0.15} />
<trace name="QSPI_CS_3" from=".R_CS > .pin2" to="net.QSPI_CS" schDisplayLabel="QSPI_CS" thickness={0.15} />
<net name="M1_IN1" />
<trace name="M1_IN1_0" from=".U1 > .pin2" to="net.M1_IN1" schDisplayLabel="M1_IN1" thickness={0.15} />
<trace name="M1_IN1_1" from=".U_M1 > .pin6" to="net.M1_IN1" schDisplayLabel="M1_IN1" thickness={0.15} />
<net name="M1_IN2" />
<trace name="M1_IN2_0" from=".U1 > .pin3" to="net.M1_IN2" schDisplayLabel="M1_IN2" thickness={0.15} />
<trace name="M1_IN2_1" from=".U_M1 > .pin5" to="net.M1_IN2" schDisplayLabel="M1_IN2" thickness={0.15} />
<net name="M2_IN1" />
<trace name="M2_IN1_0" from=".U1 > .pin4" to="net.M2_IN1" schDisplayLabel="M2_IN1" thickness={0.15} />
<trace name="M2_IN1_1" from=".U_M2 > .pin6" to="net.M2_IN1" schDisplayLabel="M2_IN1" thickness={0.15} />
<net name="M2_IN2" />
<trace name="M2_IN2_0" from=".U1 > .pin5" to="net.M2_IN2" schDisplayLabel="M2_IN2" thickness={0.15} />
<trace name="M2_IN2_1" from=".U_M2 > .pin5" to="net.M2_IN2" schDisplayLabel="M2_IN2" thickness={0.15} />
<net name="ENC1_A" />
<trace name="ENC1_A_0" from=".U1 > .pin6" to="net.ENC1_A" schDisplayLabel="ENC1_A" thickness={0.15} />
<trace name="ENC1_A_1" from=".R_E1A > .pin2" to="net.ENC1_A" schDisplayLabel="ENC1_A" thickness={0.15} />
<trace name="ENC1_A_2" from=".R_P1A > .pin2" to="net.ENC1_A" schDisplayLabel="ENC1_A" thickness={0.15} />
<trace name="ENC1_A_3" from=".C_E1A > .pin1" to="net.ENC1_A" schDisplayLabel="ENC1_A" thickness={0.15} />
<net name="ENC1_B" />
<trace name="ENC1_B_0" from=".U1 > .pin7" to="net.ENC1_B" schDisplayLabel="ENC1_B" thickness={0.15} />
<trace name="ENC1_B_1" from=".R_E1B > .pin2" to="net.ENC1_B" schDisplayLabel="ENC1_B" thickness={0.15} />
<trace name="ENC1_B_2" from=".R_P1B > .pin2" to="net.ENC1_B" schDisplayLabel="ENC1_B" thickness={0.15} />
<trace name="ENC1_B_3" from=".C_E1B > .pin1" to="net.ENC1_B" schDisplayLabel="ENC1_B" thickness={0.15} />
<net name="ENC2_A" />
<trace name="ENC2_A_0" from=".U1 > .pin8" to="net.ENC2_A" schDisplayLabel="ENC2_A" thickness={0.15} />
<trace name="ENC2_A_1" from=".R_E2A > .pin2" to="net.ENC2_A" schDisplayLabel="ENC2_A" thickness={0.15} />
<trace name="ENC2_A_2" from=".R_P2A > .pin2" to="net.ENC2_A" schDisplayLabel="ENC2_A" thickness={0.15} />
<trace name="ENC2_A_3" from=".C_E2A > .pin1" to="net.ENC2_A" schDisplayLabel="ENC2_A" thickness={0.15} />
<net name="ENC2_B" />
<trace name="ENC2_B_0" from=".U1 > .pin9" to="net.ENC2_B" schDisplayLabel="ENC2_B" thickness={0.15} />
<trace name="ENC2_B_1" from=".R_E2B > .pin2" to="net.ENC2_B" schDisplayLabel="ENC2_B" thickness={0.15} />
<trace name="ENC2_B_2" from=".R_P2B > .pin2" to="net.ENC2_B" schDisplayLabel="ENC2_B" thickness={0.15} />
<trace name="ENC2_B_3" from=".C_E2B > .pin1" to="net.ENC2_B" schDisplayLabel="ENC2_B" thickness={0.15} />
<net name="GP8" />
<trace name="GP8_0" from=".U1 > .pin11" to="net.GP8" schDisplayLabel="GP8" thickness={0.15} />
<trace name="GP8_1" from=".J_GPIO > .pin7" to="net.GP8" schDisplayLabel="GP8" thickness={0.15} />
<net name="GP9" />
<trace name="GP9_0" from=".U1 > .pin12" to="net.GP9" schDisplayLabel="GP9" thickness={0.15} />
<trace name="GP9_1" from=".J_GPIO > .pin8" to="net.GP9" schDisplayLabel="GP9" thickness={0.15} />
<net name="MOTOR_EN" />
<trace name="MOTOR_EN_0" from=".U1 > .pin14" to="net.MOTOR_EN" schDisplayLabel="MOTOR_EN" thickness={0.15} />
<trace name="MOTOR_EN_1" from=".U_M1 > .pin7" to="net.MOTOR_EN" schDisplayLabel="MOTOR_EN" thickness={0.15} />
<trace name="MOTOR_EN_2" from=".U_M2 > .pin7" to="net.MOTOR_EN" schDisplayLabel="MOTOR_EN" thickness={0.15} />
<trace name="MOTOR_EN_3" from=".R_SLEEP > .pin1" to="net.MOTOR_EN" schDisplayLabel="MOTOR_EN" thickness={0.15} />
<net name="SERVO1" />
<trace name="SERVO1_0" from=".U1 > .pin15" to="net.SERVO1" schDisplayLabel="SERVO1" thickness={0.15} />
<trace name="SERVO1_1" from=".R_S1 > .pin1" to="net.SERVO1" schDisplayLabel="SERVO1" thickness={0.15} />
<net name="SERVO2" />
<trace name="SERVO2_0" from=".U1 > .pin16" to="net.SERVO2" schDisplayLabel="SERVO2" thickness={0.15} />
<trace name="SERVO2_1" from=".R_S2 > .pin1" to="net.SERVO2" schDisplayLabel="SERVO2" thickness={0.15} />
<net name="SERVO3" />
<trace name="SERVO3_0" from=".U1 > .pin17" to="net.SERVO3" schDisplayLabel="SERVO3" thickness={0.15} />
<trace name="SERVO3_1" from=".R_S3 > .pin1" to="net.SERVO3" schDisplayLabel="SERVO3" thickness={0.15} />
<net name="SERVO4" />
<trace name="SERVO4_0" from=".U1 > .pin18" to="net.SERVO4" schDisplayLabel="SERVO4" thickness={0.15} />
<trace name="SERVO4_1" from=".R_S4 > .pin1" to="net.SERVO4" schDisplayLabel="SERVO4" thickness={0.15} />
<net name="GP16" />
<trace name="GP16_0" from=".U1 > .pin27" to="net.GP16" schDisplayLabel="GP16" thickness={0.15} />
<trace name="GP16_1" from=".J_GPIO > .pin3" to="net.GP16" schDisplayLabel="GP16" thickness={0.15} />
<net name="GP17" />
<trace name="GP17_0" from=".U1 > .pin28" to="net.GP17" schDisplayLabel="GP17" thickness={0.15} />
<trace name="GP17_1" from=".J_GPIO > .pin4" to="net.GP17" schDisplayLabel="GP17" thickness={0.15} />
<net name="GP18" />
<trace name="GP18_0" from=".U1 > .pin29" to="net.GP18" schDisplayLabel="GP18" thickness={0.15} />
<trace name="GP18_1" from=".J_GPIO > .pin5" to="net.GP18" schDisplayLabel="GP18" thickness={0.15} />
<net name="GP19" />
<trace name="GP19_0" from=".U1 > .pin30" to="net.GP19" schDisplayLabel="GP19" thickness={0.15} />
<trace name="GP19_1" from=".J_GPIO > .pin6" to="net.GP19" schDisplayLabel="GP19" thickness={0.15} />
<net name="I2C_SDA" />
<trace name="I2C_SDA_0" from=".U1 > .pin31" to="net.I2C_SDA" schDisplayLabel="I2C_SDA" thickness={0.15} />
<trace name="I2C_SDA_1" from=".U_IMU > .pin14" to="net.I2C_SDA" schDisplayLabel="I2C_SDA" thickness={0.15} />
<trace name="I2C_SDA_2" from=".R_SDA > .pin2" to="net.I2C_SDA" schDisplayLabel="I2C_SDA" thickness={0.15} />
<trace name="I2C_SDA_3" from=".J_I2C > .pin3" to="net.I2C_SDA" schDisplayLabel="I2C_SDA" thickness={0.15} />
<net name="I2C_SCL" />
<trace name="I2C_SCL_0" from=".U1 > .pin32" to="net.I2C_SCL" schDisplayLabel="I2C_SCL" thickness={0.15} />
<trace name="I2C_SCL_1" from=".U_IMU > .pin13" to="net.I2C_SCL" schDisplayLabel="I2C_SCL" thickness={0.15} />
<trace name="I2C_SCL_2" from=".R_SCL > .pin2" to="net.I2C_SCL" schDisplayLabel="I2C_SCL" thickness={0.15} />
<trace name="I2C_SCL_3" from=".J_I2C > .pin4" to="net.I2C_SCL" schDisplayLabel="I2C_SCL" thickness={0.15} />
<net name="IMU_INT" />
<trace name="IMU_INT_0" from=".U1 > .pin34" to="net.IMU_INT" schDisplayLabel="IMU_INT" thickness={0.15} />
<trace name="IMU_INT_1" from=".U_IMU > .pin4" to="net.IMU_INT" schDisplayLabel="IMU_INT" thickness={0.15} />
<net name="STATUS" />
<trace name="STATUS_0" from=".U1 > .pin37" to="net.STATUS" schDisplayLabel="STATUS" thickness={0.15} />
<trace name="STATUS_1" from=".R_LED > .pin1" to="net.STATUS" schDisplayLabel="STATUS" thickness={0.15} />
<net name="ADC0" />
<trace name="ADC0_0" from=".U1 > .pin38" to="net.ADC0" schDisplayLabel="ADC0" thickness={0.15} />
<trace name="ADC0_1" from=".J_GPIO > .pin9" to="net.ADC0" schDisplayLabel="ADC0" thickness={0.15} />
<net name="ADC1" />
<trace name="ADC1_0" from=".U1 > .pin39" to="net.ADC1" schDisplayLabel="ADC1" thickness={0.15} />
<trace name="ADC1_1" from=".J_GPIO > .pin10" to="net.ADC1" schDisplayLabel="ADC1" thickness={0.15} />
<net name="XTAL_OUT" />
<trace name="XTAL_OUT_0" from=".Y1 > .pin3" to="net.XTAL_OUT" schDisplayLabel="XTAL_OUT" thickness={0.15} />
<trace name="XTAL_OUT_1" from=".R_XTAL > .pin2" to="net.XTAL_OUT" schDisplayLabel="XTAL_OUT" thickness={0.15} />
<trace name="XTAL_OUT_2" from=".C_X2 > .pin1" to="net.XTAL_OUT" schDisplayLabel="XTAL_OUT" thickness={0.15} />
<net name="BOOT_SW" />
<trace name="BOOT_SW_0" from=".R_BOOT > .pin2" to="net.BOOT_SW" schDisplayLabel="BOOT_SW" thickness={0.15} />
<trace name="BOOT_SW_1" from=".J_BOOT > .pin1" to="net.BOOT_SW" schDisplayLabel="BOOT_SW" thickness={0.15} />
<net name="VBUS" isPowerNet />
<trace name="VBUS_0" from=".J_USB > .VBUS1" to="net.VBUS" schDisplayLabel="VBUS" thickness={0.15} />
<trace name="VBUS_1" from=".J_USB > .VBUS2" to="net.VBUS" schDisplayLabel="VBUS" thickness={0.15} />
<trace name="VBUS_2" from=".U_ESD > .pin5" to="net.VBUS" schDisplayLabel="VBUS" thickness={0.15} />
<trace name="VBUS_3" from=".C_VBUS > .pin1" to="net.VBUS" schDisplayLabel="VBUS" thickness={0.15} />
<trace name="VBUS_4" from=".D_USB > .anode" to="net.VBUS" schDisplayLabel="VBUS" thickness={0.15} />
<net name="CC1" />
<trace name="CC1_0" from=".J_USB > .CC1" to="net.CC1" schDisplayLabel="CC1" thickness={0.15} />
<trace name="CC1_1" from=".R_CC1 > .pin1" to="net.CC1" schDisplayLabel="CC1" thickness={0.15} />
<net name="CC2" />
<trace name="CC2_0" from=".J_USB > .CC2" to="net.CC2" schDisplayLabel="CC2" thickness={0.15} />
<trace name="CC2_1" from=".R_CC2 > .pin1" to="net.CC2" schDisplayLabel="CC2" thickness={0.15} />
<net name="USB_DP" />
<trace name="USB_DP_0" from=".J_USB > .DP1" to="net.USB_DP" schDisplayLabel="USB_DP" thickness={0.15} />
<trace name="USB_DP_1" from=".J_USB > .DP2" to="net.USB_DP" schDisplayLabel="USB_DP" thickness={0.15} />
<trace name="USB_DP_2" from=".U_ESD > .pin1" to="net.USB_DP" schDisplayLabel="USB_DP" thickness={0.15} />
<trace name="USB_DP_3" from=".U_ESD > .pin6" to="net.USB_DP" schDisplayLabel="USB_DP" thickness={0.15} />
<trace name="USB_DP_4" from=".R_DP > .pin2" to="net.USB_DP" schDisplayLabel="USB_DP" thickness={0.15} />
<net name="USB_DM" />
<trace name="USB_DM_0" from=".J_USB > .DM1" to="net.USB_DM" schDisplayLabel="USB_DM" thickness={0.15} />
<trace name="USB_DM_1" from=".J_USB > .DM2" to="net.USB_DM" schDisplayLabel="USB_DM" thickness={0.15} />
<trace name="USB_DM_2" from=".U_ESD > .pin3" to="net.USB_DM" schDisplayLabel="USB_DM" thickness={0.15} />
<trace name="USB_DM_3" from=".U_ESD > .pin4" to="net.USB_DM" schDisplayLabel="USB_DM" thickness={0.15} />
<trace name="USB_DM_4" from=".R_DM > .pin2" to="net.USB_DM" schDisplayLabel="USB_DM" thickness={0.15} />
<net name="V5_SERVO" isPowerNet />
<trace name="V5_SERVO_0" from=".J_5V > .pin1" to="net.V5_SERVO" schDisplayLabel="V5_SERVO" thickness={0.8} />
<trace name="V5_SERVO_1" from=".D_EXT > .anode" to="net.V5_SERVO" schDisplayLabel="V5_SERVO" thickness={0.8} />
<trace name="V5_SERVO_2" from=".C_5SERVO > .pin1" to="net.V5_SERVO" schDisplayLabel="V5_SERVO" thickness={0.8} />
<trace name="V5_SERVO_3" from=".J_S1 > .pin2" to="net.V5_SERVO" schDisplayLabel="V5_SERVO" thickness={0.8} />
<trace name="V5_SERVO_4" from=".J_S2 > .pin2" to="net.V5_SERVO" schDisplayLabel="V5_SERVO" thickness={0.8} />
<trace name="V5_SERVO_5" from=".J_S3 > .pin2" to="net.V5_SERVO" schDisplayLabel="V5_SERVO" thickness={0.8} />
<trace name="V5_SERVO_6" from=".J_S4 > .pin2" to="net.V5_SERVO" schDisplayLabel="V5_SERVO" thickness={0.8} />
<net name="V5_LOGIC" isPowerNet />
<trace name="V5_LOGIC_0" from=".D_USB > .cathode" to="net.V5_LOGIC" schDisplayLabel="V5_LOGIC" thickness={0.15} />
<trace name="V5_LOGIC_1" from=".D_EXT > .cathode" to="net.V5_LOGIC" schDisplayLabel="V5_LOGIC" thickness={0.15} />
<trace name="V5_LOGIC_2" from=".U_REG > .pin1" to="net.V5_LOGIC" schDisplayLabel="V5_LOGIC" thickness={0.15} />
<trace name="V5_LOGIC_3" from=".U_REG > .pin3" to="net.V5_LOGIC" schDisplayLabel="V5_LOGIC" thickness={0.15} />
<trace name="V5_LOGIC_4" from=".C_5LOG > .pin1" to="net.V5_LOGIC" schDisplayLabel="V5_LOGIC" thickness={0.15} />
<net name="VM" isPowerNet />
<trace name="VM_0" from=".J_VM > .pin1" to="net.VM" schDisplayLabel="VM" thickness={0.8} />
<trace name="VM_1" from=".C_VM > .pin1" to="net.VM" schDisplayLabel="VM" thickness={0.8} />
<trace name="VM_2" from=".U_M1 > .pin1" to="net.VM" schDisplayLabel="VM" thickness={0.8} />
<trace name="VM_3" from=".C_M1VM > .pin1" to="net.VM" schDisplayLabel="VM" thickness={0.8} />
<trace name="VM_4" from=".C_M1BULK > .pin1" to="net.VM" schDisplayLabel="VM" thickness={0.8} />
<trace name="VM_5" from=".U_M2 > .pin1" to="net.VM" schDisplayLabel="VM" thickness={0.8} />
<trace name="VM_6" from=".C_M2VM > .pin1" to="net.VM" schDisplayLabel="VM" thickness={0.8} />
<trace name="VM_7" from=".C_M2BULK > .pin1" to="net.VM" schDisplayLabel="VM" thickness={0.8} />
<net name="M1_A" />
<trace name="M1_A_0" from=".U_M1 > .pin2" to="net.M1_A" schDisplayLabel="M1_A" thickness={0.6} />
<trace name="M1_A_1" from=".J_M1 > .pin1" to="net.M1_A" schDisplayLabel="M1_A" thickness={0.6} />
<net name="M1_B" />
<trace name="M1_B_0" from=".U_M1 > .pin3" to="net.M1_B" schDisplayLabel="M1_B" thickness={0.6} />
<trace name="M1_B_1" from=".J_M1 > .pin2" to="net.M1_B" schDisplayLabel="M1_B" thickness={0.6} />
<net name="M2_A" />
<trace name="M2_A_0" from=".U_M2 > .pin2" to="net.M2_A" schDisplayLabel="M2_A" thickness={0.6} />
<trace name="M2_A_1" from=".J_M2 > .pin1" to="net.M2_A" schDisplayLabel="M2_A" thickness={0.6} />
<net name="M2_B" />
<trace name="M2_B_0" from=".U_M2 > .pin3" to="net.M2_B" schDisplayLabel="M2_B" thickness={0.6} />
<trace name="M2_B_1" from=".J_M2 > .pin2" to="net.M2_B" schDisplayLabel="M2_B" thickness={0.6} />
<net name="ENC1_A_RAW" />
<trace name="ENC1_A_RAW_0" from=".J_ENC1 > .pin3" to="net.ENC1_A_RAW" schDisplayLabel="ENC1_A_RAW" thickness={0.15} />
<trace name="ENC1_A_RAW_1" from=".R_E1A > .pin1" to="net.ENC1_A_RAW" schDisplayLabel="ENC1_A_RAW" thickness={0.15} />
<net name="ENC1_B_RAW" />
<trace name="ENC1_B_RAW_0" from=".J_ENC1 > .pin4" to="net.ENC1_B_RAW" schDisplayLabel="ENC1_B_RAW" thickness={0.15} />
<trace name="ENC1_B_RAW_1" from=".R_E1B > .pin1" to="net.ENC1_B_RAW" schDisplayLabel="ENC1_B_RAW" thickness={0.15} />
<net name="ENC2_A_RAW" />
<trace name="ENC2_A_RAW_0" from=".J_ENC2 > .pin3" to="net.ENC2_A_RAW" schDisplayLabel="ENC2_A_RAW" thickness={0.15} />
<trace name="ENC2_A_RAW_1" from=".R_E2A > .pin1" to="net.ENC2_A_RAW" schDisplayLabel="ENC2_A_RAW" thickness={0.15} />
<net name="ENC2_B_RAW" />
<trace name="ENC2_B_RAW_0" from=".J_ENC2 > .pin4" to="net.ENC2_B_RAW" schDisplayLabel="ENC2_B_RAW" thickness={0.15} />
<trace name="ENC2_B_RAW_1" from=".R_E2B > .pin1" to="net.ENC2_B_RAW" schDisplayLabel="ENC2_B_RAW" thickness={0.15} />
<net name="SERVO1_OUT" />
<trace name="SERVO1_OUT_0" from=".J_S1 > .pin3" to="net.SERVO1_OUT" schDisplayLabel="SERVO1_OUT" thickness={0.15} />
<trace name="SERVO1_OUT_1" from=".R_S1 > .pin2" to="net.SERVO1_OUT" schDisplayLabel="SERVO1_OUT" thickness={0.15} />
<net name="SERVO2_OUT" />
<trace name="SERVO2_OUT_0" from=".J_S2 > .pin3" to="net.SERVO2_OUT" schDisplayLabel="SERVO2_OUT" thickness={0.15} />
<trace name="SERVO2_OUT_1" from=".R_S2 > .pin2" to="net.SERVO2_OUT" schDisplayLabel="SERVO2_OUT" thickness={0.15} />
<net name="SERVO3_OUT" />
<trace name="SERVO3_OUT_0" from=".J_S3 > .pin3" to="net.SERVO3_OUT" schDisplayLabel="SERVO3_OUT" thickness={0.15} />
<trace name="SERVO3_OUT_1" from=".R_S3 > .pin2" to="net.SERVO3_OUT" schDisplayLabel="SERVO3_OUT" thickness={0.15} />
<net name="SERVO4_OUT" />
<trace name="SERVO4_OUT_0" from=".J_S4 > .pin3" to="net.SERVO4_OUT" schDisplayLabel="SERVO4_OUT" thickness={0.15} />
<trace name="SERVO4_OUT_1" from=".R_S4 > .pin2" to="net.SERVO4_OUT" schDisplayLabel="SERVO4_OUT" thickness={0.15} />
<net name="LED_A" />
<trace name="LED_A_0" from=".R_LED > .pin2" to="net.LED_A" schDisplayLabel="LED_A" thickness={0.15} />
<trace name="LED_A_1" from=".LED1 > .anode" to="net.LED_A" schDisplayLabel="LED_A" thickness={0.15} />
<hole diameter={2.7} pcbX={-29} pcbY={22} />
<hole diameter={2.7} pcbX={29} pcbY={22} />
<hole diameter={2.7} pcbX={-29.5} pcbY={-22} />
<hole diameter={2.7} pcbX={29} pcbY={-22} />
<copperpour connectsTo="net.GND" layer="bottom" clearance={0.2} boardEdgeMargin={0.4} useThermalReliefs />
<copperpour connectsTo="net.GND" layer="top" clearance={0.2} boardEdgeMargin={0.4} useThermalReliefs />
<via name="G_-25_12" pcbX={-25} pcbY={12} holeDiameter={0.3} outerDiameter={0.6} fromLayer="top" toLayer="bottom" connectsTo="net.GND" />
<via name="G_-25_0" pcbX={-25} pcbY={0} holeDiameter={0.3} outerDiameter={0.6} fromLayer="top" toLayer="bottom" connectsTo="net.GND" />
<via name="G_-18_6" pcbX={-18} pcbY={6} holeDiameter={0.3} outerDiameter={0.6} fromLayer="top" toLayer="bottom" connectsTo="net.GND" />
<via name="G_-18_-6" pcbX={-18} pcbY={-6} holeDiameter={0.3} outerDiameter={0.6} fromLayer="top" toLayer="bottom" connectsTo="net.GND" />
<via name="G_-17_18" pcbX={-17} pcbY={18} holeDiameter={0.3} outerDiameter={0.6} fromLayer="top" toLayer="bottom" connectsTo="net.GND" />
<via name="G_-3_10" pcbX={-3} pcbY={10} holeDiameter={0.3} outerDiameter={0.6} fromLayer="top" toLayer="bottom" connectsTo="net.GND" />
<via name="G_16_17" pcbX={16} pcbY={17} holeDiameter={0.3} outerDiameter={0.6} fromLayer="top" toLayer="bottom" connectsTo="net.GND" />
<via name="G_17_-9" pcbX={17} pcbY={-9} holeDiameter={0.3} outerDiameter={0.6} fromLayer="top" toLayer="bottom" connectsTo="net.GND" />
<via name="G_24_-12" pcbX={24} pcbY={-12} holeDiameter={0.3} outerDiameter={0.6} fromLayer="top" toLayer="bottom" connectsTo="net.GND" />
<via name="G_1_-9" pcbX={1} pcbY={-9} holeDiameter={0.3} outerDiameter={0.6} fromLayer="top" toLayer="bottom" connectsTo="net.GND" />
<via name="G_0_18" pcbX={0} pcbY={18} holeDiameter={0.3} outerDiameter={0.6} fromLayer="top" toLayer="bottom" connectsTo="net.GND" />
<via name="G_27_3" pcbX={27} pcbY={3} holeDiameter={0.3} outerDiameter={0.6} fromLayer="top" toLayer="bottom" connectsTo="net.GND" />
<via name="THERMAL_0" pcbX={6.4} pcbY={3.4} holeDiameter={0.2} outerDiameter={0.4} fromLayer="top" toLayer="bottom" connectsTo="net.GND" />
<via name="THERMAL_1" pcbX={6.4} pcbY={4.6} holeDiameter={0.2} outerDiameter={0.4} fromLayer="top" toLayer="bottom" connectsTo="net.GND" />
<via name="THERMAL_2" pcbX={7.6} pcbY={3.4} holeDiameter={0.2} outerDiameter={0.4} fromLayer="top" toLayer="bottom" connectsTo="net.GND" />
<via name="THERMAL_3" pcbX={7.6} pcbY={4.6} holeDiameter={0.2} outerDiameter={0.4} fromLayer="top" toLayer="bottom" connectsTo="net.GND" />
<via name="THERMAL_4" pcbX={-21.4} pcbY={8} holeDiameter={0.2} outerDiameter={0.4} fromLayer="top" toLayer="bottom" connectsTo="net.GND" />
<via name="THERMAL_5" pcbX={-20.6} pcbY={8} holeDiameter={0.2} outerDiameter={0.4} fromLayer="top" toLayer="bottom" connectsTo="net.GND" />
<via name="THERMAL_6" pcbX={-21.4} pcbY={-4} holeDiameter={0.2} outerDiameter={0.4} fromLayer="top" toLayer="bottom" connectsTo="net.GND" />
<via name="THERMAL_7" pcbX={-20.6} pcbY={-4} holeDiameter={0.2} outerDiameter={0.4} fromLayer="top" toLayer="bottom" connectsTo="net.GND" />
<silkscreentext text="ROVER / RP2040" pcbX={5} pcbY={23} fontSize={1} />
<silkscreentext text="MOTOR 5-9V" pcbX={-21} pcbY={23} fontSize={0.8} />
<silkscreentext text="5V IN" pcbX={-11} pcbY={23} fontSize={0.8} />
<silkscreentext text="M1" pcbX={-28} pcbY={12} fontSize={1} />
<silkscreentext text="M2" pcbX={-28} pcbY={0} fontSize={1} />
<silkscreentext text="IMU" pcbX={22} pcbY={-4.8} fontSize={0.8} />
<silkscreentext text="SERVOS: G 5V S" pcbX={-16} pcbY={-24} fontSize={0.8} />
<silkscreentext text="GPIO / 3V3 ONLY" pcbX={14} pcbY={-24} fontSize={0.8} />
<silkscreentext text="USB" pcbX={25} pcbY={23} fontSize={0.8} />
<silkscreentext text="REV A / 2L" pcbX={-1} pcbY={-16} fontSize={0.8} />
</board> ) }
