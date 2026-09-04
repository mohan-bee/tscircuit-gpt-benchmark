#!/bin/sh
set -eu

repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
assets_dir="$repo_dir/public/assets"
work_dir="$repo_dir/work/snapshots"
kicad_cli=${KICAD_CLI:-/Applications/KiCad.app/Contents/MacOS/kicad-cli}

mkdir -p "$assets_dir" "$work_dir/kicad"

if [ ! -x "$kicad_cli" ]; then
  echo "kicad-cli not found at $kicad_cli" >&2
  exit 1
fi

"$kicad_cli" sch upgrade "$repo_dir/public/examples/kicad/rc-filter.kicad_sch" --force
"$kicad_cli" pcb upgrade "$repo_dir/public/examples/kicad/rc-filter.kicad_pcb" --force
"$kicad_cli" sch export svg \
  --output "$work_dir/kicad" \
  --black-and-white \
  --exclude-drawing-sheet \
  "$repo_dir/public/examples/kicad/rc-filter.kicad_sch"
"$kicad_cli" pcb render \
  --output "$assets_dir/kicad-pcb.png" \
  --width 1600 \
  --height 1000 \
  --side top \
  --background transparent \
  --quality high \
  --preset follow_pcb_editor \
  --zoom 1.1 \
  "$repo_dir/public/examples/kicad/rc-filter.kicad_pcb"
cp "$work_dir/kicad/rc-filter.svg" "$assets_dir/kicad-schematic.svg"

render_tscircuit() {
  view=$1
  output=$2
  node -e 'const fs=require("fs"); process.stdout.write(JSON.stringify({fs_map:{"index.circuit.tsx":fs.readFileSync(process.argv[1],"utf8")},main_component_path:"index.circuit.tsx"}))' \
    "$repo_dir/public/examples/tscircuit/index.circuit.tsx" \
    | curl -fsS "https://svg.tscircuit.com/?svg_type=$view" \
      -H 'Content-Type: application/json' \
      --data-binary @- \
      --output "$output"
}

render_tscircuit schematic "$assets_dir/tscircuit-schematic.svg"
render_tscircuit pcb "$assets_dir/tscircuit-pcb.svg"

echo "Snapshots generated with $($kicad_cli --version)."
