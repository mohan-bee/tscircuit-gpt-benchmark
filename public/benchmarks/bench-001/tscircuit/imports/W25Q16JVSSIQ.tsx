import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["CS"],
  pin2: ["IO1"],
  pin3: ["IO2"],
  pin4: ["GND"],
  pin5: ["IO0"],
  pin6: ["CLK"],
  pin7: ["IO3"],
  pin8: ["VCC"]
} as const

const pinAttributes = {
  pin4: {requiresGround: true},
  pin8: {requiresPower: true}
} as const

export const W25Q16JVSSIQ = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C131025"
  ]
}}
      manufacturerPartNumber="W25Q16JVSSIQ"
      footprint="soic8_pillpads_w9.31mm_pw0.63mm_pl2.25mm_pin1location(leftside,bottom)"
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C131025.obj?uuid=4652e19b90fa4dbb8662aa4cba61a532",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C131025.step?uuid=4652e19b90fa4dbb8662aa4cba61a532",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0.000012700000070253736, y: -0.000012699999956566899, z: -0.069425 },
      }}
      {...props}
    />
  )
}