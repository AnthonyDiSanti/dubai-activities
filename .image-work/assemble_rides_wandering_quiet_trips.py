#!/usr/bin/env python3
"""Download, normalize, and validate this agent's assigned activity subset."""

from __future__ import annotations

import csv
import hashlib
import json
import subprocess
import tempfile
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "docs/image-manifest.csv"
MAPPING = ROOT / ".image-work/rides_wandering_quiet_trips_sources.csv"
OUTPUT = ROOT / ".image-work/rides_wandering_quiet_trips.csv"
PHOTOS = ROOT / "public/photos"
CHAPTERS = {
    "Rides and slides",
    "Wandering and buying things",
    "Quiet and dark",
}
# Root is sourcing these final Quiet activities in a separate fragment.
EXCLUDED_ACTIVITIES = {
    "Al Qudra and the Love Lakes",
    "A boat at sunset",
    "Dubai Opera",
    "Kayak or paddleboard at sunrise",
    "A picnic somewhere with no lights",
}
FIELDS = [
    "filename", "status", "actual_url", "source_page", "request_url",
    "activity", "chapter", "slot", "role", "shot_wanted", "notes",
    "width", "height", "bytes",
]
COMMONS_API = "https://commons.wikimedia.org/w/api.php"


def resolve_source(
    choice: dict[str, str],
    prior: dict[str, str] | None = None,
    commons_batch: dict[str, tuple[str, str]] | None = None,
) -> tuple[str, str]:
    """Resolve a Commons title, reusing recorded provenance when available."""
    marker = "commons:"
    if not choice["actual_url"].startswith(marker):
        return choice["actual_url"], choice["source_page"]
    if prior and prior.get("actual_url") and prior.get("source_page"):
        # A prior output already records the exact resolved binary and Commons page.
        return prior["actual_url"], prior["source_page"]
    title = choice["actual_url"][len(marker):]
    if commons_batch and title in commons_batch:
        return commons_batch[title]
    params = {
        "action": "query", "titles": title, "prop": "imageinfo",
        # 1600 forces Wikimedia's stable thumbnail path for medium originals.
        "iiprop": "url|size", "iiurlwidth": "1600", "format": "json",
    }
    url = f"{COMMONS_API}?{urllib.parse.urlencode(params)}"
    request = urllib.request.Request(url, headers={"User-Agent": "DubaiPhotoCurator/1.0"})
    with urllib.request.urlopen(request, timeout=45) as response:
        payload = json.load(response)
    page = next(iter(payload["query"]["pages"].values()))
    info = page["imageinfo"][0]
    return info.get("thumburl") or info["url"], info["descriptionurl"]


def resolve_commons_batch(
    choices: list[dict[str, str]], previous: dict[str, dict[str, str]]
) -> dict[str, tuple[str, str]]:
    """Resolve all newly selected Commons titles in one rate-limit-friendly request."""
    titles = []
    for choice in choices:
        prior = previous.get(choice["filename"])
        if not choice["actual_url"].startswith("commons:"):
            continue
        if prior and prior.get("actual_url") and prior.get("source_page"):
            continue
        titles.append(choice["actual_url"][len("commons:"):])
    if not titles:
        return {}

    params = {
        "action": "query", "titles": "|".join(sorted(set(titles))),
        "prop": "imageinfo", "iiprop": "url|size", "iiurlwidth": "1600",
        "format": "json", "formatversion": "2",
    }
    url = f"{COMMONS_API}?{urllib.parse.urlencode(params)}"
    request = urllib.request.Request(url, headers={"User-Agent": "DubaiPhotoCurator/1.0"})
    with urllib.request.urlopen(request, timeout=60) as response:
        payload = json.load(response)
    resolved = {}
    for page in payload.get("query", {}).get("pages", []):
        info = page.get("imageinfo", [{}])[0]
        if info.get("url"):
            resolved[page["title"]] = (
                info.get("thumburl") or info["url"], info["descriptionurl"]
            )
    return resolved


def download_and_normalize(url: str, destination: Path) -> tuple[int, int, int]:
    """Fetch a real raster, enforce minimum size, and save a clean progressive JPEG."""
    with tempfile.NamedTemporaryFile(suffix=".source", delete=False) as handle:
        source = Path(handle.name)
    try:
        subprocess.run(
            [
                "curl", "-L", "--fail", "--retry", "2", "--max-time", "90",
                "-A", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
                "-sS", "-o", str(source), url,
            ],
            check=True,
        )
        with Image.open(source) as opened:
            image = ImageOps.exif_transpose(opened)
            image.load()
        if max(image.size) < 800:
            raise ValueError(f"image too small: {image.width}x{image.height}")

        # Preserve editorial composition while capping storage and stripping metadata.
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


def validate(rows: list[dict[str, str | int]], original_names: set[str]) -> None:
    """Assert complete manifest coverage and one-to-one provenance/file integrity."""
    names = [str(row["filename"]) for row in rows]
    urls = [str(row["actual_url"]) for row in rows if row["status"] in {"downloaded", "added"}]
    if len(names) != len(set(names)):
        raise ValueError("duplicate filenames in result rows")
    if len(urls) != len(set(urls)):
        raise ValueError("duplicate actual URLs in result rows")
    if not original_names.issubset(names):
        raise ValueError(f"missing original rows: {sorted(original_names - set(names))}")

    hashes: dict[str, str] = {}
    for row in rows:
        path = PHOTOS / str(row["filename"])
        if row["status"] == "not_found":
            if path.exists():
                raise ValueError(f"not_found row unexpectedly has a file: {path.name}")
            continue
        if not path.is_file():
            raise ValueError(f"downloaded row has no file: {path.name}")
        with Image.open(path) as image:
            image.verify()
            if image.format != "JPEG":
                raise ValueError(f"not a JPEG: {path.name}")
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        if digest in hashes:
            raise ValueError(f"duplicate image bytes: {path.name} and {hashes[digest]}")
        hashes[digest] = path.name


def main() -> None:
    """Join curated mappings to requested rows, download files, and write result CSV."""
    with MANIFEST.open(newline="", encoding="utf-8") as handle:
        requested = [
            row for row in csv.DictReader(handle)
            if row["chapter"] in CHAPTERS and row["activity"] not in EXCLUDED_ACTIVITIES
        ]
    with MAPPING.open(newline="", encoding="utf-8") as handle:
        mapped_rows = list(csv.DictReader(handle))
    mapped = {row["filename"]: row for row in mapped_rows}
    previous: dict[str, dict[str, str]] = {}
    if OUTPUT.exists():
        with OUTPUT.open(newline="", encoding="utf-8") as handle:
            previous = {row["filename"]: row for row in csv.DictReader(handle)}
    commons_batch = resolve_commons_batch(mapped_rows, previous)

    output_rows: list[dict[str, str | int]] = []
    for request_index, request in enumerate(requested):
        choice = mapped.get(request["filename"])
        status = choice["status"] if choice else "not_found"
        prior = previous.get(request["filename"])
        actual_url, source_page = (
            resolve_source(choice, prior, commons_batch) if choice else ("", "")
        )
        row: dict[str, str | int] = {
            "filename": request["filename"],
            "status": status,
            "actual_url": actual_url,
            "source_page": source_page,
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
            if destination.exists() and prior and prior["actual_url"] == row["actual_url"]:
                # Reuse a previously validated artifact when its exact binary URL is unchanged.
                with Image.open(destination) as image:
                    width, height = image.size
                byte_count = destination.stat().st_size
            else:
                width, height, byte_count = download_and_normalize(str(row["actual_url"]), destination)
            row.update(width=width, height=height, bytes=byte_count)
        else:
            destination.unlink(missing_ok=True)
        output_rows.append(row)

        # Additions remain adjacent to the original activity rows in final output.
        if request_index + 1 < len(requested) and requested[request_index + 1]["activity"] == request["activity"]:
            continue
        for added in [r for r in mapped_rows if r["status"] == "added" and r["activity"] == request["activity"]]:
            destination = PHOTOS / added["filename"]
            prior_added = previous.get(added["filename"])
            added_url, added_page = resolve_source(added, prior_added, commons_batch)
            if destination.exists() and prior_added and prior_added["actual_url"] == added_url:
                # Additions get the same deterministic cache behavior as requested rows.
                with Image.open(destination) as image:
                    width, height = image.size
                byte_count = destination.stat().st_size
            else:
                width, height, byte_count = download_and_normalize(added_url, destination)
            output_rows.append({
                "filename": added["filename"], "status": "added",
                "actual_url": added_url, "source_page": added_page,
                "request_url": "", "activity": added["activity"],
                "chapter": request["chapter"], "slot": added["slot"],
                "role": added["role"], "shot_wanted": added["shot_wanted"],
                "notes": added["notes"], "width": width, "height": height,
                "bytes": byte_count,
            })

    validate(output_rows, {row["filename"] for row in requested})
    with OUTPUT.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(output_rows)
    downloaded = sum(row["status"] == "downloaded" for row in output_rows)
    added = sum(row["status"] == "added" for row in output_rows)
    not_found = sum(row["status"] == "not_found" for row in output_rows)
    print(f"validated {len(output_rows)} rows: {downloaded} downloaded, {added} added, {not_found} not_found")


if __name__ == "__main__":
    main()
