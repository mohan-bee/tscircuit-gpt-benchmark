import type { ChipProps } from "@tscircuit/props"
const pinLabels = {
  pin1:["GND1"],pin2:["MISO"],pin3:["MOSI"],pin4:["SCK"],
  pin5:["NSS"],pin6:["RESET"],pin7:["DIO5"],pin8:["GND2"],
  pin9:["ANT"],pin10:["GND3"],pin11:["DIO3"],pin12:["DIO4"],
  pin13:["VCC"],pin14:["DIO0"],pin15:["DIO1"],pin16:["DIO2"],
} as const
// Original tscircuit footprint from HopeRF RFM95W v2.0 pp.10,11,122.
// 16 mm square, 2 mm pitch castellations, 2.2 x 1.2 mm host lands.
export function RFM95W(props: ChipProps<typeof pinLabels>) {
  return <chip {...props} manufacturerPartNumber="RFM95W-868S2" pinLabels={pinLabels}
    footprint={<footprint>
      {Array.from({length:8},(_,i)=><smtpad shape="rect" portHints={[`pin${i+1}`]} pcbX={-8} pcbY={7-2*i} width={2.2} height={1.2}/>)}
      {Array.from({length:8},(_,i)=><smtpad shape="rect" portHints={[`pin${9+i}`]} pcbX={8} pcbY={-7+2*i} width={2.2} height={1.2}/>)}
      <silkscreenrect pcbX={0} pcbY={0} width={16} height={16} strokeWidth={0.15}/>
      <silkscreentext text="RFM95W" pcbX={0} pcbY={0} fontSize={1.2}/>
      <courtyardrect pcbX={0} pcbY={0} width={18.8} height={16.6}/>
    </footprint>}/>
}
