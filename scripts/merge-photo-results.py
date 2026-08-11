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
FIELDS.insert(2, "disposition")

# Missing event imagery can become sourceable later; the rest is an editorial choice.
EVENT_DEFERRED_FILENAMES = {"atb-03.jpg", "oakenfold-03.jpg"}
REOPEN_DEFERRED_FILENAMES = {"ossiano-03.jpg", "ossiano-04.jpg"}
ACTIVE_GAP_FILENAMES: set[str] = set()


def load_csv(path: Path) -> list[dict[str, str]]:
    """Load either a sourcing fragment or canonical-schema addition fragment."""
    with path.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        if reader.fieldnames not in (FRAGMENT_FIELDS, FIELDS):
            raise ValueError(
                f"{path}: expected columns {FRAGMENT_FIELDS} or {FIELDS}, "
                f"got {reader.fieldnames}"
            )
        return list(reader)


def output_row(row: dict[str, str]) -> dict[str, str]:
    """Make explicit that fragment roles describe requests, not selected sources."""
    converted = dict(row)
    if "role" in converted:
        converted["requested_role"] = converted.pop("role")
        converted["disposition"] = disposition_for(converted)
    elif converted.get("disposition") != disposition_for(converted):
        raise ValueError(
            f"{converted.get('filename', 'unnamed row')}: disposition does not match status"
        )
    return converted


def disposition_for(row: dict[str, str]) -> str:
    """Classify unresolved requests without obscuring their factual source status."""
    if row["status"] in {"downloaded", "added"}:
        return "selected"
    filename = row["filename"]
    if filename in EVENT_DEFERRED_FILENAMES:
        return "defer_until_event"
    if filename in REOPEN_DEFERRED_FILENAMES:
        return "defer_until_reopen"
    if filename in ACTIVE_GAP_FILENAMES:
        return "active_gap"
    return "waived"


def brand_rows(path: Path) -> list[dict[str, str]]:
    """Translate the dedicated brand-mark manifest into canonical asset rows."""
    with path.open(newline="", encoding="utf-8-sig") as handle:
        rows = list(csv.DictReader(handle))
    return [
        {
            "filename": row["filename"],
            "status": row["status"],
            "disposition": "selected",
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
        # A completed manifest is reusable as the request baseline; additions are
        # supplied by fragments and brand marks by their dedicated manifest.
        original_rows = [
            row
            for row in csv.DictReader(handle)
            if row["chapter"] != "Brand marks" and row.get("status") != "added"
        ]

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


def append_new(original: Path, fragments: list[Path], brands: Path) -> list[dict[str, str]]:
    """Append complete galleries for activities absent from the canonical manifest."""
    with original.open(newline="", encoding="utf-8-sig") as handle:
        existing = [row for row in csv.DictReader(handle) if row["chapter"] != "Brand marks"]

    existing_filenames = {row["filename"] for row in existing}
    existing_activities = {row["activity"] for row in existing}
    additions: list[dict[str, str]] = []
    seen_filenames: set[str] = set()
    for fragment in fragments:
        for source_row in load_csv(fragment):
            row = output_row(source_row)
            filename = row["filename"]
            if filename in existing_filenames or filename in seen_filenames:
                raise ValueError(f"duplicate new filename: {filename}")
            if row["activity"] in existing_activities:
                raise ValueError(
                    f"{filename}: --append-new only accepts previously unknown activities"
                )
            if row["status"] == "not_found":
                raise ValueError(f"{filename}: a new gallery cannot contain not_found rows")
            additions.append(row)
            seen_filenames.add(filename)

    if not additions:
        raise ValueError("--append-new received no gallery rows")
    return [*existing, *additions, *brand_rows(brands)]


def main() -> None:
    """Parse paths and atomically replace the canonical manifest after a valid merge."""
    parser = argparse.ArgumentParser()
    parser.add_argument("fragments", nargs="+", type=Path)
    parser.add_argument("--original", type=Path, default=Path("docs/image-manifest.csv"))
    parser.add_argument("--brands", type=Path, default=Path("docs/brand-marks.csv"))
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument(
        "--append-new",
        action="store_true",
        help="preserve the canonical manifest and append galleries for new activities",
    )
    args = parser.parse_args()

    rows = (
        append_new(args.original, args.fragments, args.brands)
        if args.append_new
        else merge(args.original, args.fragments, args.brands)
    )
    temporary = args.output.with_suffix(args.output.suffix + ".tmp")
    with temporary.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDS, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)
    temporary.replace(args.output)
    print(f"Wrote {args.output} with {len(rows)} rows")


if __name__ == "__main__":
    main()
