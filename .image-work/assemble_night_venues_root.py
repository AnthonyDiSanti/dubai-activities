#!/usr/bin/env python3
"""Download and document the three nightlife venues curated by root."""

from __future__ import annotations

import csv
import hashlib
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
ORIGINAL = ROOT / "docs/image-manifest.csv"
PHOTOS = ROOT / "public" / "photos"
OUTPUT = ROOT / ".image-work" / "night_venues_root.csv"
USER_AGENT = "Mozilla/5.0 DubaiPhotoCurator/1.0"
ACTIVITIES = {
    "Soho Garden, HIVE and CODE",
    "Ushuaïa Dubai Harbour",
    "Cavo and The Penthouse",
}
FIELDS = [
    "filename",
    "status",
    "actual_url",
    "source_page",
    "request_url",
    "activity",
    "chapter",
    "slot",
    "role",
    "shot_wanted",
    "notes",
    "width",
    "height",
    "bytes",
]


def source(url: str, page: str, note: str) -> dict[str, str]:
    """Keep an exact downloadable binary beside readable provenance."""
    return {"url": url, "source_page": page, "note": note}


SOURCES = {
    "sohogarden-01.jpg": source(
        "https://sohogardendxb.com/wp-content/uploads/2024/01/DSC01773.webp",
        "https://sohogardendxb.com/discover-dubai/new-soho-garden/",
        "Exact official establishing view of the packed New Soho Garden terrace at night, with guests, lush walls, and the venue's circular lighting overhead.",
    ),
    "sohogarden-02.jpg": source(
        "https://sohogardendxb.com/wp-content/uploads/2024/01/DSC00412.webp",
        "https://sohogardendxb.com/discover-dubai/hive/",
        "Exact official HIVE mega-club view with a dense crowd, amber beams, and the hive-inspired hanging sculpture.",
    ),
    "sohogarden-03.jpg": source(
        "https://sohogardendxb.com/wp-content/uploads/2024/01/CODE-VPS-25.webp",
        "https://sohogardendxb.com/discover-dubai/code/",
        "Exact official crowd-level view inside CODE DXB beneath its blue geometric LED ceiling; this people-filled frame satisfies the requested candid context.",
    ),
    "ushuaia-01.jpg": source(
        "https://image.mux.com/oSGZbft6UYFSGyQ1t9fqUjE1EqLgLbi1KNaaXzRDQOw/thumbnail.jpg?time=12&width=2000",
        "https://www.ushuaiadubai.com/",
        "Exact frame from the current official homepage hero video, showing the Ushuaïa stage, crowd, and pyrotechnics in a crop-safe wide composition.",
    ),
    "ushuaia-02.jpg": source(
        "https://image.mux.com/oSGZbft6UYFSGyQ1t9fqUjE1EqLgLbi1KNaaXzRDQOw/thumbnail.jpg?time=20&width=2000",
        "https://www.ushuaiadubai.com/",
        "Exact distinct frame from the current official homepage hero video, showing the venue-wide crowd beneath the Ushuaïa emblem.",
    ),
    "ushuaia-03.jpg": source(
        "https://image.mux.com/oSGZbft6UYFSGyQ1t9fqUjE1EqLgLbi1KNaaXzRDQOw/thumbnail.jpg?time=5&width=2000",
        "https://www.ushuaiadubai.com/",
        "Exact candid crowd frame from the current official homepage hero video; selected as honest people-in-the-room context.",
    ),
    "rooftops-01.jpg": source(
        "https://cdn.prod.website-files.com/6710f615b852284eb2c54a89/6908475b6f598345e6a28aba_DSC09380-HDR-Edit%20(4).avif",
        "https://www.thepenthouse.co/dubai/gallery",
        "Exact official wide night view of The Penthouse's red terrace and Dubai Marina skyline.",
    ),
    "rooftops-02.jpg": source(
        "https://rameehospitality.com/images/ramee-hospitality-cavo-dubai-01.webp",
        "https://rameehotels.com/ramee-dream-dubai/dining/cavo/",
        "Exact official daylight view of Cavo's plant-filled restaurant and lounge, included so the combined activity represents both venues.",
    ),
    "rooftops-03.jpg": source(
        "https://cdn.prod.website-files.com/6710f615b852284eb2c54a89%2F671a365c0a6baa3a74214d13_penthouse%20%282%29-poster-00001.jpg",
        "https://www.thepenthouse.co/dubai/gallery",
        "Exact official party still from The Penthouse's gallery video, with guests and stage effects in frame.",
    ),
}

def fetch(url: str, destination: Path) -> str:
    """Download one binary with retries and report its final effective URL."""
    command = [
        "curl",
        "-L",
        "--fail",
        "--retry",
        "5",
        "--retry-all-errors",
        "--retry-delay",
        "2",
        "--max-time",
        "120",
        "-A",
        USER_AGENT,
        "-sS",
        "-o",
        str(destination),
        "-w",
        "%{url_effective}",
        url,
    ]
    return subprocess.check_output(command, text=True).strip()


def normalize(source_path: Path, destination: Path) -> tuple[int, int, int]:
    """Create a web-ready JPEG without upscaling or embedded metadata."""
    with Image.open(source_path) as opened:
        image = ImageOps.exif_transpose(opened)
        if image.mode in {"RGBA", "LA"}:
            background = Image.new("RGB", image.size, "white")
            background.paste(image, mask=image.getchannel("A"))
            image = background
        else:
            image = image.convert("RGB")
        if max(image.size) < 800:
            raise ValueError(f"source long edge is only {max(image.size)}px")
        image.thumbnail((2000, 2000), Image.Resampling.LANCZOS)
        image.save(destination, "JPEG", quality=85, optimize=True, progressive=True)
    with Image.open(destination) as final:
        width, height = final.size
    return width, height, destination.stat().st_size


def original_rows() -> list[dict[str, str]]:
    """Load only the three reclaimed nightlife activities."""
    with ORIGINAL.open(newline="", encoding="utf-8-sig") as handle:
        return [row for row in csv.DictReader(handle) if row["activity"] in ACTIVITIES]


def assemble() -> list[dict[str, str]]:
    """Download selections while preserving the one unresolved request."""
    PHOTOS.mkdir(parents=True, exist_ok=True)
    results: list[dict[str, str]] = []
    with tempfile.TemporaryDirectory() as temporary:
        for request in original_rows():
            filename = request["filename"]
            selected = SOURCES.get(filename)
            base = {
                "filename": filename,
                "request_url": request.get("request_url") or request["url"],
                "activity": request["activity"],
                "chapter": request["chapter"],
                "slot": request["slot"],
                "role": request.get("role") or request["requested_role"],
                "shot_wanted": request["shot_wanted"],
            }
            if selected is None:
                results.append(
                    {
                        **base,
                        "status": "not_found",
                        "actual_url": "",
                        "source_page": "",
                        "notes": "No attributable image meeting the request and quality floor was found.",
                        "width": "",
                        "height": "",
                        "bytes": "",
                    }
                )
                continue

            raw = Path(temporary) / f"{filename}.source"
            actual_url = fetch(selected["url"], raw)
            width, height, size = normalize(raw, PHOTOS / filename)
            results.append(
                {
                    **base,
                    "status": "downloaded",
                    "actual_url": actual_url,
                    "source_page": selected["source_page"],
                    "notes": selected["note"],
                    "width": str(width),
                    "height": str(height),
                    "bytes": str(size),
                }
            )
            print(f"{filename}: {width}x{height}, {size} bytes")
    return results


def validate(rows: list[dict[str, str]]) -> None:
    """Reject missing coverage, repeated sources, and duplicate image bytes."""
    expected = {row["filename"] for row in original_rows()}
    actual = {row["filename"] for row in rows}
    if expected != actual:
        raise ValueError(f"coverage mismatch: missing={expected - actual}, extra={actual - expected}")
    urls = [row["actual_url"] for row in rows if row["status"] == "downloaded"]
    if len(urls) != len(set(urls)):
        raise ValueError("duplicate actual URL in root nightlife batch")
    digests: dict[str, str] = {}
    for row in rows:
        if row["status"] != "downloaded":
            continue
        path = PHOTOS / row["filename"]
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        if digest in digests:
            raise ValueError(f"duplicate bytes: {row['filename']} and {digests[digest]}")
        digests[digest] = row["filename"]


def main() -> None:
    """Assemble, validate, and atomically write the result fragment."""
    rows = assemble()
    validate(rows)
    temporary = OUTPUT.with_suffix(".csv.tmp")
    with temporary.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)
    temporary.replace(OUTPUT)
    print(f"Wrote {OUTPUT} with {len(rows)} rows")


if __name__ == "__main__":
    main()
