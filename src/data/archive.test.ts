import { describe, expect, it } from 'vitest';

import { ARCHIVE_ACTIVITY_DETAILS, ARCHIVE_ENTRIES } from './archive';
import { ITEMS } from './activities';

describe('firsthand activity outcomes', () => {
  it('keeps rejected and merely tried activities out while verified activities stay active', () => {
    const activeIds = new Set<string>(ITEMS.map(({ id }) => id));
    const rejectedIds = ARCHIVE_ENTRIES
      .filter(({ status }) => status === 'rejected')
      .map(({ id }) => id);
    const verifiedIds = ARCHIVE_ENTRIES
      .filter(({ status }) => status === 'verified')
      .map(({ id }) => id);
    const triedIds = ARCHIVE_ENTRIES
      .filter(({ status }) => status === 'tried')
      .map(({ id }) => id);

    expect(rejectedIds).toEqual(['thewall', 'brunchandcake', 'butterflygarden']);
    expect(triedIds).toEqual(['meowtropolis', 'robertos', 'salmonguru']);
    expect(verifiedIds).toEqual(['boulderzone']);
    expect(activeIds.has('thewall')).toBe(false);
    expect(activeIds.has('brunchandcake')).toBe(false);
    expect(activeIds.has('butterflygarden')).toBe(false);
    expect(activeIds.has('meowtropolis')).toBe(false);
    expect(activeIds.has('robertos')).toBe(false);
    expect(activeIds.has('salmonguru')).toBe(false);
    expect(activeIds.has('boulderzone')).toBe(true);
  });

  it('keeps every inactive outcome sheet-ready without duplicating the verified activity', () => {
    const inactiveIds = ARCHIVE_ENTRIES
      .filter(({ status }) => status !== 'verified')
      .map(({ id }) => id)
      .sort();
    const detailIds = ARCHIVE_ACTIVITY_DETAILS.map(({ id }) => id).sort();

    expect(detailIds).toEqual(inactiveIds);
    expect(ARCHIVE_ACTIVITY_DETAILS.every(({ photos }) => photos >= 2)).toBe(true);
    expect(ARCHIVE_ACTIVITY_DETAILS.find(({ id }) => id === 'robertos')?.photos).toBe(4);
    expect(ARCHIVE_ACTIVITY_DETAILS.find(({ id }) => id === 'meowtropolis')?.photos).toBe(4);
  });

  it('records the visited Brunch & Cake branch and the chain-wide rejection separately', () => {
    const entry = ARCHIVE_ENTRIES.find(({ id }) => id === 'brunchandcake');
    const detail = ARCHIVE_ACTIVITY_DETAILS.find(({ id }) => id === 'brunchandcake');

    expect(entry?.note).toContain('Jumeirah Islands');
    expect(entry?.note).toContain('entire Brunch & Cake chain');
    expect(detail?.where).toBe('Jumeirah Islands Pavilion');
    expect(detail?.site).toBe('https://brunchandcake.com/jumeirah-islands/');
  });
});
