"""Create this original tscircuit design; no external board files are read."""
from pathlib import Path
import json

out = ['import { UsbC } from "./imports/UsbC"','import { RP2040 } from "./imports/RP2040"',
       'import { DRV8837DSGR } from "./imports/DRV8837DSGR"',
       'import { LSM6DS3TR_C } from "./imports/LSM6DS3TR_C"',
       'import { W25Q16JVSSIQ } from "./imports/W25Q16JVSSIQ"',
       'import { AP2112K_3_3TRG1 } from "./imports/AP2112K_3_3TRG1"',
       'import { USBLC6_2SC6 } from "./imports/USBLC6_2SC6"',
       'import { ABM8_272_T3 } from "./imports/ABM8_272_T3"',
       'export default function RobotController() { return (',
       '<board width={64} height={50} layers={2} thickness={1.6} title="Rover RP2040 rev A" solderMaskColor="blue"',
       ' autorouter={{local:true, traceClearance:0.22, allowViaInPad:false}} minTraceWidth={0.15} defaultTraceWidth={0.15} minTraceToPadEdgeClearance={0.1}',
       ' minViaHoleDiameter={0.2} minViaPadDiameter={0.45} schTraceAutoLabelEnabled schMaxTraceDistance={0.01} isViaInPadAllowed>']
nets = {}
parts = []
sections = {'MCU':(0,0), 'USB':(26,0), 'Power':(52,0), 'Motors':(0,-32), 'Encoders':(26,-32), 'IMU':(52,-32), 'Servos':(0,-66), 'Expansion':(26,-66)}
counts = {k:0 for k in sections}
out += ['<autoroutingphase phaseIndex={0} autorouter="fanout" fanoutPourNetMap={{bottom: "GND"}} fanoutRoutingLayers={["top","bottom"]} />']
for s in sections: out.append(f'<schematicsection name="{s}" />')

def wire(ref, pin, net): nets.setdefault(net, []).append(f'.{ref} > .{pin if isinstance(pin,str) else "pin"+str(pin)}')
def part(tag, ref, x, y, section, connections=None, **props):
    i=counts[section]; counts[section]+=1
    sx,sy=sections[section]
    # Large MCU schematic gets a dedicated column; supporting parts stay nearby.
    if section=='MCU':
        sx,sy=(0,0) if i==0 else (9+((i-1)%3)*5, 8-((i-1)//3)*4)
    else: sx,sy=sx+(i%3)*6,sy-(i//3)*5
    if section=='USB': sy=-(i//3)*7
    if tag=='capacitor': props['schOrientation']='vertical'
    if ref=='U1': props['schHeight']=5.8
    if ref in ['U_M1','U_M2']: props['schHeight']=1.0
    if ref=='U_REG': props['schHeight']=0.6
    attrs={'name':ref,'pcbX':x,'pcbY':y,'schX':sx,'schY':sy,'schSectionName':section,**props}
    out.append('<'+tag+' '+' '.join(k+'={'+json.dumps(v)+'}' for k,v in attrs.items())+' />')
    if connections:
        for pin,net in connections.items():
            if net: wire(ref,pin,net)
    parts.append({'reference':ref,'element':tag,'x':x,'y':y,'section':section,**props})

def cap(ref,val,x,y,rail,section='MCU',fp='0402',rot=0):
    part('capacitor',ref,x,y,section,{1:rail,2:'GND'},capacitance=val,footprint=fp,pcbRotation=rot)
def res(ref,val,x,y,a,b,section='MCU',rot=0,fp='0402'):
    part('resistor',ref,x,y,section,{1:a,2:b},resistance=val,footprint=fp,pcbRotation=rot)
def header(ref,x,y,n,section,connections,rot=0,pitch=2.54):
    part('pinheader',ref,x,y,section,{i+1:v for i,v in enumerate(connections)},pinCount=n,footprint=f'pinrow{n}_p{pitch}mm',pcbRotation=rot)

# RP2040 bare chip, QSPI flash, crystal, all supply pins and external decoupling.
mcu={1:'V3V3',10:'V3V3',19:'GND',20:'XIN',21:'XOUT',22:'V3V3',23:'V1V1',24:'SWCLK',25:'SWDIO',26:'RUN',33:'V3V3',42:'V3V3',43:'AVDD',44:'V3V3',45:'V1V1',46:'USB_DM_MCU',47:'USB_DP_MCU',48:'V3V3',49:'V3V3',50:'V1V1',51:'QSPI_D3',52:'QSPI_CLK',53:'QSPI_D0',54:'QSPI_D2',55:'QSPI_D1',56:'QSPI_CS',57:'GND'}
gpio={0:'M1_IN1',1:'M1_IN2',2:'M2_IN1',3:'M2_IN2',4:'ENC1_A',5:'ENC1_B',6:'ENC2_A',7:'ENC2_B',8:'GP8',9:'GP9',10:None,11:'MOTOR_EN',12:'SERVO1',13:'SERVO2',14:'SERVO3',15:'SERVO4',16:'GP16',17:'GP17',18:'GP18',19:'GP19',20:'I2C_SDA',21:'I2C_SCL',22:'IMU_INT',23:None,24:None,25:'STATUS',26:'ADC0',27:'ADC1',28:None,29:None}
gp_pins=[2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,27,28,29,30,31,32,34,35,36,37,38,39,40,41]
mcu.update({p:gpio[g] for g,p in enumerate(gp_pins)})
part('RP2040','U1',7,4,'MCU',mcu)
part('W25Q16JVSSIQ','U2',7,15,'MCU',{1:'QSPI_CS',2:'QSPI_D1',3:'QSPI_D2',4:'GND',5:'QSPI_D0',6:'QSPI_CLK',7:'QSPI_D3',8:'V3V3'},pcbRotation=90)
part('ABM8_272_T3','Y1',7,-5,'MCU',{1:'XIN',2:'GND',3:'XTAL_OUT',4:'GND'})
res('R_XTAL','1k',6.8,-2.2,'XOUT','XTAL_OUT',rot=90)
cap('C_X1','15pF',5,-7.5,'XIN')
cap('C_X2','15pF',9,-8.5,'XTAL_OUT')
res('R_BOOT','1k',8,21,'QSPI_CS','BOOT_SW')
header('J_BOOT',12.5,21,2,'MCU',['BOOT_SW','GND'])
res('R_CS','10k',3.8,20,'V3V3','QSPI_CS')
res('R_RUN','10k',12,-3,'V3V3','RUN')
header('J_RESET',14,-7,2,'MCU',['RUN','GND'])
cap('C_FLASH','100nF',1,11.5,'V3V3')
for ref,x,y,rail,rot in [('C_IO1',2,6,'V3V3',90),('C_IO2',2,2,'V3V3',90),('C_IO3',11,-1.5,'V3V3',0),('C_IO4',13,2,'V3V3',90),('C_IO5',13,6,'V3V3',90),('C_IO6',6.2,10.5,'V3V3',0),('C_USB',11.5,10,'V3V3',0),('C_CORE1',4,10.5,'V1V1',0),('C_CORE2',11,-4.5,'V1V1',0)]:
    cap(ref,'100nF',x,y,rail,rot=rot)
cap('C_REGIN','1uF',15,8.5,'V3V3')
cap('C_REGOUT','1uF',15.5,6,'V1V1')
res('R_AVDD','200',16,2,'V3V3','AVDD',rot=90)
cap('C_AVDD','100nF',16,0,'AVDD')
header('J_SWD',5,-11,4,'Expansion',['V3V3','SWDIO','SWCLK','GND'])

# USB-C sink: both CC pins have independent Rd; both receptacle data pairs joined.
part('UsbC','J_USB',21,19.4,'USB',{'VBUS1':'VBUS','VBUS2':'VBUS','CC1':'CC1','CC2':'CC2','DP1':'USB_DP','DP2':'USB_DP','DM1':'USB_DM','DM2':'USB_DM','GND1':'GND','GND2':'GND','SHELL1':'GND','SHELL2':'GND','SHELL3':'GND','SHELL4':'GND'},pcbRotation=180)
res('R_CC1','5.1k',15,17,'CC1','GND','USB',90)
res('R_CC2','5.1k',27,17,'CC2','GND','USB',90)
part('USBLC6_2SC6','U_ESD',23,11,'USB',{1:'USB_DP',6:'USB_DP',3:'USB_DM',4:'USB_DM',2:'GND',5:'VBUS'})
res('R_DP','27',8,10.5,'USB_DP_MCU','USB_DP','USB',90)
res('R_DM','27',9.2,10.5,'USB_DM_MCU','USB_DM','USB',90)
cap('C_VBUS','1uF',27,11,'VBUS','USB','0603')

# Regulated external 5 V also powers the servos; motor supply never feeds USB.
header('J_5V',-11,20,2,'Power',['V5_SERVO','GND'])
part('diode','D_USB',16,12,'Power',{'anode':'VBUS','cathode':'V5_LOGIC'},footprint='sma',manufacturerPartNumber='SS14',supplierPartNumbers={'jlcpcb':['C2480']})
part('diode','D_EXT',-4,20,'Power',{'anode':'V5_SERVO','cathode':'V5_LOGIC'},footprint='sma',manufacturerPartNumber='SS14',supplierPartNumbers={'jlcpcb':['C2480']})
part('AP2112K_3_3TRG1','U_REG',-4,14,'Power',{1:'V5_LOGIC',2:'GND',3:'V5_LOGIC',5:'V3V3'})
cap('C_5LOG','1uF',-7.5,14,'V5_LOGIC','Power','0603')
cap('C_3V3','4.7uF',-0.5,14,'V3V3','Power','0603')
cap('C_5SERVO','100uF',-14,-11,'V5_SERVO','Power','1210')

# Motor zone at the left; connector > bulk capacitor > bridge, short high current loops.
header('J_VM',-22,20,2,'Motors',['VM','GND'],pitch=3.5)
cap('C_VM','100uF',-22,15,'VM','Motors','1210')
for i,y in [(1,8),(2,-4)]:
    part('DRV8837DSGR',f'U_M{i}',-21,y,'Motors',{1:'VM',2:f'M{i}_A',3:f'M{i}_B',4:'GND',5:f'M{i}_IN2',6:f'M{i}_IN1',7:'MOTOR_EN',8:'V3V3',9:'GND'})
    header(f'J_M{i}',-28,y,2,'Motors',[f'M{i}_A',f'M{i}_B'],rot=90,pitch=3.5)
    cap(f'C_M{i}VM','100nF',-24,y+2,'VM','Motors','0603',90)
    cap(f'C_M{i}BULK','10uF',-21,y+4,'VM','Motors','0805')
    cap(f'C_M{i}LOG','100nF',-18,y+1,'V3V3','Motors',rot=90)
res('R_SLEEP','100k',-16,2,'MOTOR_EN','GND','Motors',90)

# Encoders accept 3.3 V push-pull or open-collector outputs; series R + small RC.
for i,y in [(1,7),(2,0)]:
    header(f'J_ENC{i}',-7,y,4,'Encoders',['V3V3','GND',f'ENC{i}_A_RAW',f'ENC{i}_B_RAW'])
    for j,ch in enumerate(['A','B']):
        x=-11+j*3
        res(f'R_E{i}{ch}','1k',x,y-2.5,f'ENC{i}_{ch}_RAW',f'ENC{i}_{ch}','Encoders')
        res(f'R_P{i}{ch}','10k',x,y-4.3,'V3V3',f'ENC{i}_{ch}','Encoders')
        cap(f'C_E{i}{ch}','100pF',x+6,y-3.3,f'ENC{i}_{ch}','Encoders',rot=90)

# Six-axis IMU, address 0x6A, four-wire SPI pins safely configured for I2C mode.
part('LSM6DS3TR_C','U_IMU',22,-7,'IMU',{1:'GND',4:'IMU_INT',5:'V3V3',6:'GND',7:'GND',8:'V3V3',12:'V3V3',13:'I2C_SCL',14:'I2C_SDA'},pcbRotation=180)
cap('C_IMU1','100nF',19,-7,'V3V3','IMU',rot=90)
cap('C_IMU2','100nF',25,-7,'V3V3','IMU',rot=90)
cap('C_IMU3','1uF',22,-10,'V3V3','IMU','0603')
res('R_SDA','4.7k',18,-3,'V3V3','I2C_SDA','IMU')
res('R_SCL','4.7k',22,-3,'V3V3','I2C_SCL','IMU')
header('J_I2C',22,-16,4,'IMU',['V3V3','GND','I2C_SDA','I2C_SCL'])

for i,x in enumerate([-23.5,-19,-14,-9],1):
    header(f'J_S{i}',x,-20,3,'Servos',['GND','V5_SERVO',f'SERVO{i}_OUT'],rot=90)
    res(f'R_S{i}','220',x+1.8,-14.5,f'SERVO{i}',f'SERVO{i}_OUT','Servos',90)
header('J_GPIO',13,-21,10,'Expansion',['GND','V3V3','GP16','GP17','GP18','GP19','GP8','GP9','ADC0','ADC1'])
res('R_LED','1k',14,-11,'STATUS','LED_A','Expansion')
part('led','LED1',14,-14,'Expansion',{'anode':'LED_A','cathode':'GND'},footprint='0603',color='green')

out.append('<trace name="XTAL_XIN_MANUAL" from=".U1 > .pin20" to=".Y1 > .pin1" thickness={0.15} pcbPath={[".U1 > .pin20", {x:-0.6,y:-4.8}, {x:-2.4,y:-6.6}, {x:-2.4,y:-9.85}, ".Y1 > .pin1"]} />')
for net,pins in nets.items():
    power=net in ['V3V3','V1V1','AVDD','VBUS','V5_LOGIC','V5_SERVO','VM']
    out.append(f'<net name="{net}"'+(' routingPhaseIndex={0}' if net=='GND' else '')+(' isPowerNet' if power else '')+' />')
    width=0.15
    if net in ['VM','V5_SERVO']: width=0.8
    elif net.startswith('M') and net.endswith(('_A','_B')): width=0.6
    for j,pin in enumerate(pins):
        out.append(f'<trace name="{net}_{j}" from="{pin}" to="net.{net}" schDisplayLabel="{net}" thickness={{{width}}} />')
for x,y in [(-29,22),(29,22),(-29.5,-22),(29,-22)]:
    out.append(f'<hole diameter={{2.7}} pcbX={{{x}}} pcbY={{{y}}} />')
out += ['<copperpour connectsTo="net.GND" layer="bottom" clearance={0.2} boardEdgeMargin={0.4} useThermalReliefs />',
        '<copperpour connectsTo="net.GND" layer="top" clearance={0.2} boardEdgeMargin={0.4} useThermalReliefs />']
for x,y in [(-25,12),(-25,0),(-18,6),(-18,-6),(-17,18),(-3,10),(16,17),(17,-9),(24,-12),(1,-9),(0,18),(27,3)]:
    out.append(f'<via name="G_{x}_{y}" pcbX={{{x}}} pcbY={{{y}}} holeDiameter={{0.3}} outerDiameter={{0.6}} fromLayer="top" toLayer="bottom" connectsTo="net.GND" />')
for i,(x,y) in enumerate([(6.4,3.4),(6.4,4.6),(7.6,3.4),(7.6,4.6),(-21.4,8),(-20.6,8),(-21.4,-4),(-20.6,-4)]):
    out.append(f'<via name="THERMAL_{i}" pcbX={{{x}}} pcbY={{{y}}} holeDiameter={{0.2}} outerDiameter={{0.4}} fromLayer="top" toLayer="bottom" connectsTo="net.GND" />')
for text,x,y,size in [('ROVER / RP2040',5,23,1),('MOTOR 5-9V',-21,23,0.8),('5V IN',-11,23,0.8),('M1',-28,12,1),('M2',-28,0,1),('ENC1',-7,9,0.8),('ENC2',-7,2,0.8),('IMU',22,-4.8,0.8),('SERVOS: G 5V S',-16,-24,0.8),('GPIO / 3V3 ONLY',14,-24,0.8),('USB',25,23,0.8),('REV A / 2L',-1,-16,0.8)]:
    out.append(f'<silkscreentext text="{text}" pcbX={{{x}}} pcbY={{{y}}} fontSize={{{size}}} />')
out.append('</board> ) }')
Path('index.circuit.tsx').write_text('\n'.join(out)+'\n')
Path('design-manifest.json').write_text(json.dumps({'board_mm':[64,50], 'layers':2,'gpio':gpio,'nets':nets,'parts':parts},indent=2))
