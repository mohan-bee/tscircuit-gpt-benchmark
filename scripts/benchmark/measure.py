"""Native KiCad measurements. Run using KiCad's Python environment."""
import json
import sys
import pcbnew


def inspect_board(board_path):
    board = pcbnew.LoadBoard(board_path)
    if board is None or not board.GetFootprints():
        raise ValueError("Board is empty or cannot be loaded")
    bounds = board.GetBoardEdgesBoundingBox()
    pads = [{"reference": p.GetParentFootprint().GetReference(), "pin": p.GetNumber(),
             "net": p.GetNetCode(), "uuid": p.m_Uuid.AsString()} for p in board.GetPads()]
    items = {p["uuid"]: p["net"] for p in pads}
    for track in board.GetTracks():
        items[track.m_Uuid.AsString()] = track.GetNetCode()
    for zone in board.Zones():
        items[zone.m_Uuid.AsString()] = zone.GetNetCode()
    components = []
    for footprint in board.GetFootprints():
        box = footprint.GetBoundingBox(False, False)
        components.append({"reference": footprint.GetReference(), "value": footprint.GetValue(),
                           "side": footprint.GetLayer(),
                           "bounds": [pcbnew.ToMM(box.GetX()), pcbnew.ToMM(box.GetY()),
                                      pcbnew.ToMM(box.GetRight()), pcbnew.ToMM(box.GetBottom())]})
    return {"widthMm": pcbnew.ToMM(bounds.GetWidth()), "heightMm": pcbnew.ToMM(bounds.GetHeight()),
            "layers": board.GetCopperLayerCount(), "pads": pads, "itemNets": items,
            "components": components, "kicadVersion": pcbnew.Version()}


if __name__ == "__main__":
    with open(sys.argv[2], "w") as output:
        json.dump(inspect_board(sys.argv[1]), output, indent=2)
