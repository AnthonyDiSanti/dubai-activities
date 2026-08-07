#!/usr/bin/env python3
"""Synchronize activity carousel lengths with downloaded manifest assets."""

from __future__ import annotations

import argparse
import csv
import re
from collections import defaultdict
from pathlib import Path


PHOTO_RE = re.compile(r"^(.+)-(\d{2})\.jpg$")


def photo_counts(manifest: Path) -> dict[str, int]:
    """Build counts only from usable rows and require gap-free numbered slots."""
    slots: dict[str, list[int]] = defaultdict(list)
    with manifest.open(newline="", encoding="utf-8-sig") as handle:
        for row in csv.DictReader(handle):
            if row["status"] not in {"downloaded", "added"}:
                continue
            match = PHOTO_RE.match(row["filename"])
            if match:
                slots[match.group(1)].append(int(match.group(2)))
    counts: dict[str, int] = {}
    for activity_id, values in slots.items():
        ordered = sorted(values)
        if ordered != list(range(1, len(ordered) + 1)):
            raise ValueError(f"{activity_id}: downloaded slots are not contiguous: {ordered}")
        counts[activity_id] = len(ordered)
    return counts


def synchronize(source: Path, counts: dict[str, int]) -> str:
    """Replace each one-line activity's photos field without disturbing other content."""
    updated: list[str] = []
    seen: set[str] = set()
    item_id = re.compile(r"\bid:'([^']+)'")
    photos = re.compile(r"\bphotos:\d+")
    for line in source.read_text(encoding="utf-8").splitlines(keepends=True):
        match = item_id.search(line)
        if not match:
            updated.append(line)
            continue
        activity_id = match.group(1)
        if activity_id not in counts:
            raise ValueError(f"{activity_id}: no downloaded hero photo")
        if not photos.search(line):
            raise ValueError(f"{activity_id}: missing photos field")
        # Activity records are intentionally one line, so a targeted substitution is safe.
        updated.append(photos.sub(f"photos:{counts[activity_id]}", line, count=1))
        seen.add(activity_id)
    missing = sorted(counts.keys() - seen)
    if missing:
        raise ValueError(f"manifest IDs absent from activities.js: {missing}")
    return "".join(updated)


def main() -> None:
    """Apply the synchronized counts after all integrity checks pass."""
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", type=Path, default=Path("image-manifest.csv"))
    parser.add_argument("--activities", type=Path, default=Path("src/activities.js"))
    args = parser.parse_args()
    content = synchronize(args.activities, photo_counts(args.manifest))
    args.activities.write_text(content, encoding="utf-8")
    print(f"Updated photo counts in {args.activities}")


if __name__ == "__main__":
    main()
