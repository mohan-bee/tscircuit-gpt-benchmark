export default () => (
  <board width="36mm" height="22mm">
    <resistor
      name="R1"
      resistance="1k"
      footprint="0805"
      schX={-2}
      pcbX={-5}
    />
    <capacitor
      name="C1"
      capacitance="100nF"
      footprint="0805"
      schX={2}
      pcbX={5}
    />
    <trace from=".R1 > .pin2" to=".C1 > .pin1" />
    <trace from=".R1 > .pin1" to="net.VIN" />
    <trace from=".C1 > .pin2" to="net.GND" />
  </board>
)

