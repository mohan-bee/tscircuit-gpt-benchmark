import standaloneUrl from "@tscircuit/runframe/standalone-preview?url"
import type { CircuitJson } from "circuit-json"
import type { PreviewContentProps } from "@tscircuit/runframe"

declare global {
  interface Window {
    CIRCUIT_JSON?: CircuitJson
    CIRCUIT_JSON_PREVIEW_PROPS?: PreviewContentProps
  }
}

async function startRunFrame() {
  const params = new URLSearchParams(window.location.search)
  const circuitPath = params.get("circuit")
  const sourcePath = params.get("source")
  if (!circuitPath || !sourcePath) throw new Error("Missing benchmark files")
  const circuitUrl = new URL(circuitPath, window.location.origin)
  const sourceUrl = new URL(sourcePath, window.location.origin)
  if (circuitUrl.origin !== window.location.origin || sourceUrl.origin !== window.location.origin) {
    throw new Error("Benchmark files must be hosted on this site")
  }
  const [circuitResponse, sourceResponse] = await Promise.all([fetch(circuitUrl), fetch(sourceUrl)])
  if (!circuitResponse.ok || !sourceResponse.ok) throw new Error("Unable to load benchmark files")
  const circuitJson: CircuitJson = await circuitResponse.json()
  if (!Array.isArray(circuitJson)) throw new Error("Circuit JSON must be an array")
  const code = await sourceResponse.text()
  let defaultActiveTab: PreviewContentProps["defaultActiveTab"] = "pcb"
  if (params.get("view") === "schematic") defaultActiveTab = "schematic"
  window.CIRCUIT_JSON = circuitJson
  window.CIRCUIT_JSON_PREVIEW_PROPS = {
    circuitJson,
    code,
    projectName: params.get("project") || "benchmark",
    defaultActiveTab,
    availableTabs: ["pcb", "schematic", "cad", "code", "assembly", "pinout", "bom", "circuit_json", "errors"],
    showRightHeaderContent: true,
    showCodeTab: true,
    showJsonTab: true,
    showFileMenu: true,
    showToggleFullScreen: true,
    showImportAndFormatButtons: false,
    allowSelectingVersion: false,
    autoRotate3dViewerDisabled: true,
    readOnly: true,
    isWebEmbedded: true,
    onActiveTabChange: (tab) => window.parent.postMessage({ type: "benchmark:runframe-tab", tab }, window.location.origin),
  }
  const script = document.createElement("script")
  script.src = standaloneUrl
  script.onerror = () => showError(new Error("Unable to load RunFrame"))
  document.body.append(script)
}

function showError(error: unknown) {
  const status = document.getElementById("status")
  if (!status) return
  status.setAttribute("role", "alert")
  status.textContent = "Unable to display this benchmark. Reload to try again."
  console.error(error)
}

void startRunFrame().catch(showError)
