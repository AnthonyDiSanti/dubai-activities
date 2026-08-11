#!/usr/bin/env python3
"""Download and document the five Long dinners activities curated by root."""

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
OUTPUT = ROOT / ".image-work" / "long_dinners_root.csv"
USER_AGENT = "Mozilla/5.0 DubaiPhotoCurator/1.0"
ACTIVITIES = {
    "Moonrise",
    "Ossiano",
    "L'Olivo at Al Mahara",
    "The Pods",
    "Secret supper clubs",
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
    """Keep the exact binary URL beside a readable provenance page."""
    return {"url": url, "source_page": page, "note": note}


SOURCES = {
    "moonrise-01.jpg": source(
        "https://cdn.squaremeal.ae/restaurants/624/images/dsc07163-2-web-1728x_27062022090402.jpg",
        "https://www.squaremeal.ae/restaurants/moonrise_624",
        "Exact editorial view of Moonrise's candlelit counter; selected as the hero because the current official site offers no usable photographic gallery.",
    ),
    "moonrise-02.jpg": source(
        "https://images.squarespace-cdn.com/content/v1/6260a0f4f2a1571c44b03c6e/15f7233a-608b-4335-a432-b9457391e6e0/IMG_4130.jpeg",
        "https://www.travelsforstars.com/blog/2025/05/26/moonrise-dubai",
        "Exact Moonrise open-kitchen and dining-counter view from a recent independent restaurant review.",
    ),
    "moonrise-03.jpg": source(
        "https://images.squarespace-cdn.com/content/v1/6260a0f4f2a1571c44b03c6e/1756795860048-0CEMUTFW6XKZ7LOKG2YE/IMG_4136.jpeg",
        "https://www.travelsforstars.com/blog/2025/05/26/moonrise-dubai",
        "Exact Moonrise course photographed during a recent independent visit; used as honest guest context when review-platform binaries were inaccessible.",
    ),
    "ossiano-01.jpg": source(
        "https://www.thenationalnews.com/resizer/v2/ELYFWMTVPFBGZI425A3JOSJY2E.jpg?auth=fc9720652f420cb64a2af3e0bda8d6e841a05f37b2deafc628f65ea71a8f4c37&focal=3530%2C2880&height=900&width=1600",
        "https://www.thenationalnews.com/lifestyle/food/2025/01/07/ossiano-atlantis-palm-50-best-restaurants-award/",
        "Exact wide Ossiano aquarium dining-room image credited to Atlantis The Palm by The National.",
    ),
    "ossiano-02.jpg": source(
        "https://ossiano.info/dish-1.webp",
        "https://ossiano.info/",
        "Exact plated-course close-up from Ossiano's official website.",
    ),
    "almahara-01.jpg": source(
        "https://cdn.jumeirah.com/api/public/content/64da55d94bf44e989aa60343878d43e8?v=c2d3f4ad",
        "https://www.jumeirah.com/en/stay/dubai/burj-al-arab-jumeirah/dining/burj-al-arab-al-mahara",
        "Exact official aquarium-window dining-room view at Al Mahara.",
    ),
    "almahara-02.jpg": source(
        "https://cdn.jumeirah.com/api/public/content/812c5c7ce6fe42418d7b6d8b37d8ad52?v=616cc447",
        "https://www.jumeirah.com/en/stay/dubai/burj-al-arab-jumeirah/dining/burj-al-arab-al-mahara",
        "Exact official candlelit table view with the aquarium behind it.",
    ),
    "almahara-03.jpg": source(
        "https://cdn.jumeirah.com/api/public/content/366ab5b8b53e4d90a52bb4ff2d48601a?v=99980f86",
        "https://www.jumeirah.com/en/stay/dubai/burj-al-arab-jumeirah/dining/burj-al-arab-al-mahara",
        "Exact official chef-plating action close-up, substituting for an inaccessible review-platform candid.",
    ),
    "thepods-01.jpg": source(
        "https://thepods.ae/wp-content/uploads/2026/04/5-2.jpg",
        "https://thepods.ae/menus/",
        "Exact official wide view inside a private dining pod on Bluewaters Island.",
    ),
    "thepods-02.jpg": source(
        "https://thepods.ae/wp-content/uploads/2026/04/1-2.jpg",
        "https://thepods.ae/menus/",
        "Exact official table-and-food view inside a pod, distinct from the empty-room hero.",
    ),
    "thepods-03.jpg": source(
        "https://thepods.ae/wp-content/uploads/2026/04/13.jpg",
        "https://thepods.ae/menus/",
        "Exact official overhead dinner scene with guests' hands in frame, used as candid activity context.",
    ),
    "supperclubs-01.jpg": source(
        "https://images.unsplash.com/photo-1778694277039-5cbf0b9a1fcf?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
        "https://unsplash.com/photos/people-enjoying-a-candlelit-dinner-at-a-dimly-lit-restaurant-UEjjO-aJtZ8",
        "Representative Unsplash category image of friends around a long candlelit dinner table; no single secret-club venue is implied.",
    ),
    "supperclubs-02.jpg": source(
        "https://images.unsplash.com/photo-1680079033073-860e3b9c2094?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
        "https://unsplash.com/photos/a-long-table-set-up-with-candles-and-flowers-XgYb1OXCDG8",
        "Representative Unsplash category image of a flower-and-candle-set communal table; no Dubai venue is implied.",
    ),
}

NOT_FOUND = {
    "moonrise-04.jpg": "No attributable, downloadable Moonrise social candid was found; the official site is illustration-led and the Instagram tag was inaccessible.",
    "ossiano-03.jpg": "No attributable, downloadable visitor candid meeting the 800px quality floor was found on the requested review sources.",
    "ossiano-04.jpg": "No distinct, attributable Ossiano social image meeting the quality floor was found; the requested Instagram tag was inaccessible.",
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
    """Load only the five Long dinners activities assigned to this workstream."""
    with ORIGINAL.open(newline="", encoding="utf-8-sig") as handle:
        return [row for row in csv.DictReader(handle) if row["activity"] in ACTIVITIES]


def assemble() -> list[dict[str, str]]:
    """Download selected sources and preserve unresolved requests explicitly."""
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
                        "notes": NOT_FOUND[filename],
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
    """Reject incomplete coverage, repeated sources, and duplicate image bytes."""
    expected = {row["filename"] for row in original_rows()}
    actual = {row["filename"] for row in rows}
    if expected != actual:
        raise ValueError(f"coverage mismatch: missing={expected - actual}, extra={actual - expected}")
    urls = [row["actual_url"] for row in rows if row["status"] == "downloaded"]
    if len(urls) != len(set(urls)):
        raise ValueError("duplicate actual URL in Long dinners root batch")
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
