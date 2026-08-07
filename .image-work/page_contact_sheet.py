#!/usr/bin/env python3
"""Extract public-page raster assets and build a labeled review contact sheet."""

from __future__ import annotations

import argparse
import html
import re
import subprocess
import tempfile
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

from PIL import Image, ImageDraw, ImageFont, ImageOps


USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) DubaiPhotoCurator/1.0"
RASTER = re.compile(r"\.(?:jpe?g|png|webp|avif)(?:[?#].*)?$", re.I)


def extract_urls(page: str, contains: str, limit: int) -> list[str]:
    """Extract unique absolute and relative raster URLs from HTML and embedded JSON."""
    result = subprocess.run(
        ["curl", "-L", "--fail", "--max-time", "60", "-A", USER_AGENT, "-sS", page],
        check=True,
        capture_output=True,
    )
    body = html.unescape(result.stdout.decode("utf-8", "replace"))
    body = (
        body.replace(r"\u002F", "/").replace(r"\u002f", "/")
        .replace(r"\u0026", "&").replace(r"\/", "/")
    )
    raw = re.findall(
        r"(?:https?:)?//[^\s\"'<>]+?\.(?:jpe?g|png|webp|avif)(?:\?[^\s\"'<>]+)?",
        body,
        re.I,
    )
    # Attribute parsing captures useful relative assets omitted by the absolute regex.
    raw.extend(
        match
        for match in re.findall(r"(?:src|href|content)=[\"']([^\"']+)[\"']", body, re.I)
        if RASTER.search(match)
    )
    urls: list[str] = []
    for candidate in raw:
        candidate = candidate.rstrip("\\")
        if candidate.startswith("//"):
            candidate = "https:" + candidate
        candidate = urljoin(page, candidate)
        decoded = unquote(candidate).lower()
        if contains and contains.lower() not in decoded:
            continue
        if any(term in decoded for term in ("favicon", "logo", "icon", "flag", "sprite", "payment")):
            continue
        if candidate not in urls:
            urls.append(candidate)
        if len(urls) >= limit:
            break
    return urls


def make_sheet(urls: list[str], output: Path) -> None:
    """Fetch candidates, reject small rasters, and tile survivors for visual review."""
    tiles: list[tuple[Image.Image, str, str, tuple[int, int]]] = []
    with tempfile.TemporaryDirectory() as directory:
        for candidate_index, url in enumerate(urls, 1):
            path = Path(directory) / f"{candidate_index}.source"
            result = subprocess.run(
                [
                    "curl", "-L", "--fail", "--retry", "1", "--max-time", "45",
                    "-A", USER_AGENT, "-sS", "-o", str(path), "-w", "%{url_effective}", url,
                ],
                capture_output=True,
                text=True,
            )
            if result.returncode:
                continue
            try:
                with Image.open(path) as opened:
                    size = opened.size
                    if max(size) < 800:
                        continue
                    image = ImageOps.exif_transpose(opened).convert("RGB")
                    image.thumbnail((330, 215), Image.Resampling.LANCZOS)
                tile = Image.new("RGB", (350, 275), "white")
                tile.paste(image, ((350 - image.width) // 2, 5))
                filename = unquote(Path(urlsplit(result.stdout or url).path).name)
                label = f"{len(tiles) + 1}: {filename[:43]}\n{size[0]}x{size[1]}"
                ImageDraw.Draw(tile).multiline_text(
                    (8, 225), label, fill="black", font=ImageFont.load_default()
                )
                tiles.append((tile, url, result.stdout or url, size))
            except Exception:
                continue
    if not tiles:
        print("No qualifying image candidates")
        return
    columns = 3
    rows = (len(tiles) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * 350, rows * 275), "#ddd")
    for position, (tile, _, _, _) in enumerate(tiles):
        sheet.paste(tile, ((position % columns) * 350, (position // columns) * 275))
    output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output, quality=90)
    print(f"Wrote {output} with {len(tiles)} candidates")
    for index, (_, requested, effective, size) in enumerate(tiles, 1):
        print(f"{index}\t{effective}\t{requested}\t{size[0]}x{size[1]}")


def main() -> None:
    """Parse arguments and produce an asset contact sheet plus URL index."""
    parser = argparse.ArgumentParser()
    parser.add_argument("page")
    parser.add_argument("output", type=Path)
    parser.add_argument("--contains", default="")
    parser.add_argument("--limit", type=int, default=50)
    args = parser.parse_args()
    make_sheet(extract_urls(args.page, args.contains, args.limit), args.output)


if __name__ == "__main__":
    main()
