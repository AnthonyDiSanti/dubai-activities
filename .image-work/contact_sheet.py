#!/usr/bin/env python3
"""Build a labeled contact sheet from image URLs embedded in a public page."""

from __future__ import annotations

import argparse
import html
import re
import subprocess
import tempfile
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

from PIL import Image, ImageDraw, ImageFont, ImageOps


def image_urls(page: str, contains: str, limit: int) -> list[str]:
    """Extract unique full-size raster URLs, preferring un-suffixed CDN originals."""
    body = subprocess.check_output([
        "curl", "-L", "--fail", "--max-time", "45", "-A", "Mozilla/5.0", page,
    ]).decode("utf-8", "replace")
    body = html.unescape(body).replace(r"\u0026", "&").replace(r"\/", "/")
    raw_candidates = re.findall(
        r'(?:(?:https?:)?//|(?:\.{0,2}/)?)[^\s"\'<>]*?\.(?:jpe?g|png|webp|avif)(?:\?[^\s"\'<>]+)?',
        body,
        flags=re.I,
    )
    # Resolve relative HTML and CSS asset references against the inspected page.
    candidates = [urljoin(page, candidate) for candidate in raw_candidates]
    selected: dict[str, str] = {}
    for url in candidates:
        if contains.lower() not in unquote(url).lower():
            continue
        url = re.sub(r"\?format=\d+w$", "", url)
        key = re.sub(r"-p-(?:500|800|1080|1600|2000|2600|3200)(?=\.(?:jpe?g|webp|avif))", "", url)
        key = key.split("?", 1)[0]
        # Later originals or larger query-driven renditions replace small variants.
        old = selected.get(key, "")
        old_width = int((re.search(r"[?&]w=(\d+)", old) or [None, "0"])[1])
        new_width = int((re.search(r"[?&]w=(\d+)", url) or [None, "0"])[1])
        if key not in selected or "-p-" not in url or new_width > old_width:
            selected[key] = url
    return list(selected.values())[:limit]


def make_sheet(urls: list[str], output: Path) -> None:
    """Fetch valid images and tile them with an index and source filename."""
    tiles: list[tuple[Image.Image, str]] = []
    with tempfile.TemporaryDirectory() as tmp:
        for index, url in enumerate(urls, 1):
            path = Path(tmp) / f"{index}.source"
            result = subprocess.run([
                "curl", "-L", "--fail", "--max-time", "45", "-A", "Mozilla/5.0",
                "-s", "-o", str(path), url,
            ])
            if result.returncode:
                continue
            try:
                with Image.open(path) as opened:
                    image = ImageOps.exif_transpose(opened).convert("RGB")
                    image.thumbnail((320, 220), Image.Resampling.LANCZOS)
                    tile = Image.new("RGB", (340, 270), "white")
                    tile.paste(image, ((340 - image.width) // 2, 5))
                    label = f"{index}: {unquote(Path(urlsplit(url).path).name)[:42]}\n{opened.width}x{opened.height}"
                    ImageDraw.Draw(tile).multiline_text((8, 230), label, fill="black", font=ImageFont.load_default())
                    tiles.append((tile, url))
            except Exception:
                continue
    columns = 3
    rows = (len(tiles) + columns - 1) // columns
    if not rows:
        raise RuntimeError(f"No downloadable raster candidates found for {output}")
    sheet = Image.new("RGB", (columns * 340, rows * 270), "#ddd")
    for position, (tile, _) in enumerate(tiles):
        sheet.paste(tile, ((position % columns) * 340, (position // columns) * 270))
    sheet.save(output, quality=90)
    print(f"Wrote {output} with {len(tiles)} candidates")
    for index, (_, url) in enumerate(tiles, 1):
        print(f"{index}\t{url}")


def main() -> None:
    """Parse CLI arguments and create the requested sheet."""
    parser = argparse.ArgumentParser()
    parser.add_argument("page")
    parser.add_argument("output", type=Path)
    parser.add_argument("--contains", default="")
    parser.add_argument("--limit", type=int, default=30)
    args = parser.parse_args()
    make_sheet(image_urls(args.page, args.contains, args.limit), args.output)


if __name__ == "__main__":
    main()
