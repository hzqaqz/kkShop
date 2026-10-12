#!/usr/bin/env python3
"""Turn a string into SVG outline paths using the real Meower font.

Why this exists: sharp renders SVG through librsvg, which resolves fonts via
fontconfig. Passing font-family="Google Sans Flex" silently falls back to a
system font (verified: the output is byte-identical to a bogus family name).
So we hand librsvg the glyph outlines instead of a font name.

Reads a JSON array of text blocks on stdin, writes
{"svg": "<svg .../>", "measured": [...]} on stdout.

Block fields: text, size, weight, fill, x, baseline, letterSpacing (optional).

Requires: pip install fonttools   (the variable font itself is passed in)
"""
import json
import os
import sys

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

SOURCE_TTF = os.environ.get("FONT_TTF")
if not SOURCE_TTF or not os.path.exists(SOURCE_TTF):
    sys.exit("FONT_TTF 未设置或文件不存在")

_cached = {}


def font_at(weight):
    """Instantiate the variable font at a fixed weight so the outline we read
    is exactly the one the browser would render for that weight."""
    if weight not in _cached:
        f = TTFont(SOURCE_TTF)
        _cached[weight] = instantiateVariableFont(
            f,
            {"wght": weight, "wdth": 100, "opsz": 18, "GRAD": 0, "ROND": 0, "slnt": 0},
            inplace=False,
        )
    return _cached[weight]


def text_paths(text, size, weight, x, baseline, letter_spacing=0.0):
    font = font_at(weight)
    scale = size / font["head"].unitsPerEm
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]
    glyphs = font.getGlyphSet()

    parts = []
    cursor_px = float(x)  # pen position in OUTPUT pixels
    for ch in text:
        name = cmap.get(ord(ch))
        if name is None:
            raise SystemExit(f"字符 {ch!r} 不在字体中，请扩充字符集")
        pen = SVGPathPen(glyphs)
        glyphs[name].draw(pen)
        d = pen.getCommands()
        if d:
            # Font space is Y-up, SVG is Y-down, hence the negative Y scale.
            parts.append(
                f'<g transform="translate({cursor_px:.2f} {baseline:.2f}) '
                f'scale({scale:.6f} {-scale:.6f})"><path d="{d}"/></g>'
            )
        cursor_px += hmtx[name][0] * scale + letter_spacing
    return "".join(parts), cursor_px - float(x)


def ink_box(text, weight, size):
    """Ink bounding box of `text` at `size`, in output px, relative to the pen
    origin on the baseline. Y grows downward (SVG space), so inkTop is negative."""
    font = font_at(weight)
    upm = font["head"].unitsPerEm
    scale = size / upm
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]
    glyf = font["glyf"]

    cursor = 0.0
    left = top = float("inf")
    right = bottom = float("-inf")
    for ch in text:
        name = cmap.get(ord(ch))
        if name is None:
            raise SystemExit(f"字符 {ch!r} 不在字体中，请扩充字符集")
        g = glyf[name]
        if g.numberOfContours != 0:  # skip spaces
            left = min(left, cursor + g.xMin * scale)
            right = max(right, cursor + g.xMax * scale)
            top = min(top, -g.yMax * scale)
            bottom = max(bottom, -g.yMin * scale)
        cursor += hmtx[name][0] * scale
    if left == float("inf"):
        raise SystemExit(f"{text!r} 没有任何可见墨迹")
    return {"left": left, "right": right, "top": top, "bottom": bottom,
            "width": right - left, "height": bottom - top}


def resolve_placement(block, canvas):
    """Work out size + x + baseline. Two conveniences on top of explicit values:
    `inkHeight` derives the font size from a target cap height, and `center`
    optically centres the ink box (not the advance width) in the canvas."""
    text, weight = block["text"], block["weight"]
    canvas_w, canvas_h = canvas

    size = block.get("size")
    if size is None:
        target = block["inkHeight"]
        probe = ink_box(text, weight, 1000.0)
        size = 1000.0 * target / probe["height"]

    box = ink_box(text, weight, size)
    x = block.get("x")
    baseline = block.get("baseline")
    if block.get("center"):
        x = canvas_w / 2 - box["width"] / 2 - box["left"]
        baseline = canvas_h / 2 - box["top"] - box["height"] / 2
    if x is None or baseline is None:
        raise SystemExit("每个文字块都需要 x/baseline，或设置 center: true")
    return size, x, baseline


def main():
    spec = json.load(sys.stdin)
    # Accept both a bare array (OG card) and {"width","height","blocks"} (icons).
    if isinstance(spec, dict):
        canvas = (spec.get("width", 1200), spec.get("height", 630))
        blocks = spec["blocks"]
    else:
        canvas = (1200, 630)
        blocks = spec

    body = []
    measured = []
    for block in blocks:
        size, x, baseline = resolve_placement(block, canvas)
        markup, width = text_paths(
            block["text"], size, block["weight"], x, baseline,
            block.get("letterSpacing", 0.0),
        )
        body.append(f'<g fill="{block["fill"]}">{markup}</g>')
        measured.append(
            {"text": block["text"], "size": round(size, 2), "weight": block["weight"],
             "x": round(x, 2), "baseline": round(baseline, 2), "widthPx": round(width, 1)}
        )
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{canvas[0]}" '
           f'height="{canvas[1]}">' + "".join(body) + "</svg>")
    json.dump({"svg": svg, "measured": measured}, sys.stdout)


if __name__ == "__main__":
    main()
