import { describe, expect, it } from 'vitest';

import photoAttributionCatalog from '../../public/photo-attributions.json';
import { parsePhotoAttributionCatalog } from '../domain/photoAttribution';

describe('generated photo attribution catalog', () => {
  it('covers every deployed asset with the expected attribution mix', () => {
    const catalog = parsePhotoAttributionCatalog(
      photoAttributionCatalog,
    );
    const filenames = new Set(catalog.assets.map(({ filename }) => filename));
    const basisCounts = catalog.assets.reduce<Record<string, number>>((counts, asset) => {
      counts[asset.creditBasis] = (counts[asset.creditBasis] ?? 0) + 1;
      return counts;
    }, {});

    expect(catalog.assets).toHaveLength(451);
    expect(filenames.size).toBe(451);
    expect(basisCounts.creative_commons).toBe(54);
    expect(basisCounts.stock_license).toBe(8);
    expect(basisCounts.public_domain).toBe(2);
    expect(basisCounts.trademark).toBe(2);
    expect(basisCounts.creator_credit).toBe(15);
    expect(basisCounts.source_credit).toBe(370);

    // New venue galleries must retain their named source instead of a generic host fallback.
    expect(catalog.assets.find(({ filename }) => filename === 'brassmonkey-01.jpg')?.source.name).toBe(
      'Brass Monkey via City Walk',
    );
    expect(catalog.assets.find(({ filename }) => filename === 'triple777-01.jpg')?.source.name).toBe(
      'Triple 777 Dubai',
    );
    expect(catalog.assets.find(({ filename }) => filename === 'amazonico-01.jpg')?.source.name).toBe(
      'Amazónico Dubai',
    );
    expect(catalog.assets.find(({ filename }) => filename === 'tingirie-01.jpg')?.source.name).toBe(
      'Ting Irie',
    );
    expect(catalog.assets.find(({ filename }) => filename === 'bludubai-01.jpg')?.source.name).toBe(
      'BLU Dubai',
    );
    expect(catalog.assets.find(({ filename }) => filename === 'amritsr-01.jpg')?.source.name).toBe(
      'Amritsr UAE',
    );
    expect(catalog.assets.find(({ filename }) => filename === 'amritsr-02.jpg')?.source.name).toBe(
      'Amritsr',
    );
    expect(catalog.assets.find(({ filename }) => filename === 'nammos-01.jpg')?.source.name).toBe(
      'Four Seasons Resort Dubai at Jumeirah Beach',
    );

    const hero = catalog.assets.find(({ filename }) => filename === 'rasalkhor-01.jpg');
    expect(hero?.creator?.name).toBe('Florian Kriechbaumer');
    expect(hero?.license?.name).toBe('CC BY-SA 4.0');
    expect(hero?.modifications).toBeTruthy();
  });

});
