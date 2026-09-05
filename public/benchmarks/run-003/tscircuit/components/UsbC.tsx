import type { ConnectorProps } from "@tscircuit/props"
// Frozen native USB-C footprint returned by tscircuit's standard parts engine.
// C2765186-compatible 16-contact receptacle. Mechanical locator bores are holes.
const labels = ["GND1","VBUS1","SBU2","CC1","DM2","DP1","DM1","DP2","SBU1","CC2","VBUS2","GND2","SHELL1","SHELL2","SHELL3","SHELL4"]
const pinLabels = Object.fromEntries(labels.map((label,i)=>[`pin${i+1}`,[label]]))
export function UsbC(props: ConnectorProps) {
  return <connector {...props} standard="usb_c" manufacturerPartNumber="TYPE-C 16PIN 2MD(073)"
    supplierPartNumbers={{jlcpcb:["C2765186"]}} pinLabels={pinLabels}
    schPinArrangement={{rightSide:{pins:labels,direction:"top-to-bottom"}}}
    schWidth={1.2} schHeight={3.7}
    footprint={<footprint>
      {[-3.2,-2.4,-1.75,-1.25,-0.75,-0.25,0.25,0.75,1.25,1.75,2.4,3.2].map((x,i)=>
        <smtpad shape="rect" pcbX={x} pcbY={2.125} width={[0,1,10,11].includes(i)?0.55:0.3}
          height={1.1} portHints={[`pin${i+1}`,labels[i]]}/>)}
      <platedhole shape="pill" pcbX={-4.325} pcbY={1.575} outerWidth={1.1} outerHeight={1.9} holeWidth={0.6} holeHeight={1.4} portHints={["pin13","SHELL1"]}/>
      <platedhole shape="pill" pcbX={4.325} pcbY={1.575} outerWidth={1.1} outerHeight={1.9} holeWidth={0.6} holeHeight={1.4} portHints={["pin14","SHELL2"]}/>
      <platedhole shape="pill" pcbX={-4.325} pcbY={-2.625} outerWidth={1.2} outerHeight={1.6} holeWidth={0.6} holeHeight={1} portHints={["pin15","SHELL3"]}/>
      <platedhole shape="pill" pcbX={4.325} pcbY={-2.625} outerWidth={1.2} outerHeight={1.6} holeWidth={0.6} holeHeight={1} portHints={["pin16","SHELL4"]}/>
      <hole diameter={0.7} pcbX={-2.89} pcbY={1.055}/>
      <hole diameter={0.7} pcbX={2.89} pcbY={1.055}/>
      <silkscreenpath route={[{x:-4.1,y:1},{x:-4.1,y:-4},{x:4.1,y:-4},{x:4.1,y:1}]} strokeWidth={0.15}/>
      <courtyardrect pcbX={0} pcbY={-0.7} width={10.4} height={7.2}/>
    </footprint>}/>
}
