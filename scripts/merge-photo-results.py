#!/usr/bin/env python3
"""Merge parallel photo-sourcing fragments into the canonical CSV manifest."""

from __future__ import annotations

import argparse
import csv
from collections import defaultdict
from pathlib import Path


FRAGMENT_FIELDS = [
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
FIELDS = ["requested_role" if field == "role" else field for field in FRAGMENT_FIELDS]


def load_csv(path: Path) -> list[dict[str, str]]:
    """Load one result fragment while enforcing the shared schema."""
    with path.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        if reader.fieldnames != FRAGMENT_FIELDS:
            raise ValueError(
                f"{path}: expected columns {FRAGMENT_FIELDS}, got {reader.fieldnames}"
            )
        return list(reader)


def output_row(row: dict[str, str]) -> dict[str, str]:
    """Make explicit that fragment roles describe requests, not selected sources."""
    converted = dict(row)
    converted["requested_role"] = converted.pop("role")
    return converted


def brand_rows(path: Path) -> list[dict[str, str]]:
    """Translate the dedicated brand-mark manifest into canonical asset rows."""
    with path.open(newline="", encoding="utf-8-sig") as handle:
        rows = list(csv.DictReader(handle))
    return [
        {
            "filename": row["filename"],
            "status": row["status"],
            "actual_url": row["actual_url"],
            "source_page": row["source_page"],
            "request_url": row["request_url"],
            "activity": "—",
            "chapter": "Brand marks",
            "slot": "—",
            "requested_role": "icon",
            "shot_wanted": row["what"],
            "notes": row["notes"],
            "width": "",
            "height": "",
            "bytes": row["bytes"],
        }
        for row in rows
    ]


def merge(original: Path, fragments: list[Path], brands: Path) -> list[dict[str, str]]:
    """Restore original ordering and place editorial additions after each activity."""
    with original.open(newline="", encoding="utf-8-sig") as handle:
        original_rows = [row for row in csv.DictReader(handle) if row["chapter"] != "Brand marks"]

    sourced: dict[str, dict[str, str]] = {}
    additions: dict[str, list[dict[str, str]]] = defaultdict(list)
    for fragment in fragments:
        for row in load_csv(fragment):
            row = output_row(row)
            if row["status"] == "added":
                additions[row["activity"]].append(row)
            elif row["filename"] in sourced:
                raise ValueError(f"duplicate original result: {row['filename']}")
            else:
                sourced[row["filename"]] = row

    expected = {row["filename"] for row in original_rows}
    missing = sorted(expected - sourced.keys())
    extra = sorted(sourced.keys() - expected)
    if missing or extra:
        raise ValueError(f"result coverage mismatch; missing={missing}, extra={extra}")

    merged: list[dict[str, str]] = []
    last_index: dict[str, int] = {}
    for index, row in enumerate(original_rows):
        last_index[row["activity"]] = index
    for index, request in enumerate(original_rows):
        merged.append(sourced[request["filename"]])
        if last_index[request["activity"]] == index:
            merged.extend(sorted(additions.pop(request["activity"], []), key=lambda row: int(row["slot"])))
    if additions:
        raise ValueError(f"additions reference unknown activities: {sorted(additions)}")
    merged.extend(brand_rows(brands))
    return merged


def main() -> None:
    """Parse paths and atomically replace the canonical manifest after a valid merge."""
    parser = argparse.ArgumentParser()
    parser.add_argument("fragments", nargs="+", type=Path)
    parser.add_argument("--original", type=Path, default=Path("image-manifest.csv"))
    parser.add_argument("--brands", type=Path, default=Path("brand-marks.csv"))
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    rows = merge(args.original, args.fragments, args.brands)
    temporary = args.output.with_suffix(args.output.suffix + ".tmp")
    with temporary.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)
    temporary.replace(args.output)
    print(f"Wrote {args.output} with {len(rows)} rows")


if __name__ == "__main__":
    main()
