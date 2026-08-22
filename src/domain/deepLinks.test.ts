import { describe, expect, it } from 'vitest';

import {
  activityHash,
  archiveHash,
  chapterHash,
  creditsHash,
  everythingHash,
  parseDeepLink,
  type DeepLink,
} from './deepLinks';

const chapterKeys = new Set(['quiet', 'animals']);
const activityIds = new Set(['nest', 'rasalkhor']);

describe('deep-link fragments', () => {
  it('builds distinct native anchors for chapters, activity sheets, and global sheets', () => {
    expect(chapterHash('animals')).toBe('#animals');
    expect(activityHash('rasalkhor')).toBe('#activity-rasalkhor');
    expect(chapterHash('night markets')).toBe('#night%20markets');
    expect(activityHash('art & light')).toBe('#activity-art%20%26%20light');
    expect(archiveHash()).toBe('#archive');
    expect(creditsHash()).toBe('#credits');
    expect(everythingHash()).toBe('#everything');
  });

  it.each<[string, DeepLink]>([
    ['#animals', { type: 'chapter', chapterKey: 'animals' }],
    ['#activity-rasalkhor', { type: 'activity', activityId: 'rasalkhor' }],
    ['#activity-ras%61lkhor', { type: 'activity', activityId: 'rasalkhor' }],
    ['#archive', { type: 'archive' }],
    ['#credits', { type: 'credits' }],
    ['#everything', { type: 'everything' }],
  ])('parses the known fragment %s', (hash, expected) => {
    expect(parseDeepLink(hash, chapterKeys, activityIds)).toEqual(expected);
  });

  it.each([
    '',
    '#',
    'animals',
    '#unknown',
    '#activity-unknown',
    '#activity-',
    '#list=rasalkhor%2Cnest',
    '#activity-rasalkhor&list=nest',
    '#activity-%E0%A4%A',
  ])('ignores unsupported, unknown, or malformed fragment %s', (hash) => {
    expect(parseDeepLink(hash, chapterKeys, activityIds)).toBeNull();
  });

  it('validates exact IDs instead of accepting a prefix or case variant', () => {
    expect(parseDeepLink('#animal', chapterKeys, activityIds)).toBeNull();
    expect(parseDeepLink('#Animals', chapterKeys, activityIds)).toBeNull();
    expect(parseDeepLink('#activity-ras', chapterKeys, activityIds)).toBeNull();
    expect(parseDeepLink('#activity-RasAlKhor', chapterKeys, activityIds)).toBeNull();
  });
});
