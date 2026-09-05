import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["VDDIO"],
  pin2: ["GND1"],
  pin3: ["RESERVED1"],
  pin4: ["GND2"],
  pin5: ["GND3"],
  pin6: ["VS"],
  pin7: ["N_CS"],
  pin8: ["INT1"],
  pin9: ["INT2"],
  pin10: ["NC"],
  pin11: ["RESERVED2"],
  pin12: ["pin12"],
  pin13: ["pin13"],
  pin14: ["pin14"]
} as const

const pinAttributes = {
  pin2: {requiresGround: true},
  pin4: {requiresGround: true},
  pin5: {requiresGround: true},
  pin10: {doNotConnect: true}
} as const

export const ADXL345BCCZ_RL7 = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C9667"
  ]
}}
      manufacturerPartNumber="ADXL345BCCZ-RL7"
      footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX="-1.999996mm" pcbY="-1.409446mm" width="0.4480052mm" height="1.7690084mm" radius="0.2240026mm" shape="pill" />
<smtpad portHints={["pin2"]} pcbX="-1.199896mm" pcbY="-1.409446mm" width="0.4480052mm" height="1.7690084mm" radius="0.2240026mm" shape="pill" />
<smtpad portHints={["pin3"]} pcbX="-0.40005mm" pcbY="-1.409446mm" width="0.4480052mm" height="1.7690084mm" radius="0.2240026mm" shape="pill" />
<smtpad portHints={["pin4"]} pcbX="0.40005mm" pcbY="-1.409446mm" width="0.4480052mm" height="1.7690084mm" radius="0.2240026mm" shape="pill" />
<smtpad portHints={["pin5"]} pcbX="1.199896mm" pcbY="-1.409446mm" width="0.4480052mm" height="1.7690084mm" radius="0.2240026mm" shape="pill" />
<smtpad portHints={["pin6"]} pcbX="1.999996mm" pcbY="-1.409446mm" width="0.4480052mm" height="1.7690084mm" radius="0.2240026mm" shape="pill" />
<smtpad portHints={["pin7"]} pcbX="2.29743mm" pcbY="0mm" width="1.5450058mm" height="0.5999988mm" shape="rect" />
<smtpad portHints={["pin8"]} pcbX="1.999996mm" pcbY="1.409446mm" width="0.4480052mm" height="1.7690084mm" radius="0.2240026mm" shape="pill" />
<smtpad portHints={["pin9"]} pcbX="1.199896mm" pcbY="1.409446mm" width="0.4480052mm" height="1.7690084mm" radius="0.2240026mm" shape="pill" />
<smtpad portHints={["pin10"]} pcbX="0.40005mm" pcbY="1.409446mm" width="0.4480052mm" height="1.7690084mm" radius="0.2240026mm" shape="pill" />
<smtpad portHints={["pin11"]} pcbX="-0.40005mm" pcbY="1.409446mm" width="0.4480052mm" height="1.7690084mm" radius="0.2240026mm" shape="pill" />
<smtpad portHints={["pin12"]} pcbX="-1.199896mm" pcbY="1.409446mm" width="0.4480052mm" height="1.7690084mm" radius="0.2240026mm" shape="pill" />
<smtpad portHints={["pin13"]} pcbX="-1.999996mm" pcbY="1.409446mm" width="0.4480052mm" height="1.7690084mm" radius="0.2240026mm" shape="pill" />
<smtpad portHints={["pin14"]} pcbX="-2.29743mm" pcbY="0mm" width="1.5450058mm" height="0.5999988mm" shape="rect" />
<silkscreenpath route={[{"x":-2.5761949999999842,"y":0.5405120000000352},{"x":-2.5761949999999842,"y":1.5761970000000929},{"x":-2.4144986000001154,"y":1.5761970000000929}]} />
<silkscreenpath route={[{"x":2.5761949999999842,"y":0.5405120000000352},{"x":2.5761949999999842,"y":1.5761970000000929},{"x":2.4144986000000017,"y":1.5761970000000929}]} />
<silkscreenpath route={[{"x":-2.5761949999999842,"y":-0.5405120000000352},{"x":-2.5761949999999842,"y":-1.5761969999999792},{"x":-2.4144986000001154,"y":-1.5761969999999792}]} />
<silkscreenpath route={[{"x":2.5761949999999842,"y":-0.5405120000000352},{"x":2.5761949999999842,"y":-1.5761969999999792},{"x":2.4144986000000017,"y":-1.5761969999999792}]} />
<silkscreencircle pcbX="-1.999996mm" pcbY="-2.594102mm" radius="0.124968mm" />
<silkscreentext text="{NAME}" pcbX="0mm" pcbY="3.0574mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-3.3233999999999924,"y":2.3074000000000296},{"x":3.3233999999998787,"y":2.3074000000000296},{"x":3.3233999999998787,"y":-2.9932000000001153},{"x":-3.3233999999999924,"y":-2.9932000000001153},{"x":-3.3233999999999924,"y":2.3074000000000296}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C9667.obj?uuid=a761e2d4c50e42c28a0df5e341dfbf4d",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C9667.step?uuid=a761e2d4c50e42c28a0df5e341dfbf4d",
        pcbRotationOffset: 90,
        modelOriginPosition: { x: 0, y: 0, z: 0 },
      }}
      {...props}
    />
  )
}