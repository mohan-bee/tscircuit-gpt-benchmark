import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["SA0"],
  pin2: ["SDx"],
  pin3: ["SCx"],
  pin4: ["INT1"],
  pin5: ["VDDIO"],
  pin6: ["GND1"],
  pin7: ["GND2"],
  pin8: ["VDD"],
  pin9: ["INT2"],
  pin10: ["NC1"],
  pin11: ["NC2"],
  pin12: ["CS"],
  pin13: ["SCL"],
  pin14: ["SDA"]
} as const

const pinAttributes = {
  pin6: {requiresGround: true},
  pin7: {requiresGround: true},
  pin8: {requiresPower: true},
  pin10: {doNotConnect: true},
  pin11: {doNotConnect: true}
} as const

export const LSM6DS3TR_C = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C967633"
  ]
}}
      manufacturerPartNumber="LSM6DS3TR-C"
      footprint="lga_w3.2mm_h2.7mm_pl0.68mm"
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C967633.obj?uuid=f43373e142124ec98babb70d58d97864",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C967633.step?uuid=f43373e142124ec98babb70d58d97864",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0.00012700000002041634, y: -0.000012700000070253736, z: 0 },
      }}
      {...props}
    />
  )
}