import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["SHELL2", "EH2"],
  pin2: ["SHELL1", "EH1"],
  pin3: ["SHELL4", "EH4"],
  pin4: ["SHELL3", "EH3"],
  pin5: ["SBU2", "B8","SBU2"],
  pin6: ["CC1", "A5","CC1"],
  pin7: ["DM2", "B7","DN2"],
  pin8: ["DP1", "A6","DP1"],
  pin9: ["DM1", "A7","DN1"],
  pin10: ["DP2", "B6","DP2"],
  pin11: ["SBU1", "A8","SBU1"],
  pin12: ["CC2", "B5","CC2"],
  pin13: ["GND1", "A1B12","GND1"],
  pin14: ["GND2", "B1A12","GND2"],
  pin15: ["VBUS1", "B4A9","VBUS1"],
  pin16: ["VBUS2", "A4B9","VBUS2"]
} as const

export const UsbC = (props: ChipProps<typeof pinLabels>) => {
  return (
    <connector standard="usb_c"
      pinLabels={pinLabels}
      symbol={<symbol><schematicrect schX={0} schY={0} width={1.6} height={6.4} /><port name="pin1" pinNumber={1} aliases={["SHELL2"]} direction="right" schX={1.1} schY={3.0} schStemLength={0.3} /><port name="pin2" pinNumber={2} aliases={["SHELL1"]} direction="right" schX={1.1} schY={2.6} schStemLength={0.3} /><port name="pin3" pinNumber={3} aliases={["SHELL4"]} direction="right" schX={1.1} schY={2.2} schStemLength={0.3} /><port name="pin4" pinNumber={4} aliases={["SHELL3"]} direction="right" schX={1.1} schY={1.8} schStemLength={0.3} /><port name="pin5" pinNumber={5} aliases={["SBU2"]} direction="right" schX={1.1} schY={1.4} schStemLength={0.3} /><port name="pin6" pinNumber={6} aliases={["CC1"]} direction="right" schX={1.1} schY={1.0} schStemLength={0.3} /><port name="pin7" pinNumber={7} aliases={["DM2"]} direction="right" schX={1.1} schY={0.6} schStemLength={0.3} /><port name="pin8" pinNumber={8} aliases={["DP1"]} direction="right" schX={1.1} schY={0.2} schStemLength={0.3} /><port name="pin9" pinNumber={9} aliases={["DM1"]} direction="right" schX={1.1} schY={-0.2} schStemLength={0.3} /><port name="pin10" pinNumber={10} aliases={["DP2"]} direction="right" schX={1.1} schY={-0.6} schStemLength={0.3} /><port name="pin11" pinNumber={11} aliases={["SBU1"]} direction="right" schX={1.1} schY={-1.0} schStemLength={0.3} /><port name="pin12" pinNumber={12} aliases={["CC2"]} direction="right" schX={1.1} schY={-1.4} schStemLength={0.3} /><port name="pin13" pinNumber={13} aliases={["GND1"]} direction="right" schX={1.1} schY={-1.8} schStemLength={0.3} /><port name="pin14" pinNumber={14} aliases={["GND2"]} direction="right" schX={1.1} schY={-2.2} schStemLength={0.3} /><port name="pin15" pinNumber={15} aliases={["VBUS1"]} direction="right" schX={1.1} schY={-2.6} schStemLength={0.3} /><port name="pin16" pinNumber={16} aliases={["VBUS2"]} direction="right" schX={1.1} schY={-3.0} schStemLength={0.3} /></symbol>}
      supplierPartNumbers={{
  "jlcpcb": [
    "C165948"
  ]
}}
      manufacturerPartNumber="TYPE-C-31-M-12"
      footprint={<footprint>
        <hole pcbX="-2.899918mm" pcbY="0.9055672mm" diameter="0.5999988mm" />
<hole pcbX="2.899918mm" pcbY="0.9055672mm" diameter="0.5999988mm" />
<platedhole  portHints={["pin2"]} pcbX="4.325112mm" pcbY="-2.7741308mm" holeWidth="0.7999984mm" holeHeight="1.3999972mm" outerWidth="1.1999976mm" outerHeight="1.7999964mm" shape="pill" />
<platedhole  portHints={["pin1"]} pcbX="4.325112mm" pcbY="1.4056932mm" holeWidth="0.7999984mm" holeHeight="1.5999968mm" outerWidth="1.1999976mm" outerHeight="1.999996mm" shape="pill" />
<platedhole  portHints={["pin4"]} pcbX="-4.325112mm" pcbY="1.4056932mm" holeWidth="0.7999984mm" holeHeight="1.5999968mm" outerWidth="1.1999976mm" outerHeight="1.999996mm" shape="pill" />
<platedhole  portHints={["pin3"]} pcbX="-4.325112mm" pcbY="-2.7741308mm" holeWidth="0.7999984mm" holeHeight="1.3999972mm" outerWidth="1.1999976mm" outerHeight="1.7999964mm" shape="pill" />
<smtpad portHints={["pin5"]} pcbX="-1.75006mm" pcbY="2.1740432mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin6"]} pcbX="-1.249934mm" pcbY="2.1740432mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin7"]} pcbX="-0.750062mm" pcbY="2.1740432mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin8"]} pcbX="-0.249936mm" pcbY="2.1740432mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin9"]} pcbX="0.249936mm" pcbY="2.1740432mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin10"]} pcbX="0.750062mm" pcbY="2.1740432mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin11"]} pcbX="1.24968mm" pcbY="2.1740432mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin12"]} pcbX="1.75006mm" pcbY="2.1740432mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin13"]} points={[{x: "-2.8999688mm", y: "1.524108mm"}, {x: "-2.8999688mm", y: "2.8241308mm"}, {x: "-2.8999688mm", y: "2.8241308mm"}, {x: "-3.1999682mm", y: "2.8241308mm"}, {x: "-3.1999682mm", y: "2.8241308mm"}, {x: "-3.1999682mm", y: "2.8239784mm"}, {x: "-3.1999682mm", y: "2.8239784mm"}, {x: "-3.4999422mm", y: "2.8239784mm"}, {x: "-3.4999422mm", y: "2.8239784mm"}, {x: "-3.4999422mm", y: "1.5239556mm"}, {x: "-3.4999422mm", y: "1.5239556mm"}, {x: "-3.1999428mm", y: "1.5239556mm"}, {x: "-3.1999428mm", y: "1.5239556mm"}, {x: "-3.1999428mm", y: "1.524108mm"}, {x: "-3.1999428mm", y: "1.524108mm"}, {x: "-2.8999688mm", y: "1.524108mm"}]} shape="polygon" />
<smtpad portHints={["pin14"]} points={[{x: "2.8999942mm", y: "2.8241308mm"}, {x: "2.8999942mm", y: "1.5241588mm"}, {x: "2.8999942mm", y: "1.5241588mm"}, {x: "3.1999936mm", y: "1.5241588mm"}, {x: "3.1999936mm", y: "1.5241588mm"}, {x: "3.200019mm", y: "1.5241588mm"}, {x: "3.200019mm", y: "1.5241588mm"}, {x: "3.5000184mm", y: "1.5241588mm"}, {x: "3.5000184mm", y: "1.5241588mm"}, {x: "3.5000184mm", y: "2.8241308mm"}, {x: "3.5000184mm", y: "2.8241308mm"}, {x: "3.200019mm", y: "2.8241308mm"}, {x: "3.200019mm", y: "2.8241308mm"}, {x: "3.1999936mm", y: "2.8241308mm"}, {x: "3.1999936mm", y: "2.8241308mm"}, {x: "2.8999942mm", y: "2.8241308mm"}]} shape="polygon" />
<smtpad portHints={["pin15"]} points={[{x: "2.7001724mm", y: "1.5241588mm"}, {x: "2.7001724mm", y: "2.8241308mm"}, {x: "2.7001724mm", y: "2.8241308mm"}, {x: "2.400173mm", y: "2.8241308mm"}, {x: "2.400173mm", y: "2.8241308mm"}, {x: "2.4001476mm", y: "2.8241308mm"}, {x: "2.4001476mm", y: "2.8241308mm"}, {x: "2.1001482mm", y: "2.8241308mm"}, {x: "2.1001482mm", y: "2.8241308mm"}, {x: "2.1001482mm", y: "1.5241588mm"}, {x: "2.1001482mm", y: "1.5241588mm"}, {x: "2.4001476mm", y: "1.5241588mm"}, {x: "2.4001476mm", y: "1.5241588mm"}, {x: "2.400173mm", y: "1.5241588mm"}, {x: "2.400173mm", y: "1.5241588mm"}, {x: "2.7001724mm", y: "1.5241588mm"}]} shape="polygon" />
<smtpad portHints={["pin16"]} points={[{x: "-2.0999704mm", y: "1.5240064mm"}, {x: "-2.0999704mm", y: "2.8239784mm"}, {x: "-2.0999704mm", y: "2.8239784mm"}, {x: "-2.3999952mm", y: "2.8239784mm"}, {x: "-2.3999952mm", y: "2.8239784mm"}, {x: "-2.3999952mm", y: "2.823953mm"}, {x: "-2.3999952mm", y: "2.823953mm"}, {x: "-2.6999438mm", y: "2.823953mm"}, {x: "-2.6999438mm", y: "2.823953mm"}, {x: "-2.6999438mm", y: "1.523981mm"}, {x: "-2.6999438mm", y: "1.523981mm"}, {x: "-2.399919mm", y: "1.523981mm"}, {x: "-2.399919mm", y: "1.523981mm"}, {x: "-2.399919mm", y: "1.5240064mm"}, {x: "-2.399919mm", y: "1.5240064mm"}, {x: "-2.0999704mm", y: "1.5240064mm"}]} shape="polygon" />
<silkscreenpath route={[{"x":-4.4689776000000165,"y":-1.6757585999999947},{"x":-4.4689776000000165,"y":0.18715359999987413}]} />
<silkscreenpath route={[{"x":4.471009600000116,"y":-5.394140800000059},{"x":-4.4689776000000165,"y":-5.394140800000059},{"x":-4.4689776000000165,"y":-3.91283820000001}]} />
<silkscreenpath route={[{"x":4.471009600000116,"y":-1.676114200000029},{"x":4.471009600000116,"y":0.18750920000002225}]} />
<silkscreenpath route={[{"x":4.471009600000116,"y":-5.394140800000059},{"x":4.471009600000116,"y":-3.912482600000203}]} />
<silkscreentext text="{NAME}" pcbX="0.002794mm" pcbY="3.8286012mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-5.174805999999876,"y":3.0786011999998664},{"x":5.180394000000092,"y":3.0786011999998664},{"x":5.180394000000092,"y":-5.650998800000025},{"x":-5.174805999999876,"y":-5.650998800000025},{"x":-5.174805999999876,"y":3.0786011999998664}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C165948.obj?uuid=617b05f9bba7410b96c001093d8189e4",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C165948.step?uuid=617b05f9bba7410b96c001093d8189e4",
        pcbRotationOffset: 180,
        modelOriginPosition: { x: 0, y: -2.7500289000000517, z: 0.000010999999999872223 },
      }}
      {...props}
    />
  )
}