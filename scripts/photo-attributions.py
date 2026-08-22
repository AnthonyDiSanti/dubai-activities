#!/usr/bin/env python3
"""Maintain, validate, and publish the photo-attribution catalog."""

from __future__ import annotations

import argparse
import csv
import html
import json
import re
import sys
import urllib.parse
import urllib.request
from collections import Counter
from datetime import date
from html.parser import HTMLParser
from pathlib import Path
from typing import Any


ATTRIBUTION_FIELDS = [
    "filename",
    "work_title",
    "creator_name",
    "creator_type",
    "creator_url",
    "source_name",
    "license_name",
    "license_url",
    "credit_basis",
    "modifications",
    "verified_on",
    "notes",
]
VALID_BASES = {
    "creative_commons",
    "stock_license",
    "public_domain",
    "creator_credit",
    "source_credit",
    "trademark",
}
VALID_CREATOR_TYPES = {"", "person", "organization"}
TODAY = date.today().isoformat()

SOURCE_LABELS = {
    "arte.ae": "ARTE",
    "boulderzone.ae": "Boulder Zone",
    "chaoskarts.ae": "Chaos Karts",
    "comptoir102.com": "Comptoir 102",
    "dinnerinthesky.ae": "Dinner in the Sky Dubai",
    "divesandy.com": "Sandy Beach Dive Centre",
    "dubai.artemuseum.com": "ARTE MUSEUM Dubai",
    "experiences.visitdubai.com": "Visit Dubai",
    "fluffin.ae": "Fluffin",
    "gigxels.com": "Gigxels",
    "goclimb.ae": "GoClimb",
    "gulfphotoplus.com": "Gulf Photo Plus",
    "inthepark.ae": "The Park",
    "kitesurf.ae": "Kitesurf School Dubai",
    "limbaceramics.com": "Limba Ceramics",
    "magicpin.com": "Magicpin",
    "maisonfleuret.fr": "Maison Fleuret",
    "maps.yango.com": "Yango Maps",
    "mediahub.jumeirah.com": "Jumeirah",
    "mirzam.com": "Mirzam Chocolate Makers",
    "monster-experience.com": "Monster Experience",
    "museumofthefuture.ae": "Museum of the Future",
    "oola-lab.com": "Oo La Lab",
    "opaworld.com": "OPA",
    "pauloakenfold.com": "Paul Oakenfold",
    "rameehotels.com": "Ramee Hotels",
    "ruyarestaurants.com": "Rüya",
    "seawake.ae": "SeaWake",
    "sharjah24.ae": "Sharjah24",
    "smgtdj.com": "Smart Gate Institute",
    "sohogardendxb.com": "Soho Garden Dubai",
    "sothebysrealty.ae": "Sotheby's International Realty UAE",
    "tashkeel.org": "Tashkeel",
    "thecamelfarm.ae": "The Camel Farm",
    "theeditdubai.com": "The Edit Dubai",
    "thedubaimall.com": "The Dubai Mall",
    "thepods.ae": "The Pods",
    "toda.ae": "Theatre of Digital Art",
    "travel.globalvillage.ae": "Global Village",
    "ua-intl.co": "United Al Saqer Group",
    "uae.heroballoonflights.com": "Hero Balloon Flights",
    "uae.platinum-heritage.com": "Platinum Heritage",
    "visitabudhabi.ae": "Visit Abu Dhabi",
    "visitjebeljais.com": "Jebel Jais",
    "visitrasalkhaimah.com": "Visit Ras Al Khaimah",
    "www.agenda.com": "The Agenda",
    "www.alhabtoorcity.com": "Al Habtoor City",
    "www.anantara.com": "Anantara",
    "www.aquafun.ae": "AquaFun",
    "www.aya-universe.com": "AYA Universe",
    "www.banyantree.com": "Banyan Tree",
    "www.bohemiadubai.com": "Bohemia Dubai",
    "www.caterermiddleeast.com": "Caterer Middle East",
    "www.clymbabudhabi.com": "CLYMB Abu Dhabi",
    "www.dinnertales.com": "Dinner Tales",
    "www.downtowndesign.com": "Downtown Design",
    "www.dubai-jetski.com": "Dubai Jet Ski",
    "www.dubaidesignweek.ae": "Dubai Design Week",
    "www.dubaiefoil.ae": "Dubai eFoil",
    "www.dubaiefoil.com": "Dubai eFoil",
    "www.dubaimiraclegarden.com": "Dubai Miracle Garden",
    "www.emaar.com": "Emaar",
    "www.falconhospital.com": "Abu Dhabi Falcon Hospital",
    "www.franckiealarcon.com": "Franckie Alarcon",
    "www.fujairah.ae": "Fujairah Tourism",
    "www.house-of-hype.com": "House of Hype",
    "www.ibiza-spotlight.com": "Ibiza Spotlight",
    "www.iflyme.com": "iFly Dubai",
    "www.imgworlds.com": "IMG Worlds of Adventure",
    "www.imore.com": "iMore",
    "www.intamin.com": "Intamin",
    "www.jumeirah.com": "Jumeirah",
    "www.laperle.com": "La Perle",
    "www.lecolevancleefarpels.com": "L’ÉCOLE, School of Jewelry Arts",
    "www.lepetitchef.com": "Le Petit Chef",
    "www.markusschulz.com": "Markus Schulz",
    "www.meowtropoliscatcafe.online": "Meowtropolis Cat Café",
    "www.mtnextreme.com": "Mountain Extreme",
    "www.nara.ae": "Nara Desert Escapes",
    "www.numeronetherlands.com": "Numéro Netherlands",
    "www.pachaicons.com": "Pacha ICONS",
    "www.palaisdedanse.com": "Palais de Danse",
    "www.pexels.com": "Pexels",
    "www.rockrepublicdubai.com": "Rock Republic Dubai",
    "www.salonduchocolatdubai.com": "Salon du Chocolat Dubai",
    "www.salsavida.com": "Salsa Vida",
    "www.seaworldabudhabi.com": "SeaWorld Abu Dhabi",
    "www.sevenrooms.com": "SevenRooms",
    "www.skidxb.com": "Ski Dubai",
    "www.skydivedubai.ae": "Skydive Dubai",
    "www.skywalker.ae": "Sky Walker Yacht Rental",
    "www.smithgill.com": "Adrian Smith + Gordon Gill Architecture",
    "www.squaremeal.ae": "SquareMeal UAE",
    "www.teamlababudhabi.com": "teamLab Phenomena Abu Dhabi",
    "www.theagenda.com": "The Agenda",
    "www.thenationalnews.com": "The National",
    "www.thepenthouse.co": "The Penthouse Dubai",
    "www.topchefdubai.com": "Top Chef Dubai",
    "www.travelsforstars.com": "Travels for Stars",
    "www.untold.ae": "UNTOLD Dubai",
    "www.unvrs.com": "UNVRS",
    "www.ushuaiadubai.com": "Ushuaïa Dubai Harbour Experience",
    "www.vibrissaecafe.com": "Vibrissae Cat Café",
    "www.visitdubai.com": "Visit Dubai",
    "www.visithatta.com": "Visit Hatta",
    "www.visitsharjah.com": "Visit Sharjah",
    "www.wakesurfdubai.com": "Wake Surf Dubai",
    "www.xdubai.com": "XDubai",
    "www.yasisland.com": "Yas Island",
    "www.yaswaterworld.com": "Yas Waterworld",
    "whatson.ae": "What’s On Dubai",
    "xclusiveyachts.com": "Xclusive Yachts",
}

STOCK_CREATORS = {
    "dimsum-01.jpg": ("Mikhail Nilov", "Pexels", "Pexels License", "https://www.pexels.com/license/"),
    "dimsum-02.jpg": ("Jonas F", "Pexels", "Pexels License", "https://www.pexels.com/license/"),
    "opera-01.jpg": ("Dawid Tkocz", "Pexels", "Pexels License", "https://www.pexels.com/license/"),
    "picnic-01.jpg": ("Mikhail Nilov", "Pexels", "Pexels License", "https://www.pexels.com/license/"),
    "supperclubs-01.jpg": ("Romain Gal", "Unsplash", "Unsplash License", "https://unsplash.com/license"),
    "supperclubs-02.jpg": ("Tetiana Thiel", "Unsplash", "Unsplash License", "https://unsplash.com/license"),
    "picnic-02.jpg": ("Luan Fonseca", "Unsplash", "Unsplash License", "https://unsplash.com/license"),
}

MANUAL_ATTRIBUTIONS: dict[str, dict[str, str]] = {
    "atb-01.jpg": {
        "creator_name": "Marian Sarau",
        "creator_type": "person",
        "source_name": "Gigxels",
        "license_name": "Gigxels Free License",
        "license_url": "https://gigxels.com/free-license",
        "credit_basis": "stock_license",
        "notes": "Photographer and license were explicitly identified on the recorded source.",
    },
    "honeycomb-01.jpg": {
        "creator_name": "Honeycomb Hi-Fi",
        "creator_type": "organization",
        "credit_basis": "creator_credit",
        "notes": "The National identifies the venue as the image supplier.",
    },
    "honeycomb-02.jpg": {
        "creator_name": "Honeycomb Hi-Fi",
        "creator_type": "organization",
        "credit_basis": "creator_credit",
        "notes": "The National identifies the venue as the image supplier.",
    },
    "pawnshop-01.jpg": {
        "creator_name": "Electric Pawn Shop",
        "creator_type": "organization",
        "credit_basis": "creator_credit",
        "notes": "The National identifies the venue as the image supplier.",
    },
    "pawnshop-02.jpg": {
        "creator_name": "Electric Pawn Shop",
        "creator_type": "organization",
        "credit_basis": "creator_credit",
        "notes": "The National identifies the venue as the image supplier.",
    },
    "krasota-04.jpg": {
        "creator_name": "KRASOTA",
        "creator_type": "organization",
        "credit_basis": "creator_credit",
        "notes": "The National explicitly credits KRASOTA for the image.",
    },
    "playhouse-01.jpg": {
        "creator_name": "Courtyard Playhouse",
        "creator_type": "organization",
        "credit_basis": "creator_credit",
        "notes": "The National explicitly credits Courtyard Playhouse for the image.",
    },
    "playhouse-02.jpg": {
        "creator_name": "Courtyard Playhouse",
        "creator_type": "organization",
        "credit_basis": "creator_credit",
        "notes": "The National identifies the venue as the image supplier.",
    },
    "ossiano-01.jpg": {
        "creator_name": "Atlantis The Palm",
        "creator_type": "organization",
        "credit_basis": "creator_credit",
        "notes": "The National explicitly credits Atlantis The Palm for the image.",
    },
    "camelfarm-01.jpg": {
        "creator_name": "Chris Whiteoak",
        "creator_type": "person",
        "credit_basis": "creator_credit",
        "notes": "The National feature explicitly names the photographer.",
    },
    "camelfarm-02.jpg": {
        "creator_name": "Chris Whiteoak",
        "creator_type": "person",
        "credit_basis": "creator_credit",
        "notes": "The National feature explicitly names the photographer.",
    },
    "camelfarm-03.jpg": {
        "creator_name": "Chris Whiteoak",
        "creator_type": "person",
        "credit_basis": "creator_credit",
        "notes": "The National feature explicitly names the photographer.",
    },
    "stormcoaster-01.jpg": {
        "creator_name": "Emaar Entertainment and Recreative",
        "creator_type": "organization",
        "credit_basis": "creator_credit",
        "notes": "The manufacturer project page names both image credit organizations.",
    },
    "stormcoaster-02.jpg": {
        "creator_name": "Emaar Entertainment and Recreative",
        "creator_type": "organization",
        "credit_basis": "creator_credit",
        "notes": "The manufacturer project page names both image credit organizations.",
    },
    "stormcoaster-03.jpg": {
        "creator_name": "Emaar Entertainment and Recreative",
        "creator_type": "organization",
        "credit_basis": "creator_credit",
        "notes": "The manufacturer project page names both image credit organizations.",
    },
}


class HtmlText(HTMLParser):
    """Extract readable text and the first creator link from Commons HTML fields."""

    def __init__(self) -> None:
        super().__init__()
        self.parts: list[str] = []
        self.first_href = ""

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag != "a" or self.first_href:
            return
        self.first_href = dict(attrs).get("href") or ""

    def handle_data(self, data: str) -> None:
        self.parts.append(data)

    @property
    def text(self) -> str:
        return " ".join(" ".join(self.parts).split())


def read_csv(path: Path) -> list[dict[str, str]]:
    """Read a UTF-8 CSV while preserving the declared text fields."""
    if not path.exists():
        return []
    with path.open(newline="", encoding="utf-8-sig") as handle:
        return list(csv.DictReader(handle))


def selected_manifest_rows(path: Path) -> list[dict[str, str]]:
    """Credits follow deployed assets, not unresolved sourcing requests."""
    return [row for row in read_csv(path) if row.get("disposition") == "selected"]


def source_name(url: str) -> str:
    """Prefer a curated publisher label and retain the hostname as an honest fallback."""
    host = urllib.parse.urlparse(url).netloc.lower()
    return SOURCE_LABELS.get(host, host.removeprefix("www."))


def activity_id(row: dict[str, str]) -> str | None:
    """The established JPEG filename prefix is the durable activity identifier."""
    match = re.match(r"^(.+)-(\d{2})\.jpg$", row["filename"])
    return match.group(1) if match else None


def default_modifications(row: dict[str, str]) -> str:
    """Disclose the normalization and responsive presentation applied to local JPEGs."""
    if not row["filename"].lower().endswith(".jpg"):
        return ""
    notes = row.get("notes", "").lower()
    path = urllib.parse.urlparse(row.get("actual_url", "")).path.lower()
    if any(word in notes for word in ("crop", "cropped", "trim", "trimmed")):
        return "Cropped and resized for web display."
    if path.endswith((".avif", ".png", ".webp")):
        return "Converted to JPEG and resized for web display; shown with responsive cropping."
    return "Resized for web display and shown with responsive cropping."


def default_attribution(row: dict[str, str]) -> dict[str, str]:
    """Guarantee a visible source credit even before richer creator research lands."""
    filename = row["filename"]
    if filename == "icon-google-maps.svg":
        return {
            "filename": filename,
            "work_title": "Google Maps app mark",
            "creator_name": "Google",
            "creator_type": "organization",
            "creator_url": "https://about.google/brand-resource-center/",
            "source_name": "Wikimedia Commons",
            "license_name": "Public-domain copyright status; trademark rules apply",
            "license_url": row["source_page"],
            "credit_basis": "trademark",
            "modifications": "",
            "verified_on": TODAY,
            "notes": "Attribution records copyright provenance without implying trademark permission.",
        }
    if filename == "icon-instagram.svg":
        return {
            "filename": filename,
            "work_title": "Instagram gradient glyph",
            "creator_name": "Meta Platforms, Inc.",
            "creator_type": "organization",
            "creator_url": "https://about.meta.com/brand/resources/instagram/instagram-brand/",
            "source_name": "Wikimedia Commons",
            "license_name": "Public-domain copyright status; trademark rules apply",
            "license_url": row["source_page"],
            "credit_basis": "trademark",
            "modifications": "",
            "verified_on": TODAY,
            "notes": "Attribution records copyright provenance without implying trademark permission.",
        }
    return {
        "filename": filename,
        "work_title": "",
        "creator_name": "",
        "creator_type": "",
        "creator_url": "",
        "source_name": source_name(row["source_page"]),
        "license_name": "",
        "license_url": "",
        "credit_basis": "source_credit",
        "modifications": default_modifications(row),
        "verified_on": TODAY,
        "notes": "Creator or reusable license was not identified; credit the recorded source without implying permission.",
    }


def write_ledger(path: Path, rows: list[dict[str, str]]) -> None:
    """Write a deterministic ledger that remains straightforward to review in git."""
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=ATTRIBUTION_FIELDS, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


def html_field(value: str) -> tuple[str, str]:
    """Normalize the small HTML fragments returned by Commons extmetadata."""
    parser = HtmlText()
    parser.feed(html.unescape(value))
    href = parser.first_href
    if href.startswith("//"):
        href = f"https:{href}"
    elif href.startswith("/"):
        href = f"https://commons.wikimedia.org{href}"
    if "redlink=1" in href:
        href = ""
    return parser.text, href


def normalized_commons_creator(value: str) -> str:
    """Remove uploader boilerplate while retaining the credited account name."""
    match = re.match(r"The original uploader was (.+?) at English Wikipedia\s*\.?$", value)
    return match.group(1) if match else value


def commons_metadata(rows: list[dict[str, str]]) -> dict[str, dict[str, str]]:
    """Fetch Commons metadata in batches so open-license credits are reproducible."""
    title_to_filename: dict[str, str] = {}
    for row in rows:
        if urllib.parse.urlparse(row["source_page"]).netloc != "commons.wikimedia.org":
            continue
        title = urllib.parse.unquote(urllib.parse.urlparse(row["source_page"]).path.split("/wiki/", 1)[-1])
        title_to_filename[title.replace("_", " ")] = row["filename"]

    results: dict[str, dict[str, str]] = {}
    titles = list(title_to_filename)
    for start in range(0, len(titles), 50):
        batch = titles[start:start + 50]
        query = urllib.parse.urlencode({
            "action": "query",
            "format": "json",
            "formatversion": "2",
            "prop": "imageinfo",
            "iiprop": "extmetadata",
            "titles": "|".join(batch),
        })
        request = urllib.request.Request(
            f"https://commons.wikimedia.org/w/api.php?{query}",
            headers={"User-Agent": "NaimaPhotoCredits/1.0 (private personal guide)"},
        )
        with urllib.request.urlopen(request, timeout=30) as response:
            payload = json.load(response)
        for page in payload.get("query", {}).get("pages", []):
            title = page.get("title", "")
            filename = title_to_filename.get(title)
            imageinfo = page.get("imageinfo") or []
            if not filename or not imageinfo:
                continue
            ext = imageinfo[0].get("extmetadata", {})
            artist, creator_url = html_field(ext.get("Artist", {}).get("value", ""))
            work_title, _ = html_field(ext.get("ObjectName", {}).get("value", ""))
            license_name, _ = html_field(ext.get("LicenseShortName", {}).get("value", ""))
            license_url = ext.get("LicenseUrl", {}).get("value", "")
            results[filename] = {
                "creator_name": artist,
                "creator_url": creator_url,
                "work_title": work_title,
                "license_name": license_name,
                "license_url": license_url,
            }
    return results


def sync(manifest: Path, ledger: Path, refresh_open: bool) -> None:
    """Add new deployed assets and optionally refresh open-license metadata."""
    manifest_rows = selected_manifest_rows(manifest)
    existing_rows = read_csv(ledger)
    existing = {row["filename"]: row for row in existing_rows}
    manifest_by_filename = {row["filename"]: row for row in manifest_rows}
    merged = [existing.get(row["filename"], default_attribution(row)) for row in manifest_rows]

    commons = commons_metadata(manifest_rows) if refresh_open else {}
    for row in merged:
        manifest_row = manifest_by_filename[row["filename"]]
        if row["filename"] in {"icon-google-maps.svg", "icon-instagram.svg"}:
            row.update(default_attribution(manifest_row))
            continue
        metadata = commons.get(row["filename"])
        if metadata:
            row.update(metadata)
            row["creator_name"] = normalized_commons_creator(row["creator_name"])
            row["creator_type"] = (
                "organization"
                if ".com" in row["creator_name"].lower()
                else "person"
            ) if row["creator_name"] else ""
            row["source_name"] = "Wikimedia Commons"
            normalized_license = row["license_name"].lower()
            if row["credit_basis"] != "trademark":
                row["credit_basis"] = (
                    "public_domain"
                    if "public domain" in normalized_license or normalized_license == "cc0"
                    else "creative_commons"
                )
            row["verified_on"] = TODAY
            row["notes"] = "Metadata verified from the Wikimedia Commons API."
            if "BY-SA" in row["license_name"].upper():
                changes = default_modifications(manifest_row).rstrip(".")
                row["modifications"] = (
                    f"{changes}. Local adaptation remains under the same license."
                )

        stock = STOCK_CREATORS.get(row["filename"])
        if stock:
            creator, source, license_name, license_url = stock
            row.update({
                "creator_name": creator,
                "creator_type": "person",
                "creator_url": "",
                "source_name": source,
                "license_name": license_name,
                "license_url": license_url,
                "credit_basis": "stock_license",
                "verified_on": TODAY,
                "notes": f"Creator and current {source} license recorded for voluntary attribution.",
            })

        manual = MANUAL_ATTRIBUTIONS.get(row["filename"])
        if manual:
            row.update(manual)
            row["verified_on"] = TODAY

    write_ledger(ledger, merged)
    print(f"Wrote {ledger} with {len(merged)} selected-asset credits")


def credit_text(manifest_row: dict[str, str], attribution: dict[str, str]) -> str:
    """Produce one neutral credit sentence without implying permission or endorsement."""
    slot = manifest_row.get("slot", "")
    fallback_title = (
        attribution["work_title"]
        or (f"{manifest_row['activity']} — photo {slot}" if slot.isdigit() else manifest_row["shot_wanted"])
    )
    creator = attribution["creator_name"]
    source = attribution["source_name"]
    parts = [f"{fallback_title} by {creator}, via {source}" if creator else f"{fallback_title}, via {source}"]
    if attribution["license_name"]:
        parts.append(attribution["license_name"])
    if attribution["modifications"]:
        parts.append(attribution["modifications"])
    return ". ".join(part.rstrip(".") for part in parts if part) + "."


def public_record(manifest_row: dict[str, str], attribution: dict[str, str]) -> dict[str, Any]:
    """Expose only public credit fields; internal review notes stay in docs."""
    slot = int(manifest_row["slot"]) if manifest_row["slot"].isdigit() else None
    return {
        "filename": manifest_row["filename"],
        "activityId": activity_id(manifest_row),
        "activityName": manifest_row["activity"] if manifest_row["activity"] != "—" else "Interface marks",
        "chapterName": manifest_row["chapter"],
        "slot": slot,
        "workTitle": attribution["work_title"] or None,
        "creator": ({
            "name": attribution["creator_name"],
            "type": attribution["creator_type"],
            "url": attribution["creator_url"] or None,
        } if attribution["creator_name"] else None),
        "source": {
            "name": attribution["source_name"],
            "url": manifest_row["source_page"],
        },
        "license": ({
            "name": attribution["license_name"],
            "url": attribution["license_url"] or None,
        } if attribution["license_name"] else None),
        "creditBasis": attribution["credit_basis"],
        "modifications": attribution["modifications"] or None,
        "creditText": credit_text(manifest_row, attribution),
    }


def build_catalog(manifest: Path, ledger: Path) -> dict[str, Any]:
    """Join enriched rows to the manifest while source-crediting any future gaps."""
    manifest_rows = selected_manifest_rows(manifest)
    ledger_rows = read_csv(ledger)
    attributions = {row["filename"]: row for row in ledger_rows}
    assets = [
        public_record(row, attributions.get(row["filename"], default_attribution(row)))
        for row in manifest_rows
    ]
    return {"schemaVersion": 1, "assets": assets}


def json_ld(catalog: dict[str, Any]) -> dict[str, Any]:
    """Translate the compact UI catalog into standard Schema.org ImageObjects."""
    graph: list[dict[str, Any]] = []
    for asset in catalog["assets"]:
        image: dict[str, Any] = {
            "@type": "ImageObject",
            "@id": f"./photos/{asset['filename']}",
            "contentUrl": f"./photos/{asset['filename']}",
            "name": asset["workTitle"] or f"{asset['activityName']} — photo {asset['slot'] or 'mark'}",
            "creditText": asset["creditText"],
            "isBasedOn": asset["source"]["url"],
            "encodingFormat": "image/jpeg" if asset["filename"].endswith(".jpg") else "image/svg+xml",
        }
        if asset["creator"]:
            image["creator"] = {
                "@type": "Person" if asset["creator"]["type"] == "person" else "Organization",
                "name": asset["creator"]["name"],
            }
            if asset["creator"]["url"]:
                image["creator"]["url"] = asset["creator"]["url"]
        if asset["license"] and asset["license"]["url"]:
            image["license"] = asset["license"]["url"]
        if asset["modifications"]:
            image["description"] = asset["modifications"]
        graph.append(image)
    return {"@context": "https://schema.org", "@graph": graph}


def serialized(value: Any) -> str:
    """Keep generated data readable and byte-stable across platforms."""
    return json.dumps(value, ensure_ascii=False, indent=2, sort_keys=False) + "\n"


def generate(manifest: Path, ledger: Path, public_dir: Path) -> None:
    """Publish compact UI data and an independently discoverable JSON-LD graph."""
    catalog = build_catalog(manifest, ledger)
    public_dir.mkdir(parents=True, exist_ok=True)
    (public_dir / "photo-attributions.json").write_text(serialized(catalog), encoding="utf-8")
    (public_dir / "photo-attributions.jsonld").write_text(
        serialized(json_ld(catalog)),
        encoding="utf-8",
    )
    print(f"Generated public attribution data for {len(catalog['assets'])} assets")


def valid_http_url(value: str) -> bool:
    """Public credit links must remain safe, absolute HTTP(S) destinations."""
    return bool(re.match(r"^https?://", value))


def audit(manifest: Path, ledger: Path, public_dir: Path, strict: bool) -> int:
    """Separate structural failures from non-blocking attribution-enrichment warnings."""
    manifest_rows = selected_manifest_rows(manifest)
    ledger_rows = read_csv(ledger)
    errors: list[str] = []
    warnings: list[str] = []
    filenames = Counter(row.get("filename", "") for row in ledger_rows)
    manifest_filenames = {row["filename"] for row in manifest_rows}
    ledger_filenames = set(filenames)

    if not ledger_rows or list(ledger_rows[0]) != ATTRIBUTION_FIELDS:
        errors.append(f"ledger must use exact columns: {ATTRIBUTION_FIELDS}")
    for filename, count in filenames.items():
        if not filename:
            errors.append("ledger contains an empty filename")
        elif count > 1:
            errors.append(f"duplicate ledger filename: {filename}")
    for filename in sorted(ledger_filenames - manifest_filenames):
        errors.append(f"ledger credits a non-selected asset: {filename}")
    for filename in sorted(manifest_filenames - ledger_filenames):
        warnings.append(f"selected asset uses generated source fallback: {filename}")

    for row in ledger_rows:
        filename = row.get("filename", "unnamed")
        basis = row.get("credit_basis", "")
        if basis not in VALID_BASES:
            errors.append(f"{filename}: invalid credit_basis {basis!r}")
        if row.get("creator_type", "") not in VALID_CREATOR_TYPES:
            errors.append(f"{filename}: invalid creator_type {row.get('creator_type')!r}")
        if bool(row.get("creator_name")) != bool(row.get("creator_type")):
            errors.append(f"{filename}: creator_name and creator_type must appear together")
        for key in ("creator_url", "license_url"):
            if row.get(key) and not valid_http_url(row[key]):
                errors.append(f"{filename}: {key} must be HTTP(S)")
        if not row.get("source_name"):
            errors.append(f"{filename}: source_name is required")
        try:
            date.fromisoformat(row.get("verified_on", ""))
        except ValueError:
            errors.append(f"{filename}: verified_on must be YYYY-MM-DD")
        if basis == "creative_commons":
            for key in ("creator_name", "license_name", "license_url", "modifications"):
                if not row.get(key):
                    warnings.append(f"{filename}: Creative Commons credit lacks {key}")
        if basis == "stock_license" and not row.get("license_url"):
            warnings.append(f"{filename}: stock credit lacks license_url")

    catalog = build_catalog(manifest, ledger)
    expected_ui = serialized(catalog)
    expected_ld = serialized(json_ld(catalog))
    outputs = {
        public_dir / "photo-attributions.json": expected_ui,
        public_dir / "photo-attributions.jsonld": expected_ld,
    }
    for path, expected in outputs.items():
        if not path.exists():
            errors.append(f"missing generated output: {path}")
        elif path.read_text(encoding="utf-8") != expected:
            errors.append(f"stale generated output: {path}")

    if errors:
        print("Photo attribution audit failed:")
        for error in errors:
            print(f"- {error}")
    if warnings:
        print("Photo attribution enrichment warnings:")
        for warning in warnings:
            print(f"- {warning}")
    bases = Counter(row["credit_basis"] for row in ledger_rows)
    print(
        f"Photo attribution audit: {len(manifest_rows)} selected assets; "
        f"{len(ledger_rows)} ledger rows; bases={dict(bases)}; warnings={len(warnings)}"
    )
    return 1 if errors or (strict and warnings) else 0


def main() -> int:
    """Dispatch explicit maintenance commands without adding build-time network access."""
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=("sync", "generate", "audit"))
    parser.add_argument("--manifest", type=Path, default=Path("docs/image-manifest.csv"))
    parser.add_argument("--ledger", type=Path, default=Path("docs/photo-attributions.csv"))
    parser.add_argument("--public-dir", type=Path, default=Path("public"))
    parser.add_argument("--refresh-open", action="store_true")
    parser.add_argument("--strict", action="store_true")
    args = parser.parse_args()

    if args.command == "sync":
        sync(args.manifest, args.ledger, args.refresh_open)
    elif args.command == "generate":
        generate(args.manifest, args.ledger, args.public_dir)
    else:
        return audit(args.manifest, args.ledger, args.public_dir, args.strict)
    return 0


if __name__ == "__main__":
    sys.exit(main())
