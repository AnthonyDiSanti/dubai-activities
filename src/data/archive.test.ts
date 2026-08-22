import { describe, expect, it } from 'vitest';

import { ARCHIVE_ENTRIES } from './archive';
import { ITEMS } from './activities';

describe('firsthand activity outcomes', () => {
  it('keeps rejected activities out and verified activities in the active guide', () => {
    const activeIds = new Set<string>(ITEMS.map(({ id }) => id));
    const rejectedIds = ARCHIVE_ENTRIES
      .filter(({ status }) => status === 'rejected')
      .map(({ id }) => id);
    const verifiedIds = ARCHIVE_ENTRIES
      .filter(({ status }) => status === 'verified')
      .map(({ id }) => id);

    expect(rejectedIds).toEqual(['thewall']);
    expect(verifiedIds).toEqual(['boulderzone']);
    expect(activeIds.has('thewall')).toBe(false);
    expect(activeIds.has('boulderzone')).toBe(true);
  });
});
