import { describe, expect, it } from 'vitest';

import {
  formatPhotoSlots,
  groupPhotoAttributions,
  parsePhotoAttributionCatalog,
  type PhotoAttribution,
} from './photoAttribution';

function attribution(overrides: Partial<PhotoAttribution> = {}): PhotoAttribution {
  return {
    filename: 'rasalkhor-01.jpg',
    activityId: 'rasalkhor',
    activityName: 'Ras Al Khor Wildlife Sanctuary',
    chapterName: 'Fur, feathers and scales',
    slot: 1,
    workTitle: null,
    creator: null,
    source: { name: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/example' },
    license: null,
    creditBasis: 'source_credit',
    modifications: 'Resized for web display.',
    creditText: 'Ras Al Khor Wildlife Sanctuary — photo 1, via Wikimedia Commons.',
    ...overrides,
  };
}

describe('photo attribution data', () => {
  it('validates the generated browser boundary', () => {
    const asset = attribution();

    expect(parsePhotoAttributionCatalog({ schemaVersion: 1, assets: [asset] }))
      .toEqual({ schemaVersion: 1, assets: [asset] });
    expect(() => parsePhotoAttributionCatalog({ schemaVersion: 2, assets: [] })).toThrow(
      'unsupported schema',
    );
    expect(() => parsePhotoAttributionCatalog({ schemaVersion: 1, assets: [{ slot: 0 }] }))
      .toThrow();
    expect(() => parsePhotoAttributionCatalog({
      schemaVersion: 1,
      assets: [{ ...asset, creditBasis: 'permission_assumed' }],
    })).toThrow('credit basis is invalid');
  });

  it('groups matching photo credits without merging distinct licenses', () => {
    const first = attribution();
    const second = attribution({
      filename: 'rasalkhor-02.jpg',
      slot: 2,
      creditText: 'Ras Al Khor Wildlife Sanctuary — photo 2, via Wikimedia Commons.',
    });
    const third = attribution({
      filename: 'rasalkhor-03.jpg',
      slot: 3,
      license: { name: 'CC BY-SA 4.0', url: 'https://creativecommons.org/licenses/by-sa/4.0/' },
    });

    const groups = groupPhotoAttributions([first, second, third]);

    expect(groups).toHaveLength(1);
    expect(groups[0]?.activities[0]?.lines).toHaveLength(2);
    expect(groups[0]?.activities[0]?.lines[0]?.filenames).toEqual([
      'rasalkhor-01.jpg',
      'rasalkhor-02.jpg',
    ]);
    expect(groups[0]?.activities[0]?.lines[0]?.slots).toEqual([1, 2]);
  });

  it('formats individual, ranged, and interface-mark labels', () => {
    expect(formatPhotoSlots([2])).toBe('Photo 2');
    expect(formatPhotoSlots([3, 1, 2, 5])).toBe('Photos 1–3, 5');
    expect(formatPhotoSlots([])).toBe('Mark');
  });
});
