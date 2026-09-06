import { useEffect, useRef, useState } from "react"

type SnapshotKind = "pcb" | "schematic"

export function TscircuitRunFrame({ defaultView, onViewChange, circuitJsonUrl, projectName }: {
  defaultView: SnapshotKind
  onViewChange: (view: SnapshotKind) => void
  circuitJsonUrl: string
  projectName: string
}) {
  const frame = useRef<HTMLIFrameElement>(null)
  const [source] = useState(() => {
    const params = new URLSearchParams({ circuit: circuitJsonUrl, project: projectName, view: defaultView })
    return `/runframe.html?${params}`
  })

  useEffect(() => {
    const receiveTabChange = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return
      if (event.data?.type !== "benchmark:runframe-tab") return
      if (event.data.tab === "pcb" || event.data.tab === "schematic") onViewChange(event.data.tab)
    }
    window.addEventListener("message", receiveTabChange)
    return () => window.removeEventListener("message", receiveTabChange)
  }, [onViewChange])

  return <iframe ref={frame} className="runframe-workspace" title="tscircuit RunFrame" src={source} allowFullScreen />
}
