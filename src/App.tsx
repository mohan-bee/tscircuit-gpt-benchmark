import {
  ChevronDown,
  CircuitBoard,
  Code2,
  Download,
  GitCompareArrows,
  History,
  LayoutDashboard,
  MoreHorizontal,
  Search,
  Settings,
} from "lucide-react"

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
        <div className="view-card__actions">
          <a className="icon-button" href={source} download aria-label={`Download ${title} source`}>
            <Download size={15} />
          </a>
          <button className="icon-button" type="button" aria-label={`More ${title} options`}>
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
      <div className="canvas">
        <img src={image} alt={alt} />
        <span className="canvas__zoom">100%</span>
      </div>
    </article>
  )
}

export function App() {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <a className="brand" href="#workspace" aria-label="PCB Mirror dashboard">
          <span className="brand__mark"><CircuitBoard size={17} /></span>
          <span>PCB Mirror</span>
        </a>

        <div className="workspace-switcher">
          <span className="workspace-avatar">M</span>
          <div><b>Mohan's workspace</b><small>Personal</small></div>
          <ChevronDown size={14} />
        </div>

        <nav className="side-nav" aria-label="Dashboard navigation">
          <a href="#overview"><LayoutDashboard size={17} /> Overview</a>
          <a className="active" href="#workspace"><GitCompareArrows size={17} /> Compare</a>
          <a href="#runs"><History size={17} /> Runs <span>1</span></a>
        </nav>

        <div className="sidebar__section">
          <p>Projects</p>
          <a className="project-link" href="#workspace"><span className="project-dot" /> RC filter demo</a>
        </div>

        <div className="sidebar__footer">
          <a href="https://github.com/mohan-bee/pcb-cad-viewer" target="_blank" rel="noreferrer"><Code2 size={17} /> Repository</a>
          <a href="#settings"><Settings size={17} /> Settings</a>
        </div>
      </aside>

      <div className="app-shell">
        <header className="topbar">
          <div className="breadcrumbs"><span>Projects</span><i>/</i><b>RC filter demo</b></div>
          <button className="search" type="button"><Search size={15} /><span>Search</span><kbd>⌘ K</kbd></button>
          <div className="avatar">MB</div>
        </header>

        <main className="workspace" id="workspace">
          <section className="workspace-heading">
            <div>
              <div className="status"><span /> Ready</div>
              <h1>RC filter comparison</h1>
              <p>One circuit rendered across two CAD workflows.</p>
            </div>
            <button className="run-button" type="button"><GitCompareArrows size={16} /> New comparison</button>
          </section>

          <section className="toolbar" aria-label="Comparison controls">
            <div className="control"><small>PROJECT</small><button type="button">RC filter demo <ChevronDown size={14} /></button></div>
            <div className="control"><small>REVISION</small><button type="button">Run #001 <ChevronDown size={14} /></button></div>
            <div className="circuit-spec">
              <span><b>R1</b> 1 kΩ</span><i />
              <span><b>C1</b> 100 nF</span><i />
              <span><b>Board</b> 36 × 22 mm</span>
            </div>
          </section>

          <section className="comparison" aria-label="CAD comparison">
            {platforms.map((platform) => (
              <div className={`platform platform--${platform.accent}`} key={platform.name}>
                <header className="platform__header">
                  <div><span className="platform__dot" /><h2>{platform.name}</h2></div>
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
        </main>
      </div>
    </div>
  )
}
