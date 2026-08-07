#!/usr/bin/env python3
"""Download and normalize the nightlife/strange/dinners image assignment."""

from __future__ import annotations

import csv
import os
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "image-manifest.csv"
MAPPING = ROOT / ".image-work/nightlife_strange_dinners_sources.csv"
OUTPUT = ROOT / ".image-work/nightlife_strange_dinners.csv"
PHOTOS = ROOT / "src/photos"
CHAPTERS = {"Nights that go loud", "Genuinely strange", "Long dinners"}
# The root agent owns these dinner activities; exclude them to keep fragments disjoint.
RELEASED_ACTIVITIES = {
    "Moonrise", "Ossiano", "L'Olivo at Al Mahara", "The Pods", "Secret supper clubs",
    "Soho Garden, HIVE and CODE", "Ushuaïa Dubai Harbour", "Cavo and The Penthouse",
}
FIELDS = [
    "filename", "status", "actual_url", "source_page", "request_url",
    "activity", "chapter", "slot", "role", "shot_wanted", "notes",
    "width", "height", "bytes",
]


def download_and_normalize(url: str, destination: Path) -> tuple[int, int, int]:
    """Fetch with curl, validate pixels, then emit a metadata-free progressive JPEG."""
    with tempfile.NamedTemporaryFile(suffix=".source", delete=False) as handle:
        source = Path(handle.name)
    try:
        subprocess.run(
            ["curl", "-L", "--fail", "--max-time", "60", "-A", "Mozilla/5.0",
             "-o", str(source), url],
            check=True,
        )
        with Image.open(source) as opened:
            image = ImageOps.exif_transpose(opened)
            image.load()
        if max(image.size) < 800:
            raise ValueError(f"image too small: {image.width}x{image.height}")

        # Keep composition intact while capping storage and stripping source metadata.
        if max(image.size) > 2000:
            image.thumbnail((2000, 2000), Image.Resampling.LANCZOS)
        if image.mode in {"RGBA", "LA"}:
            background = Image.new("RGB", image.size, "white")
            background.paste(image, mask=image.getchannel("A"))
            image = background
        elif image.mode != "RGB":
            image = image.convert("RGB")
        destination.parent.mkdir(parents=True, exist_ok=True)
        image.save(destination, "JPEG", quality=85, optimize=True, progressive=True)
        return image.width, image.height, destination.stat().st_size
    finally:
        source.unlink(missing_ok=True)


def main() -> None:
    """Join editorial mappings to original requests and build photos plus result rows."""
    with MANIFEST.open(newline="") as handle:
        requested = [
            row for row in csv.DictReader(handle)
            if row["chapter"] in CHAPTERS and row["activity"] not in RELEASED_ACTIVITIES
        ]
    with MAPPING.open(newline="") as handle:
        mapped_rows = list(csv.DictReader(handle))
    mapped = {row["filename"]: row for row in mapped_rows}

    output_rows: list[dict[str, str | int]] = []
    for request in requested:
        choice = mapped.get(request["filename"])
        status = choice["status"] if choice else "not_found"
        row: dict[str, str | int] = {
            "filename": request["filename"],
            "status": status,
            "actual_url": choice["actual_url"] if choice else "",
            "source_page": choice["source_page"] if choice else "",
            "request_url": request["url"],
            "activity": request["activity"],
            "chapter": request["chapter"],
            "slot": request["slot"],
            "role": request["role"],
            "shot_wanted": request["shot_wanted"],
            "notes": choice["notes"] if choice else "No acceptable image mapped after source review.",
            "width": "", "height": "", "bytes": "",
        }
        destination = PHOTOS / request["filename"]
        if status == "downloaded":
            width, height, byte_count = download_and_normalize(str(row["actual_url"]), destination)
            row.update(width=width, height=height, bytes=byte_count)
        else:
            destination.unlink(missing_ok=True)
        output_rows.append(row)

    # Added rows are placed after their activity's originals by the final validator/merger.
    for choice in mapped_rows:
        if choice["status"] != "added":
            continue
        matching = next(row for row in requested if row["activity"] == choice["activity"])
        destination = PHOTOS / choice["filename"]
        width, height, byte_count = download_and_normalize(choice["actual_url"], destination)
        output_rows.append({
            "filename": choice["filename"], "status": "added",
            "actual_url": choice["actual_url"], "source_page": choice["source_page"],
            "request_url": "", "activity": choice["activity"],
            "chapter": matching["chapter"], "slot": choice["slot"],
            "role": choice["role"], "shot_wanted": choice["shot_wanted"],
            "notes": choice["notes"], "width": width, "height": height,
            "bytes": byte_count,
        })

    with OUTPUT.open("w", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(output_rows)


if __name__ == "__main__":
    main()
