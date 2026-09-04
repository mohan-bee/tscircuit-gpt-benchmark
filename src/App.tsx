import { ArrowUpRight, CircuitBoard, Code2, Download, GitCompareArrows } from "lucide-react"

const platforms = [
  {
    name: "tscircuit",
    eyebrow: "Code-first CAD",
    accent: "mint",
    sourcePcb: "/examples/tscircuit/index.circuit.tsx",
    sourceSchematic: "/examples/tscircuit/index.circuit.tsx",
    pcb: "/assets/tscircuit-pcb.svg",
    schematic: "/assets/tscircuit-schematic.svg",
  },
  {
    name: "KiCad",
    eyebrow: "Desktop EDA",
    accent: "blue",
    sourcePcb: "/examples/kicad/rc-filter.kicad_pcb",
    sourceSchematic: "/examples/kicad/rc-filter.sch",
    pcb: "/assets/kicad-pcb.svg",
    schematic: "/assets/kicad-schematic.svg",
  },
] as const

type ViewCardProps = {
  title: string
  subtitle: string
  image: string
  alt: string
  source: string
}

function ViewCard({ title, subtitle, image, alt, source }: ViewCardProps) {
  return (
    <article className="view-card">
      <div className="view-card__header">
        <div>
          <p className="view-card__title">{title}</p>
          <p className="view-card__subtitle">{subtitle}</p>
        </div>
        <a className="icon-button" href={source} download aria-label={`Download ${title} source`}>
          <Download size={17} strokeWidth={1.8} />
        </a>
      </div>
      <div className="canvas">
        <img src={image} alt={alt} />
      </div>
    </article>
  )
}

export function App() {
  return (
    <main>
      <nav className="nav shell">
        <a className="brand" href="#top" aria-label="PCB Mirror home">
          <span className="brand__mark"><CircuitBoard size={18} /></span>
          <span>PCB Mirror</span>
        </a>
        <a className="source-link" href="https://github.com/mohan-bee/pcb-cad-viewer" target="_blank" rel="noreferrer">
          <Code2 size={16} /> Source <ArrowUpRight size={14} />
        </a>
      </nav>

      <section className="hero shell" id="top">
        <div className="hero__eyebrow"><GitCompareArrows size={14} /> Same circuit. Two workflows.</div>
        <h1>See the board.<br /><span>Skip the scoreboard.</span></h1>
        <p>A focused visual comparison of one resistor-capacitor circuit rendered in tscircuit and KiCad.</p>
        <div className="circuit-pill">
          <span><b>R1</b> 1 kΩ</span><i />
          <span><b>C1</b> 100 nF</span><i />
          <span><b>Board</b> 36 × 22 mm</span>
        </div>
      </section>

      <section className="comparison shell" aria-label="CAD comparison">
        {platforms.map((platform) => (
          <div className={`platform platform--${platform.accent}`} key={platform.name}>
            <header className="platform__header">
              <div>
                <span className="platform__dot" />
                <h2>{platform.name}</h2>
              </div>
              <p>{platform.eyebrow}</p>
            </header>
            <ViewCard
              title="Schematic"
              subtitle="VIN → R1 → VOUT → C1 → GND"
              image={platform.schematic}
              alt={`${platform.name} RC filter schematic`}
              source={platform.sourceSchematic}
            />
            <ViewCard
              title="PCB"
              subtitle="0805 footprints · two-layer board"
              image={platform.pcb}
              alt={`${platform.name} RC filter PCB layout`}
              source={platform.sourcePcb}
            />
          </div>
        ))}
      </section>

      <footer className="footer shell">
        <p>One tiny circuit, shown honestly in both tools.</p>
        <span>RC filter · revision 01</span>
      </footer>
    </main>
  )
}
