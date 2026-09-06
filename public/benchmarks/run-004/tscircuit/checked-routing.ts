import routes from "./checked-routes.json"

/** Replay reviewed routes through tscircuit's documented custom-autorouter hook. */
export async function checkedRouting() {
  const listeners: Record<string, (event: any) => void> = {}
  return {
    on(name: string, callback: (event: any) => void) { listeners[name] = callback },
    start() { listeners.complete?.({ traces: structuredClone(routes) }) },
    stop() {},
  }
}
