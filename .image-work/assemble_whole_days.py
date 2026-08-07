#!/usr/bin/env python3
"""Download and document the Whole days elsewhere photo batch."""

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
ORIGINAL = ROOT / "image-manifest.csv"
PHOTOS = ROOT / "src" / "photos"
OUTPUT = ROOT / ".image-work" / "whole_days.csv"
USER_AGENT = "Mozilla/5.0 DubaiPhotoCurator/1.0"
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


def official(url: str, page: str, note: str) -> dict[str, str]:
    """Describe a first-party image and its human-readable source page."""
    return {"kind": "direct", "ref": url, "source_page": page, "note": note}


def commons(title: str, note: str) -> dict[str, str]:
    """Describe a Commons file that will be resolved through the media API."""
    return {"kind": "commons", "ref": title, "source_page": "", "note": note}


SOURCES = {
    "snoopy-02.jpg": commons(
        "Pristine blue waters of Snoopy Island.jpg",
        "Exact Snoopy Island beach view; Commons creator and reuse terms are on the source page.",
    ),
    "snoopy-01.jpg": official(
        "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1440,h=756,fit=crop,f=jpeg/dOqbqlER9wtELn2p/photo-18-01-2015-4-30-13a-pm-YanBnMjjW7cDr6V9.jpg",
        "https://divesandy.com/shore-dive-snoopy-island-sandy-beach-dive-academy",
        "Exact official Snoopy Island shore-dive view with swimmers and snorkel gear; promoted to hero because it communicates the activity in both card and detail crops.",
    ),
    "snoopy-03.jpg": commons(
        "Fujairah Beach.jpg",
        "Exact visitor-in-the-water view toward Snoopy Island; used as the candid activity context.",
    ),
    "snoopy-04.jpg": commons(
        "Snoopy Island Long Exposure.jpg",
        "Exact atmospheric view of Snoopy Island; used in place of an inaccessible tagged social post.",
    ),
    "musandam-01.jpg": commons(
        "Khor Ash Sham (38529258240).jpg",
        "Exact Musandam dhow-and-fjords hero; Commons creator and reuse terms are on the source page.",
    ),
    "musandam-02.jpg": commons(
        "Dhow Cruise, Khasab, Oman - panoramio (2).jpg",
        "Exact Khasab dhow-cruise scene with multiple boats and passengers.",
    ),
    "musandam-03.jpg": commons(
        "Full Day Dhow Cruise in Khasab Musandam.jpg",
        "Exact candid passenger view aboard a traditional Musandam dhow.",
    ),
    "musandam-04.jpg": commons(
        "Musandam Dhow Cruise (15992601694).jpg",
        "Exact on-the-water Musandam fjord context; used in place of an inaccessible tagged social post.",
    ),
    "musandam-05.jpg": commons(
        "Dhow trip in the fjords of Musandam, Oman (36208084624).jpg",
        "Exact wide fjord view from a dhow trip, compositionally distinct from the boat portraits.",
    ),
    "hatta-01.jpg": official(
        "https://cdn.prod.website-files.com/64ffd6c42ea5a246c5d6cc3e/694e64ca1b61aa249d4f8c16_hatta%20wadi%20hub.png",
        "https://www.visithatta.com/en/offer/hatta-wadi-hub",
        "Exact official Hatta Wadi Hub mountain-biking hero.",
    ),
    "hatta-02.jpg": official(
        "https://cdn.prod.website-files.com/64ffd6c42ea5a246c5d6cc3e/683007b3b853535f594f45be_image12.avif",
        "https://www.visithatta.com/en/offer/hatta-wadi-hub",
        "Exact official trail-riding action view at Hatta Wadi Hub.",
    ),
    "hatta-03.jpg": official(
        "https://cdn.prod.website-files.com/64ffd6c42ea5a246c5d6cc3e/68306d43025c763b62aa6f7f_image5.avif",
        "https://www.visithatta.com/en/offer/hatta-wadi-hub",
        "Exact official candid group hike at sunset.",
    ),
    "hatta-04.jpg": official(
        "https://cdn.prod.website-files.com/64ffd6c42ea5a246c5d6cc3e/683d96cc8799f0d832bc9f3c_image3.avif",
        "https://www.visithatta.com/en/offer/hatta-wadi-hub",
        "Exact official kayaking view; used in place of an inaccessible tagged social post.",
    ),
    "hatta-05.jpg": official(
        "https://cdn.prod.website-files.com/64ffd6c42ea5a246c5d6cc3e/68300dd6a88b808517f8009d_image17.avif",
        "https://www.visithatta.com/en/offer/hatta-wadi-hub",
        "Exact official mountain-stay view, adding a quiet counterpoint to the action images.",
    ),
    "jebeljais-01.jpg": official(
        "https://visitjebeljais.com/hubfs/Jebel_Jais_2025/Images/_DSC0025%20%28Large%29%20%282%29.jpg",
        "https://visitjebeljais.com/",
        "Exact official sunset panorama from Jebel Jais.",
    ),
    "jebeljais-02.jpg": official(
        "https://visitjebeljais.com/hs-fs/hubfs/_DSC0864.jpg?width=2000&name=_DSC0864.jpg",
        "https://visitjebeljais.com/",
        "Exact official cycling scene with the Hajar Mountains behind it.",
    ),
    "jebeljais-03.jpg": official(
        "https://visitjebeljais.com/hubfs/Jebel_Jais_2025/Images/Highlander%202021%20%28Large%29-1.jpg",
        "https://visitjebeljais.com/",
        "Exact official candid group hike on the mountain.",
    ),
    "jebeljais-04.jpg": official(
        "https://visitjebeljais.com/hubfs/Jebel_Jais_2025/Images/About/DSC07143-3%20%28Large%29.jpg",
        "https://visitjebeljais.com/",
        "Exact official trail-running view; used in place of an inaccessible tagged social post.",
    ),
    "jebeljais-05.jpg": official(
        "https://visitjebeljais.com/hubfs/_DSC0836%20%281%29.jpg",
        "https://visitjebeljais.com/",
        "Exact official summit-rest scene, compositionally distinct from the activity shots.",
    ),
    "abudhabiday-01.jpg": official(
        "https://static.myconnect.ae/-/media/yasconnect/project/tlp/explore/artworks/light-vortex-2-169f.jpg?h=1080&w=1920",
        "https://www.teamlababudhabi.com/en/explore/artworks",
        "Exact official landscape view of Light Vortex at teamLab Phenomena Abu Dhabi.",
    ),
    "abudhabiday-02.jpg": official(
        "https://static.myconnect.ae/-/media/yasconnect/project/tlp/explore/artworks/main_morphing-continuum_abudhabi___34.jpg",
        "https://www.teamlababudhabi.com/en/explore/artworks",
        "Exact official Morphing Continuum installation at teamLab Phenomena Abu Dhabi.",
    ),
    "abudhabiday-03.jpg": official(
        "https://static.myconnect.ae/-/media/yasconnect/project/tlp/people/tlp-13-169f.jpg?h=1080&w=1920",
        "https://www.teamlababudhabi.com/en/plan-your-visit",
        "Exact official exterior of teamLab Phenomena in Saadiyat Cultural District.",
    ),
    "abudhabiday-04.jpg": official(
        "https://static.myconnect.ae/-/media/yasconnect/project/clymb/new-clymb2023/home-page/beginner-flying/1500x964-cardimage.jpg",
        "https://www.clymbabudhabi.com/en/explore",
        "Exact official first-time flyer with an instructor inside the branded CLYMB wind tunnel.",
    ),
    "yasraid-01.jpg": official(
        "https://static.myconnect.ae/-/media/yasconnect/project/yasisland/aaamain/multipark2024/tabsmulti1fwd.jpg?w=2000",
        "https://www.yasisland.com/en",
        "Exact official Ferrari World action panorama from Yas Island's multi-park guide.",
    ),
    "yasraid-02.jpg": official(
        "https://static.myconnect.ae/-/media/yasconnect/project/yasisland/aaamain/multipark2024/tabsmulti1ywwd3.jpg?w=2000",
        "https://www.yasisland.com/en",
        "Exact official Yas Waterworld action panorama from Yas Island's multi-park guide.",
    ),
    "yasraid-03.jpg": official(
        "https://static.myconnect.ae/-/media/yasconnect/project/yasisland/hotels/hilton-yas-island/hiltonnewjuly/slider-desktop.jpg?w=1024",
        "https://www.yasisland.com/en",
        "Exact official on-island hotel context for the overnight part of the itinerary.",
    ),
    "yasraid-04.jpg": official(
        "https://static.myconnect.ae/-/media/yasconnect/project/yasisland/aaamain/yi-home-of-f1.jpg",
        "https://www.yasisland.com/en",
        "Exact official Yas Marina Circuit view, adding a distinct island-scale context.",
    ),
    "fujairah-01.jpg": official(
        "https://fujairah.ae/HomeSlider/boat.jpg",
        "https://www.fujairah.ae/en/Pages/default.aspx",
        "Exact official Fujairah east-coast beach hero with kayaks and mountains.",
    ),
    "fujairah-02.jpg": official(
        "https://fujairah.ae/HomeSlider/fort.jpg",
        "https://www.fujairah.ae/en/Pages/default.aspx",
        "Exact official Fujairah Fort view.",
    ),
    "fujairah-03.jpg": official(
        "https://fujairah.ae/HomeSlider/mosque.jpg",
        "https://www.fujairah.ae/en/Pages/default.aspx",
        "Exact official nighttime view of Sheikh Zayed Mosque in Fujairah.",
    ),
    "fujairah-04.jpg": commons(
        "Fujairah Coast.jpg",
        "Exact east-coast sea view; Commons creator and reuse terms are on the source page.",
    ),
    "alain-01.jpg": official(
        "https://visitabudhabi.ae/-/media/project/vad/things-to-do/nature-and-wildlife-mfd/natural-wonders/al-ain-oasis/new-rebrand-image/header/al-ain-oasis.jpg?rev=7b1328f409b24a54bc6188490dc6c3a4",
        "https://visitabudhabi.ae/en/things-to-do/nature-and-wildlife/natural-wonders/al-ain-oasis",
        "Exact official Al Ain Oasis hero with visitors beneath the palms.",
    ),
    "alain-02.jpg": commons(
        "Falaj irrigation system at Al Ain Oasis.jpg",
        "Exact close view of the oasis's working falaj irrigation channel; deliberately framed landscape around the channel so it survives the site's wide crop.",
    ),
    "alain-03.jpg": commons(
        "Al-Ain Oasis (5).jpg",
        "Exact walker's-eye view along a shaded oasis path; Commons attribution is on the source page.",
    ),
}

# This portrait source needs a lower focal point to preserve the falaj in wide crops.
CROP_FOCUS = {"alain-02.jpg": (0.5, 0.72)}


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
    for attempt in range(5):
        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                payload = json.load(response)
            page = payload["query"]["pages"][0]
            if page.get("missing"):
                raise ValueError(f"Commons file not found: {title}")
            info = page["imageinfo"][0]
            return info.get("thumburl") or info["url"], info["descriptionurl"]
        except Exception:
            if attempt == 4:
                raise
            time.sleep(2 * (attempt + 1))
    raise AssertionError("unreachable")


def fetch(url: str, destination: Path) -> str:
    """Download one binary with bounded retries and return the final effective URL."""
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


def normalize(
    source: Path,
    destination: Path,
    crop_focus: tuple[float, float] | None = None,
) -> tuple[int, int, int]:
    """Create a web-ready JPEG without upscaling or retaining embedded metadata."""
    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened)
        if image.mode in {"RGBA", "LA"}:
            background = Image.new("RGB", image.size, "white")
            background.paste(image, mask=image.getchannel("A"))
            image = background
        else:
            image = image.convert("RGB")
        if max(image.size) < 800:
            raise ValueError(f"source long edge is only {max(image.size)}px")
        if crop_focus:
            # Build an in-bounds 16:9 canvas first, so focal cropping never upscales.
            width, height = image.size
            if width / height < 16 / 9:
                target = (width, round(width * 9 / 16))
            else:
                target = (round(height * 16 / 9), height)
            image = ImageOps.fit(
                image,
                target,
                method=Image.Resampling.LANCZOS,
                centering=crop_focus,
            )
        image.thumbnail((2000, 2000), Image.Resampling.LANCZOS)
        image.save(destination, "JPEG", quality=85, optimize=True, progressive=True)
    with Image.open(destination) as final:
        width, height = final.size
    return width, height, destination.stat().st_size


def original_rows() -> list[dict[str, str]]:
    """Load the original requests for only the chapter owned by this workstream."""
    with ORIGINAL.open(newline="", encoding="utf-8-sig") as handle:
        return [
            row
            for row in csv.DictReader(handle)
            if row["chapter"] == "Whole days elsewhere"
        ]


def assemble() -> list[dict[str, str]]:
    """Download mapped sources and emit honest not-found rows for unmapped requests."""
    PHOTOS.mkdir(parents=True, exist_ok=True)
    results: list[dict[str, str]] = []
    with tempfile.TemporaryDirectory() as temporary:
        for request in original_rows():
            filename = request["filename"]
            source = SOURCES.get(filename)
            base = {
                "filename": filename,
                "request_url": request.get("request_url") or request["url"],
                "activity": request["activity"],
                "chapter": request["chapter"],
                "slot": request["slot"],
                "role": request.get("role") or request["requested_role"],
                "shot_wanted": request["shot_wanted"],
            }
            if source is None:
                results.append(
                    {
                        **base,
                        "status": "not_found",
                        "actual_url": "",
                        "source_page": "",
                        "notes": "No sufficiently strong, attributable replacement has been selected yet.",
                        "width": "",
                        "height": "",
                        "bytes": "",
                    }
                )
                continue

            url = source["ref"]
            source_page = source["source_page"]
            if source["kind"] == "commons":
                url, source_page = resolve_commons(source["ref"])
            raw = Path(temporary) / f"{filename}.source"
            actual_url = fetch(url, raw)
            width, height, size = normalize(
                raw,
                PHOTOS / filename,
                CROP_FOCUS.get(filename),
            )
            results.append(
                {
                    **base,
                    "status": "downloaded",
                    "actual_url": actual_url,
                    "source_page": source_page,
                    "notes": source["note"],
                    "width": str(width),
                    "height": str(height),
                    "bytes": str(size),
                }
            )
            print(f"{filename}: {width}x{height}, {size} bytes")
    return results


def validate(rows: list[dict[str, str]]) -> None:
    """Reject incomplete coverage, repeated sources, or duplicate final image bytes."""
    expected = {row["filename"] for row in original_rows()}
    actual = {row["filename"] for row in rows}
    if expected != actual:
        raise ValueError(f"coverage mismatch: missing={expected - actual}, extra={actual - expected}")
    urls = [row["actual_url"] for row in rows if row["status"] == "downloaded"]
    if len(urls) != len(set(urls)):
        raise ValueError("duplicate actual URL in Whole days elsewhere batch")
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
    """Assemble, validate, and atomically write the chapter result fragment."""
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
