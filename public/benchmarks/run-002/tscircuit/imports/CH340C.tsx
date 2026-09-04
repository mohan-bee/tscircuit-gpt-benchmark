import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["GND"],
  pin2: ["TXD"],
  pin3: ["RXD"],
  pin4: ["V3"],
  pin5: ["D_POS"],
  pin6: ["D_NEG"],
  pin7: ["pin7"],
  pin8: ["N_OUT"],
  pin9: ["N_CTS"],
  pin10: ["N_DSR"],
  pin11: ["N_RI"],
  pin12: ["N_DCD"],
  pin13: ["N_DTR"],
  pin14: ["N_RTS"],
  pin15: ["R232"],
  pin16: ["VCC"]
} as const

const pinAttributes = {
  pin1: {requiresGround: true},
  pin16: {requiresPower: true}
} as const

export const CH340C = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C84681"
  ]
}}
      manufacturerPartNumber="CH340C"
      footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX="-4.445mm" pcbY="-2.872486mm" width="0.5599938mm" height="1.7450054mm" radius="0.2799969mm" shape="pill" />
<smtpad portHints={["pin2"]} pcbX="-3.175mm" pcbY="-2.872486mm" width="0.5599938mm" height="1.7450054mm" radius="0.2799969mm" shape="pill" />
<smtpad portHints={["pin3"]} pcbX="-1.905mm" pcbY="-2.872486mm" width="0.5599938mm" height="1.7450054mm" radius="0.2799969mm" shape="pill" />
<smtpad portHints={["pin4"]} pcbX="-0.635mm" pcbY="-2.872486mm" width="0.5599938mm" height="1.7450054mm" radius="0.2799969mm" shape="pill" />
<smtpad portHints={["pin5"]} pcbX="0.635mm" pcbY="-2.872486mm" width="0.5599938mm" height="1.7450054mm" radius="0.2799969mm" shape="pill" />
<smtpad portHints={["pin6"]} pcbX="1.905mm" pcbY="-2.872486mm" width="0.5599938mm" height="1.7450054mm" radius="0.2799969mm" shape="pill" />
<smtpad portHints={["pin7"]} pcbX="3.175mm" pcbY="-2.872486mm" width="0.5599938mm" height="1.7450054mm" radius="0.2799969mm" shape="pill" />
<smtpad portHints={["pin8"]} pcbX="4.445mm" pcbY="-2.872486mm" width="0.5599938mm" height="1.7450054mm" radius="0.2799969mm" shape="pill" />
<smtpad portHints={["pin16"]} pcbX="-4.445mm" pcbY="2.872486mm" width="0.5599938mm" height="1.7450054mm" radius="0.2799969mm" shape="pill" />
<smtpad portHints={["pin15"]} pcbX="-3.175mm" pcbY="2.872486mm" width="0.5599938mm" height="1.7450054mm" radius="0.2799969mm" shape="pill" />
<smtpad portHints={["pin14"]} pcbX="-1.905mm" pcbY="2.872486mm" width="0.5599938mm" height="1.7450054mm" radius="0.2799969mm" shape="pill" />
<smtpad portHints={["pin13"]} pcbX="-0.635mm" pcbY="2.872486mm" width="0.5599938mm" height="1.7450054mm" radius="0.2799969mm" shape="pill" />
<smtpad portHints={["pin12"]} pcbX="0.635mm" pcbY="2.872486mm" width="0.5599938mm" height="1.7450054mm" radius="0.2799969mm" shape="pill" />
<smtpad portHints={["pin11"]} pcbX="1.905mm" pcbY="2.872486mm" width="0.5599938mm" height="1.7450054mm" radius="0.2799969mm" shape="pill" />
<smtpad portHints={["pin10"]} pcbX="3.175mm" pcbY="2.872486mm" width="0.5599938mm" height="1.7450054mm" radius="0.2799969mm" shape="pill" />
<smtpad portHints={["pin9"]} pcbX="4.445mm" pcbY="2.872486mm" width="0.5599938mm" height="1.7450054mm" radius="0.2799969mm" shape="pill" />
<silkscreenpath route={[{"x":-5.076190000000111,"y":-1.7713960000000952},{"x":-5.076190000000111,"y":1.7713959999999815},{"x":5.076189999999997,"y":1.7713959999999815},{"x":5.076189999999997,"y":-1.7713960000000952},{"x":-5.076190000000111,"y":-1.7713960000000952}]} />
<silkscreencircle pcbX="-4.445mm" pcbY="-1.019048mm" radius="0.150114mm" />
<silkscreencircle pcbX="-5.177282mm" pcbY="-2.872486mm" radius="0.150114mm" />
<silkscreentext text="{NAME}" pcbX="-0.127mm" pcbY="4.4544mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-5.58400000000006,"y":3.704400000000078},{"x":5.329999999999927,"y":3.704400000000078},{"x":5.329999999999927,"y":-3.9583999999998696},{"x":-5.58400000000006,"y":-3.9583999999998696},{"x":-5.58400000000006,"y":3.704400000000078}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C84681.obj?uuid=07126628bc464d5389bb996c52812f54",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C84681.step?uuid=07126628bc464d5389bb996c52812f54",
        pcbRotationOffset: 90,
        modelOriginPosition: { x: -0.000012700000070253736, y: 0, z: 0.000575 },
      }}
      {...props}
    />
  )
}