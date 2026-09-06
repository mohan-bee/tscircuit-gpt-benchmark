import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["VM"],
  pin2: ["OUT1"],
  pin3: ["OUT2"],
  pin4: ["GND"],
  pin5: ["IN2"],
  pin6: ["IN1"],
  pin7: ["nSLEEP"],
  pin8: ["VCC"],
  pin9: ["EP"]
} as const

const pinAttributes = {
  pin4: {requiresGround: true},
  pin8: {requiresPower: true}
} as const

const footprinterPinLabels = {
  ...pinLabels,
  "pin9": [...pinLabels["pin9"], "thermalpad"],
} as const

export const DRV8837DSGR = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={footprinterPinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C39159"
  ]
}}
      manufacturerPartNumber="DRV8837DSGR"
      footprint="dfn8_thermalpad0.9mmx1.6mm_p0.5mm_w2.42mm_pw0.25mm_pl0.52mm"
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C39159.obj?uuid=2be2baea8d8242eebd2ce617314d92a1",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C39159.step?uuid=2be2baea8d8242eebd2ce617314d92a1",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: 0, z: 0 },
      }}
      {...props}
    />
  )
}