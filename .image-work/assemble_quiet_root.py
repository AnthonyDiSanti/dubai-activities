#!/usr/bin/env python3
"""Download and document the five Quiet and dark activities curated by root."""

from __future__ import annotations

import csv
import hashlib
import json
import subprocess
import tempfile
import time
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
ORIGINAL = ROOT / "docs/image-manifest.csv"
PHOTOS = ROOT / "public" / "photos"
OUTPUT = ROOT / ".image-work" / "quiet_root.csv"
USER_AGENT = "Mozilla/5.0 DubaiPhotoCurator/1.0"
ACTIVITIES = {
    "Al Qudra and the Love Lakes",
    "A boat at sunset",
    "Dubai Opera",
    "Kayak or paddleboard at sunrise",
    "A picnic somewhere with no lights",
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


def direct(url: str, page: str, note: str) -> dict[str, str]:
    """Describe a direct binary alongside its human-readable provenance page."""
    return {"kind": "direct", "ref": url, "source_page": page, "note": note}


def commons(title: str, note: str) -> dict[str, str]:
    """Describe a Commons file that will be resolved through the media API."""
    return {"kind": "commons", "ref": title, "source_page": "", "note": note}


SOURCES = {
    "lovelakes-01.jpg": commons(
        "LOVE LAKE DUBAI.jpg",
        "Exact wide sunset view across Love Lake; Commons creator and reuse terms are on the source page.",
    ),
    "lovelakes-02.jpg": commons(
        "Love lakes DDE351EC-AC8A-42CE-A595-2EE2B5DFC103.jpg",
        "Exact reflective sculpture and lakeside view at Love Lake, compositionally distinct from the sunset hero.",
    ),
    "lovelakes-03.jpg": commons(
        "Love lake honeymoon !.jpg",
        "Exact candid couple portrait at Love Lake; used as honest visitor context in place of an inaccessible review-platform binary.",
    ),
    "yacht-01.jpg": direct(
        "https://file.skywalker.ae/yachts/2025/11/17/20251117133926A387.webp",
        "https://www.skywalker.ae/news/best-sunset-yacht-rental-dubai-palm-jumeirah-prices-routes-booking-tips-2025/",
        "Exact current Dubai charter-operator view of a yacht crossing pink sunset water.",
    ),
    "yacht-02.jpg": direct(
        "https://file.skywalker.ae/yachts/2025/11/17/20251117133712A383.webp",
        "https://www.skywalker.ae/news/best-sunset-yacht-rental-dubai-palm-jumeirah-prices-routes-booking-tips-2025/",
        "Exact current operator view of a yacht with Burj Al Arab in the sunset background.",
    ),
    "yacht-03.jpg": direct(
        "https://file.skywalker.ae/yachts/2025/11/17/20251117133641A382.webp",
        "https://www.skywalker.ae/news/best-sunset-yacht-rental-dubai-palm-jumeirah-prices-routes-booking-tips-2025/",
        "Exact current operator aerial of a yacht tracing Palm Jumeirah toward Atlantis, selected as route context when no clean candid was available.",
    ),
    "yacht-04.jpg": direct(
        "https://file.skywalker.ae/yachts/2025/11/17/20251117133741A384.webp",
        "https://www.skywalker.ae/news/best-sunset-yacht-rental-dubai-palm-jumeirah-prices-routes-booking-tips-2025/",
        "Exact current operator view of a yacht against the Dubai Marina skyline at golden hour.",
    ),
    "opera-01.jpg": direct(
        "https://images.pexels.com/photos/35665799/pexels-photo-35665799.jpeg?cs=srgb&dl=pexels-dawidtkocz-35665799.jpg&fm=jpg",
        "https://www.pexels.com/photo/dubai-opera-at-night-with-modern-architecture-35665799/",
        "Exact free-stock night exterior of Dubai Opera; used because the current official site's linked venue binaries return access errors.",
    ),
    "opera-02.jpg": commons(
        "Inside the Dubai Opera.jpg",
        "Exact visitor view inside Dubai Opera; Commons attribution and reuse terms are on the source page.",
    ),
    "kayaksunrise-01.jpg": direct(
        "https://www.thenationalnews.com/resizer/v2/MQNDGPJ7Z7QWDJQUQNJOGZWC2U.jpg?auth=b96844ce1da203988c210a31950a2bf092f80db5a1f3fb788349e2f5a45f45d4&height=900&smart=true&width=1600",
        "https://www.thenationalnews.com/gulf-news/fun-in-the-sun-on-dubai-s-kite-beach-in-pictures-1.1237828",
        "Exact editorial paddleboarding action at Dubai's Kite Beach near golden hour.",
    ),
    "kayaksunrise-02.jpg": direct(
        "https://da28ojrjakn6f.cloudfront.net/tickets/32988/NEW/img_1671008976_1671008992__standuppaddle1.jpg?v=1.1.0",
        "https://experiences.visitdubai.com/productDetail/35818",
        "Exact Visit Dubai booking image of stand-up paddleboarding on Palm Jumeirah with Burj Al Arab behind; selected as bright, landscape Dubai context distinct from the sunrise silhouette.",
    ),
    "picnic-01.jpg": direct(
        "https://images.pexels.com/photos/8351229/pexels-photo-8351229.jpeg?cs=srgb&dl=pexels-mikhail-nilov-8351229.jpg&fm=jpg",
        "https://www.pexels.com/photo/a-couple-having-a-picnic-together-8351229/",
        "Representative free-stock couple sharing a blanket picnic in a sandy landscape; no Dubai venue is implied.",
    ),
    "picnic-02.jpg": direct(
        "https://images.unsplash.com/photo-1760937581288-89666e107923?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
        "https://unsplash.com/photos/lantern-hanging-on-a-wooden-post-in-the-desert-A8Edq46YMxU",
        "Exact Dubai-desert lantern detail under the Unsplash license, adding the intended no-light-pollution mood.",
    ),
}

NOT_FOUND = {
    "lovelakes-04.jpg": "No distinct, attributable Love Lake tagged-social image meeting the quality floor was found; the requested tag was inaccessible.",
    "opera-03.jpg": "No attributable review-platform candid meeting the quality floor was downloadable; the selected interior provides visitor context instead.",
    "kayaksunrise-03.jpg": "No additional attributable Kite Beach or Palm review candid meeting the quality floor was found after selecting exact editorial action and sunrise category context.",
}


def resolve_commons(title: str) -> tuple[str, str]:
    """Resolve a Commons title to a 2000-pixel binary URL and description page."""
    params = {
        "action": "query",
        "titles": f"File:{title}",
        "prop": "imageinfo",
        "iiprop": "url|size",
        "iiurlwidth": "2000",
        "format": "json",
        "formatversion": "2",
        "origin": "*",
    }
    request = urllib.request.Request(
        "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params),
        headers={"User-Agent": USER_AGENT},
    )
    for attempt in range(7):
        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                payload = json.load(response)
            page = payload["query"]["pages"][0]
            if page.get("missing"):
                raise ValueError(f"Commons file not found: {title}")
            info = page["imageinfo"][0]
            return info.get("thumburl") or info["url"], info["descriptionurl"]
        except Exception:
            if attempt == 6:
                raise
            time.sleep(3 * (attempt + 1))
    raise AssertionError("unreachable")


def fetch(url: str, destination: Path) -> str:
    """Download one binary with retries and report its final effective URL."""
    command = [
        "curl",
        "-L",
        "--fail",
        "--retry",
        "7",
        "--retry-all-errors",
        "--retry-delay",
        "3",
        "--max-time",
        "150",
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
    """Load only the five Quiet and dark activities assigned to this workstream."""
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

            url = selected["ref"]
            source_page = selected["source_page"]
            if selected["kind"] == "commons":
                url, source_page = resolve_commons(selected["ref"])
            raw = Path(temporary) / f"{filename}.source"
            actual_url = fetch(url, raw)
            width, height, size = normalize(raw, PHOTOS / filename)
            results.append(
                {
                    **base,
                    "status": "downloaded",
                    "actual_url": actual_url,
                    "source_page": source_page,
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
        raise ValueError("duplicate actual URL in Quiet and dark root batch")
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
