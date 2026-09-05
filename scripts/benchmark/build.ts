import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"
import type { Definition } from "../../src/evaluation/schema"
import { command } from "./commands"
import { boardSchema, drcSchema, measure } from "./measure"
import { readJson, writeJson } from "./files"
export const kicadCli =
  process.env.KICAD_CLI || "/Applications/KiCad.app/Contents/MacOS/kicad-cli"
export const kicadPython =
  process.env.KICAD_PYTHON ||
  "/Applications/KiCad.app/Contents/Frameworks/Python.framework/Versions/Current/bin/python3"
export async function build({
  directory,
  platform,
  definition,
  repository,
}: {
  directory: string
  platform: "tscircuit" | "kicad"
  definition: Definition
  repository: string
}) {
  const log = join(directory, "build.log")
  const native = join(directory, "native")
  await mkdir(native)
  if (platform === "tscircuit") {
    await writeJson(join(directory, "package.json"), {
      private: true,
      type: "module",
    })
    const executable = join(repository, "node_modules/.bin/tsci")
    for (const check of ["netlist", "schematic-placement", "placement"]) {
      await command({
        executable,
        args: ["check", check, "index.circuit.tsx"],
        cwd: directory,
        log,
        allowViolations: true,
      })
    }
    await command({
      executable,
      args: [
        "build",
        "index.circuit.tsx",
        "--ignore-errors",
        "--ignore-config",
        "--disable-parts-engine",
        "--svgs",
        "--kicad-project",
      ],
      cwd: directory,
      log,
    })
    const generated = join(directory, "dist/index")
    for (const filename of ["circuit.json", "pcb.svg", "schematic.svg"])
      await copyFile(join(generated, filename), join(directory, filename))
    for (const extension of ["kicad_pcb", "kicad_sch"])
      await copyFile(
        join(generated, "kicad/index." + extension),
        join(native, "board." + extension),
      )
  } else {
    for (const extension of ["kicad_pcb", "kicad_sch"])
      await copyFile(
        join(directory, "board." + extension),
        join(native, "board." + extension),
      )
  }
  for (const kind of ["sch", "pcb"]) {
    let extension = "kicad_pcb"
    if (kind === "sch") extension = "kicad_sch"
    await command({
      executable: kicadCli,
      args: [kind, "upgrade", join(native, "board." + extension), "--force"],
      cwd: directory,
      log,
    })
  }
  // Benchmark-owned rules override generated project preferences and exclusions.
  await writeJson(join(native, "board.kicad_pro"), {
    board: {
      design_settings: {
        rules: { min_clearance: definition.requirements.clearanceMm },
        drc_exclusions: [],
      },
    },
  })
  await writeFile(
    join(native, "board.kicad_dru"),
    '(version 1)\n(rule "benchmark clearance" (constraint clearance (min ' +
      definition.requirements.clearanceMm +
      "mm)))\n",
  )
  await command({
    executable: kicadCli,
    args: [
      "pcb",
      "drc",
      "--format",
      "json",
      "--units",
      "mm",
      "--severity-all",
      "--all-track-errors",
      "--schematic-parity",
      "--refill-zones",
      "--save-board",
      "--output",
      join(directory, "drc.json"),
      join(native, "board.kicad_pcb"),
    ],
    cwd: directory,
    log,
  })
  await command({
    executable: kicadCli,
    args: [
      "pcb",
      "export",
      "svg",
      "--mode-single",
      "--layers",
      "F.Cu,B.Cu,F.SilkS,Edge.Cuts",
      "--page-size-mode",
      "2",
      "--exclude-drawing-sheet",
      "--output",
      join(directory, "validated-pcb.svg"),
      join(native, "board.kicad_pcb"),
    ],
    cwd: directory,
    log,
  })
  if (platform === "kicad") {
    await copyFile(
      join(directory, "validated-pcb.svg"),
      join(directory, "pcb.svg"),
    )
    const schematicDirectory = join(directory, "schematic")
    await mkdir(schematicDirectory)
    await command({
      executable: kicadCli,
      args: [
        "sch",
        "export",
        "svg",
        "--black-and-white",
        "--exclude-drawing-sheet",
        "--output",
        schematicDirectory,
        join(native, "board.kicad_sch"),
      ],
      cwd: directory,
      log,
    })
    await copyFile(
      join(schematicDirectory, "board.svg"),
      join(directory, "schematic.svg"),
    )
    await command({
      executable: kicadCli,
      args: [
        "pcb",
        "render",
        "--side",
        "top",
        "--quality",
        "high",
        "--width",
        "1200",
        "--height",
        "800",
        "--output",
        join(directory, "pcb.png"),
        join(native, "board.kicad_pcb"),
      ],
      cwd: directory,
      log,
    })
  }
  await command({
    executable: kicadPython,
    args: [
      join(repository, "scripts/benchmark/measure.py"),
      join(native, "board.kicad_pcb"),
      join(directory, "board.json"),
    ],
    cwd: directory,
    log,
  })
  const board = boardSchema.parse(await readJson(join(directory, "board.json")))
  const drc = drcSchema.parse(await readJson(join(directory, "drc.json")))
  const measurements = measure({ definition, board, drc })
  await writeJson(join(directory, "measurements.json"), measurements)
  if (!(await readFile(join(directory, "pcb.svg"), "utf8")).includes("<svg"))
    throw new Error("Renderer produced no SVG")
  return measurements
}
