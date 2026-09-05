import { createHash } from "node:crypto"
import { readFile, writeFile, readdir } from "node:fs/promises"
import { join } from "node:path"
export function hash(contents: string | Buffer) {
  return createHash("sha256").update(contents).digest("hex")
}
export async function readJson(path: string): Promise<unknown> {
  return JSON.parse(await readFile(path, "utf8"))
}
export async function writeJson(path: string, contents: unknown) {
  await writeFile(path, JSON.stringify(contents, null, 2) + "\n")
}
export async function listFiles(directory: string): Promise<string[]> {
  const files: string[] = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (
      entry.name === ".gitkeep" ||
      entry.name.endsWith(".kicad_prl") ||
      entry.name.endsWith(".lck")
    )
      continue
    const path = join(directory, entry.name)
    if (entry.isSymbolicLink())
      throw new Error("Symlink artifacts are not allowed")
    if (entry.isDirectory()) files.push(...(await listFiles(path)))
    else files.push(path)
  }
  return files.sort()
}
