#!/usr/bin/env python3
"""Validate downloaded Dubai photo assets against their provenance manifest."""

from __future__ import annotations

import argparse
import csv
import hashlib
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

from PIL import Image


VALID_STATUSES = {"downloaded", "added", "not_found"}
REQUIRED_COLUMNS = {
    "filename",
    "status",
    "actual_url",
    "source_page",
    "request_url",
    "activity",
    "chapter",
    "slot",
    "requested_role",
    "shot_wanted",
    "notes",
    "width",
    "height",
    "bytes",
}


def sha256(path: Path) -> str:
    """Hash final bytes so repeated images cannot hide behind different URLs."""
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def read_rows(path: Path) -> tuple[list[dict[str, str]], list[str]]:
    """Read the CSV and report schema errors before validating individual rows."""
    with path.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        fields = set(reader.fieldnames or [])
        missing = sorted(REQUIRED_COLUMNS - fields)
        errors = [f"missing required column: {name}" for name in missing]
        return list(reader), errors


def validate_jpeg(row: dict[str, str], path: Path) -> list[str]:
    """Verify format, dimensions, byte count, and the minimum useful resolution."""
    errors: list[str] = []
    try:
        with Image.open(path) as image:
            image.verify()
        with Image.open(path) as image:
            width, height = image.size
            if image.format != "JPEG":
                errors.append(f"{path.name}: expected JPEG, got {image.format}")
    except Exception as exc:  # A corrupt asset should not abort the full audit.
        return [f"{path.name}: cannot decode image ({exc})"]

    if max(width, height) < 800:
        errors.append(f"{path.name}: long edge {max(width, height)}px is below 800px")
    expected = (row.get("width"), row.get("height"), row.get("bytes"))
    actual = (str(width), str(height), str(path.stat().st_size))
    if expected != actual:
        errors.append(f"{path.name}: manifest metadata {expected} != file metadata {actual}")
    return errors


def validate_rows(rows: list[dict[str, str]], photos: Path) -> list[str]:
    """Check provenance, file presence, uniqueness, and contiguous activity slots."""
    errors: list[str] = []
    filenames: Counter[str] = Counter()
    urls: Counter[str] = Counter()
    hashes: dict[str, list[str]] = defaultdict(list)
    activity_slots: dict[str, list[int]] = defaultdict(list)
    activity_assets: dict[str, list[dict[str, str]]] = defaultdict(list)
    expected_files: set[str] = set()

    for line, row in enumerate(rows, 2):
        filename = row.get("filename", "").strip()
        status = row.get("status", "").strip()
        prefix = f"row {line} ({filename or row.get('activity', 'unnamed')})"
        if status not in VALID_STATUSES:
            errors.append(f"{prefix}: invalid status {status!r}")
            continue
        if filename:
            filenames[filename] += 1
        if status == "not_found":
            if row.get("actual_url", "").strip():
                errors.append(f"{prefix}: not_found row has an actual_url")
            if filename and (photos / filename).exists():
                errors.append(f"{prefix}: not_found row unexpectedly has a local file")
            if not row.get("notes", "").strip():
                errors.append(f"{prefix}: not_found row needs an explanatory note")
            continue

        url = row.get("actual_url", "").strip()
        if not filename or not url:
            errors.append(f"{prefix}: downloaded/added row needs filename and actual_url")
            continue
        if not re.match(r"^https?://", url):
            errors.append(f"{prefix}: actual_url must be an HTTP(S) URL")
        source_page = row.get("source_page", "").strip()
        if not re.match(r"^https?://", source_page):
            errors.append(f"{prefix}: downloaded/added row needs an HTTP(S) source_page")
        urls[url] += 1
        path = photos / filename
        expected_files.add(filename)
        if not path.is_file():
            errors.append(f"{prefix}: missing local file {path}")
            continue
        if filename.lower().endswith(".jpg"):
            errors.extend(validate_jpeg(row, path))
            match = re.match(r"^(.+)-(\d{2})\.jpg$", filename)
            if match:
                activity_slots[match.group(1)].append(int(match.group(2)))
                activity_assets[row.get("activity", "")].append(row)
        elif filename.lower().endswith(".svg"):
            text = path.read_text(encoding="utf-8", errors="replace")[:2048].lower()
            if "<svg" not in text:
                errors.append(f"{prefix}: SVG file has no <svg root")
            if row.get("bytes", "") != str(path.stat().st_size):
                errors.append(f"{prefix}: SVG byte count does not match manifest")
        else:
            errors.append(f"{prefix}: unsupported asset extension")
        hashes[sha256(path)].append(filename)

    for filename, count in filenames.items():
        if count > 1:
            errors.append(f"duplicate manifest filename: {filename} ({count} rows)")
    for url, count in urls.items():
        if count > 1:
            errors.append(f"duplicate actual_url: {url} ({count} rows)")
    for digest, names in hashes.items():
        if len(names) > 1:
            errors.append(f"duplicate image bytes {digest[:12]}: {', '.join(sorted(names))}")
    for activity_id, slots in activity_slots.items():
        ordered = sorted(slots)
        if ordered != list(range(1, len(ordered) + 1)):
            errors.append(f"{activity_id}: non-contiguous downloaded slots {ordered}")

    # A photography-forward carousel needs a hero plus at least one distinct follow-up.
    photo_activities = {
        row.get("activity", "")
        for row in rows
        if row.get("chapter") != "Brand marks" and row.get("filename", "").endswith(".jpg")
    }
    for activity in sorted(photo_activities):
        assets = activity_assets.get(activity, [])
        slots = {int(row["slot"]) for row in assets if row.get("slot", "").isdigit()}
        if 1 not in slots:
            errors.append(f"{activity}: no downloaded hero in slot 1")
        if len(assets) < 2:
            errors.append(f"{activity}: needs at least two downloaded photos, found {len(assets)}")

    disk_files = {p.name for p in photos.iterdir() if p.is_file() and not p.name.startswith(".")}
    for extra in sorted(disk_files - expected_files):
        errors.append(f"unmanifested local asset: {extra}")
    for missing in sorted(expected_files - disk_files):
        errors.append(f"manifested asset absent from disk: {missing}")
    return errors


def main() -> int:
    """Run the audit and return a shell-friendly status code."""
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", type=Path, default=Path("image-manifest.csv"))
    parser.add_argument("--photos", type=Path, default=Path("src/photos"))
    args = parser.parse_args()

    rows, errors = read_rows(args.manifest)
    if not errors:
        errors.extend(validate_rows(rows, args.photos))
    if errors:
        print("Photo manifest audit failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    totals = Counter(row["status"] for row in rows)
    print(f"Photo manifest audit passed: {len(rows)} rows; {dict(totals)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
