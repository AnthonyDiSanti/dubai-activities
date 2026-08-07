#!/usr/bin/env python3
"""Search Wikimedia Commons and build a labeled candidate contact sheet."""

from __future__ import annotations

import argparse
import io
import json
import subprocess
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


API = "https://commons.wikimedia.org/w/api.php"
USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) DubaiPhotoCurator/1.0"


def search(query: str, limit: int, category: bool = False) -> list[dict[str, object]]:
    """Return large raster search or category hits with stable provenance URLs."""
    params: dict[str, str] = {
        "action": "query",
        "prop": "imageinfo",
        "iiprop": "url|size|mime|extmetadata",
        "iiurlwidth": "1600",
        "format": "json",
        "formatversion": "2",
        "origin": "*",
    }
    # Category generation avoids search-rate limits and is ideal for venue collections.
    if category:
        params.update({
            "generator": "categorymembers",
            "gcmtitle": query if query.startswith("Category:") else f"Category:{query}",
            "gcmtype": "file",
            "gcmlimit": str(limit),
        })
    else:
        params.update({
            "generator": "search",
            "gsrsearch": query,
            "gsrnamespace": "6",
            "gsrlimit": str(limit),
        })
    request = urllib.request.Request(
        f"{API}?{urllib.parse.urlencode(params)}",
        headers={"User-Agent": USER_AGENT},
    )
    with urllib.request.urlopen(request, timeout=45) as response:
        payload = json.load(response)
    hits = []
    for page in payload.get("query", {}).get("pages", []):
        info = page.get("imageinfo", [{}])[0]
        if not info.get("mime", "").startswith("image/"):
            continue
        if max(info.get("width", 0), info.get("height", 0)) < 800:
            continue
        hits.append({"title": page["title"], **info})
    return hits


def make_sheet(hits: list[dict[str, object]], output: Path) -> None:
    """Download API thumbnails and tile them with index and source metadata."""
    tiles: list[Image.Image] = []
    kept: list[dict[str, object]] = []
    for hit in hits:
        try:
            # curl follows Wikimedia's thumbnail redirects more reliably than urllib.
            raw = subprocess.check_output([
                "curl", "-L", "--fail", "--retry", "2", "--max-time", "45",
                "-A", USER_AGENT, "-sS", str(hit.get("thumburl") or hit["url"]),
            ])
            with Image.open(io.BytesIO(raw)) as opened:
                image = ImageOps.exif_transpose(opened).convert("RGB")
                image.thumbnail((330, 220), Image.Resampling.LANCZOS)
            tile = Image.new("RGB", (350, 285), "white")
            tile.paste(image, ((350 - image.width) // 2, 5))
            label = (
                f"{len(kept) + 1}: {str(hit['title'])[5:48]}\n"
                f"{hit.get('width')}x{hit.get('height')}"
            )
            ImageDraw.Draw(tile).multiline_text(
                (8, 232), label, fill="black", font=ImageFont.load_default()
            )
            tiles.append(tile)
            kept.append(hit)
        except Exception as error:  # One bad Commons asset should not abort a search set.
            print(f"SKIP {hit.get('title')}: {error}")
    columns = 3
    rows = (len(tiles) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * 350, rows * 285), "#ddd")
    for index, tile in enumerate(tiles):
        sheet.paste(tile, ((index % columns) * 350, (index // columns) * 285))
    output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output, quality=90)
    print(f"Wrote {output} with {len(kept)} candidates")
    for index, hit in enumerate(kept, 1):
        metadata = hit.get("extmetadata", {})
        artist = metadata.get("Artist", {}).get("value", "") if isinstance(metadata, dict) else ""
        print(
            f"{index}\t{hit['title']}\t{hit.get('thumburl') or hit['url']}\t{hit['descriptionurl']}"
            f"\t{hit.get('width')}x{hit.get('height')}\t{artist}"
        )


def main() -> None:
    """Parse arguments and emit the visual review sheet plus source TSV."""
    parser = argparse.ArgumentParser()
    parser.add_argument("query")
    parser.add_argument("output", type=Path)
    parser.add_argument("--limit", type=int, default=30)
    parser.add_argument("--category", action="store_true")
    args = parser.parse_args()
    make_sheet(search(args.query, args.limit, args.category), args.output)


if __name__ == "__main__":
    main()
