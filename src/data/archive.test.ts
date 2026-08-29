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

    expect(rejectedIds).toEqual([
      'thewall',
      'brunchandcake',
      'butterflygarden',
      'fashionavenue',
      'thepods',
    ]);
    expect(triedIds).toEqual(['meowtropolis', 'robertos', 'salmonguru']);
    expect(verifiedIds).toEqual([
      'boulderzone',
      'sohogarden',
      'bludubai',
      'brassmonkey',
      'amazonico',
      'tingirie',
    ]);
    expect(activeIds.has('thewall')).toBe(false);
    expect(activeIds.has('brunchandcake')).toBe(false);
    expect(activeIds.has('butterflygarden')).toBe(false);
    expect(activeIds.has('fashionavenue')).toBe(false);
    expect(activeIds.has('thepods')).toBe(false);
    expect(activeIds.has('meowtropolis')).toBe(false);
    expect(activeIds.has('robertos')).toBe(false);
    expect(activeIds.has('salmonguru')).toBe(false);
    expect(activeIds.has('boulderzone')).toBe(true);
    expect(activeIds.has('sohogarden')).toBe(true);
    expect(activeIds.has('bludubai')).toBe(true);
    expect(activeIds.has('brassmonkey')).toBe(true);
    expect(activeIds.has('amazonico')).toBe(true);
    expect(activeIds.has('tingirie')).toBe(true);
  });

  it('keeps firsthand nuance and distinguishes a pre-visit rejection', () => {
    const blu = ARCHIVE_ENTRIES.find(({ id }) => id === 'bludubai');
    const brassMonkey = ARCHIVE_ENTRIES.find(({ id }) => id === 'brassmonkey');
    const amazonico = ARCHIVE_ENTRIES.find(({ id }) => id === 'amazonico');
    const tingIrie = ARCHIVE_ENTRIES.find(({ id }) => id === 'tingirie');
    const fashionAvenue = ARCHIVE_ENTRIES.find(({ id }) => id === 'fashionavenue');
    const thePods = ARCHIVE_ENTRIES.find(({ id }) => id === 'thepods');

    expect(blu).toMatchObject({ recordedOn: '2026-08-27', status: 'verified' });
    expect(blu?.note).toMatch(/40th birthday/i);
    expect(blu?.note).toMatch(/night to remember/i);
    expect(blu?.note).toMatch(/space around the bar/i);
    expect(brassMonkey?.note).toMatch(/interactive game bar/i);
    expect(brassMonkey?.note).toMatch(/fun date/i);
    expect(amazonico?.note).toMatch(/best food of the Dubai trip so far/i);
    expect(tingIrie?.note).toMatch(/best Jamaican food ever tried/i);
    expect(fashionAvenue).toMatchObject({ status: 'rejected', originalChapterKey: 'wandering' });
    expect(fashionAvenue?.note).toMatch(/does not apply to every activity inside the mall/i);
    // A rejected record can preserve an explicit screening decision without inventing a visit.
    expect(thePods).toMatchObject({ status: 'rejected', originalChapterKey: 'dinners' });
    expect(thePods?.note).toMatch(/before a visit/i);
  });

  it('records the scope of the Soho Garden visit without claiming the other rooms were open', () => {
    const entry = ARCHIVE_ENTRIES.find(({ id }) => id === 'sohogarden');

    expect(entry).toMatchObject({
      name: 'Soho Garden, HIVE and CODE',
      originalChapterKey: 'loud',
      status: 'verified',
    });
    expect(entry?.note).toContain('Only SOHO Garden was open');
    expect(entry?.note).toContain('HIVE and CODE still untested');
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
    expect(ARCHIVE_ACTIVITY_DETAILS.find(({ id }) => id === 'thepods')?.photos).toBe(3);
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
