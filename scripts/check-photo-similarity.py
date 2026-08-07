#!/usr/bin/env python3
"""Report likely duplicate JPEGs using full-frame and gallery-crop hashes."""

from __future__ import annotations

import argparse
import csv
import math
from pathlib import Path
from statistics import median

from PIL import Image, ImageOps


def difference_hash(image: Image.Image, size: int = 16) -> int:
    """Encode adjacent luminance changes so resized duplicates compare cheaply."""
    gray = ImageOps.grayscale(image).resize((size + 1, size), Image.Resampling.LANCZOS)
    pixels = list(gray.get_flattened_data())
    value = 0
    for row in range(size):
        offset = row * (size + 1)
        for column in range(size):
            value = (value << 1) | (pixels[offset + column] > pixels[offset + column + 1])
    return value


def perceptual_hash(image: Image.Image, sample: int = 32, low: int = 8) -> int:
    """Encode low-frequency DCT coefficients without an external numeric dependency."""
    pixels = list(
        ImageOps.grayscale(image)
        .resize((sample, sample), Image.Resampling.LANCZOS)
        .get_flattened_data()
    )
    cosine = [
        [math.cos(math.pi * (2 * position + 1) * frequency / (2 * sample)) for position in range(sample)]
        for frequency in range(low)
    ]
    coefficients: list[float] = []
    for vertical in range(low):
        for horizontal in range(low):
            coefficient = 0.0
            for y in range(sample):
                row = y * sample
                y_factor = cosine[vertical][y]
                for x in range(sample):
                    coefficient += pixels[row + x] * cosine[horizontal][x] * y_factor
            coefficients.append(coefficient)

    # Exclude overall brightness (the DC term) when choosing the comparison threshold.
    threshold = median(coefficients[1:])
    value = 0
    for coefficient in coefficients:
        value = (value << 1) | (coefficient > threshold)
    return value


def gallery_crop(image: Image.Image, ratio: float = 724 / 270) -> Image.Image:
    """Return the centered object-cover crop used by the site's widest cards."""
    width, height = image.size
    current = width / height
    if current > ratio:
        crop_width = round(height * ratio)
        left = (width - crop_width) // 2
        return image.crop((left, 0, left + crop_width, height))
    crop_height = round(width / ratio)
    top = (height - crop_height) // 2
    return image.crop((0, top, width, top + crop_height))


def hamming(left: int, right: int) -> int:
    """Count differing bits between two integer hashes."""
    return (left ^ right).bit_count()


def successful_filenames(manifest: Path) -> list[str]:
    """Read only local JPEG rows that represent successful selections."""
    with manifest.open(newline="", encoding="utf-8-sig") as handle:
        return [
            row["filename"]
            for row in csv.DictReader(handle)
            if row["status"] in {"downloaded", "added"} and row["filename"].endswith(".jpg")
        ]


def main() -> int:
    """Hash every selected photo and print pairs that merit visual review."""
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", type=Path, default=Path("image-manifest.csv"))
    parser.add_argument("--photos", type=Path, default=Path("src/photos"))
    parser.add_argument("--threshold", type=int, default=12)
    args = parser.parse_args()

    hashes: dict[str, tuple[int, int, int, int]] = {}
    for filename in successful_filenames(args.manifest):
        with Image.open(args.photos / filename) as image:
            image.load()
            cropped = gallery_crop(image)
            hashes[filename] = (
                difference_hash(image),
                perceptual_hash(image),
                difference_hash(cropped),
                perceptual_hash(cropped),
            )

    candidates: list[tuple[int, str, str, tuple[int, int, int, int]]] = []
    names = sorted(hashes)
    for index, left_name in enumerate(names):
        for right_name in names[index + 1 :]:
            distances = tuple(hamming(left, right) for left, right in zip(hashes[left_name], hashes[right_name]))
            full_match = distances[0] <= args.threshold and distances[1] <= args.threshold
            crop_match = distances[2] <= args.threshold and distances[3] <= args.threshold
            if full_match or crop_match:
                candidates.append((min(distances[1], distances[3]), left_name, right_name, distances))

    for _, left_name, right_name, distances in sorted(candidates):
        print(f"{left_name} <> {right_name}: dHash/pHash full={distances[:2]} crop={distances[2:]}")
    print(f"Checked {len(names)} JPEGs; {len(candidates)} candidate pair(s) at threshold {args.threshold}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
