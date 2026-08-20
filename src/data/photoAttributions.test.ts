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

    expect(catalog.assets).toHaveLength(407);
    expect(filenames.size).toBe(407);
    expect(basisCounts.creative_commons).toBe(54);
    expect(basisCounts.stock_license).toBe(8);
    expect(basisCounts.public_domain).toBe(2);
    expect(basisCounts.trademark).toBe(2);
    expect(basisCounts.creator_credit).toBe(15);
    expect(basisCounts.source_credit).toBe(326);

    const hero = catalog.assets.find(({ filename }) => filename === 'rasalkhor-01.jpg');
    expect(hero?.creator?.name).toBe('Florian Kriechbaumer');
    expect(hero?.license?.name).toBe('CC BY-SA 4.0');
    expect(hero?.modifications).toBeTruthy();
  });

});
