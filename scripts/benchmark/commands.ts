import { spawn } from "node:child_process"
import { appendFile, mkdir } from "node:fs/promises"
import { join } from "node:path"
export async function command({
  executable,
  args,
  cwd,
  log,
  allowViolations = false,
}: {
  executable: string
  args: string[]
  cwd: string
  log: string
  allowViolations?: boolean
}) {
  const timeoutMs = 120_000
  const outputLimit = 8_000_000
  const environment: NodeJS.ProcessEnv = {}
  for (const name of [
    "PATH",
    "HOME",
    "TMPDIR",
    "SYSTEMROOT",
    "DISPLAY",
    "XAUTHORITY",
  ]) {
    if (process.env[name]) environment[name] = process.env[name]
  }
  environment.KICAD_CONFIG_HOME = join(cwd, ".kicad-config")
  await mkdir(environment.KICAD_CONFIG_HOME, { recursive: true })
  const result = await new Promise<{ code: number | null; output: string }>(
    (resolve, reject) => {
      const child = spawn(executable, args, {
        cwd,
        env: environment,
        stdio: ["ignore", "pipe", "pipe"],
        detached: process.platform !== "win32",
      })
      let output = ""
      let expired = false
      const timer = setTimeout(() => {
        expired = true
        if (child.pid && process.platform !== "win32")
          process.kill(-child.pid, "SIGKILL")
        else child.kill("SIGKILL")
      }, timeoutMs)
      for (const stream of [child.stdout, child.stderr])
        stream.on("data", (chunk: Buffer) => {
          if (output.length < outputLimit) output += chunk.toString()
        })
      child.on("error", (error) => {
        clearTimeout(timer)
        reject(error)
      })
      child.on("close", (code) => {
        clearTimeout(timer)
        if (expired) output += "\nCommand timed out"
        resolve({ code, output })
      })
    },
  )
  await appendFile(
    log,
    JSON.stringify({ executable, args, code: result.code }) +
      "\n" +
      result.output +
      "\n",
  )
  if (result.code !== 0 && !(allowViolations && result.code === 1))
    throw new Error(
      "Command failed; see build.log: " + executable + " " + args[0],
    )
  return result.output.trim()
}
