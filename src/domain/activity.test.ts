import { describe, expect, it } from 'vitest';

import type { Activity } from './activity';
import {
  activityMapUrl,
  activityPhotoUrl,
  activityPrimaryUrl,
  getActivityTreatment,
  isPlanAheadActivity,
  orderChapterItems,
  STANDARD_ACTIVITY_TREATMENTS,
} from './activity';

function activity(id: string, on?: string): Activity {
  // Tests only vary identity and schedule; all other required fields stay deliberately inert.
  return {
    id,
    ch: 'loud',
    name: id,
    blurb: `${id} description`,
    when: 'Any time',
    where: 'Dubai',
    cta: 'Learn more',
    photos: 1,
    ...(on ? { dated: { d: '1', m: 'JAN', w: 'MON', on } } : {}),
  };
}

describe('orderChapterItems', () => {
  it('keeps undated editorial ranking unchanged', () => {
    const source = [activity('first'), activity('second'), activity('third')];

    expect(orderChapterItems(source)).toEqual(source);
    expect(source.map(({ id }) => id)).toEqual(['first', 'second', 'third']);
  });

  it('sorts dates chronologically and interleaves them evenly', () => {
    const source = [
      activity('undated-1'),
      activity('april', '2026-04-01'),
      activity('undated-2'),
      activity('february', '2026-02-01'),
      activity('undated-3'),
      activity('undated-4'),
      activity('march', '2026-03-01'),
      activity('undated-5'),
    ];

    const ordered = orderChapterItems(source);

    expect(ordered.map(({ id }) => id)).toEqual([
      'undated-1',
      'february',
      'undated-2',
      'undated-3',
      'march',
      'undated-4',
      'april',
      'undated-5',
    ]);
    expect(ordered.flatMap((item, index) => (item.dated ? [index] : []))).toEqual([1, 4, 6]);
  });

  it('preserves source order for events sharing a date', () => {
    const ordered = orderChapterItems([
      activity('second-date-a', '2026-02-01'),
      activity('first-date', '2026-01-01'),
      activity('second-date-b', '2026-02-01'),
    ]);

    expect(ordered.map(({ id }) => id)).toEqual(['first-date', 'second-date-a', 'second-date-b']);
  });

  it('handles empty and all-dated collections', () => {
    expect(orderChapterItems([])).toEqual([]);
    expect(
      orderChapterItems([
        activity('later', '2026-08-02'),
        activity('earlier', '2026-08-01'),
      ]).map(({ id }) => id),
    ).toEqual(['earlier', 'later']);
  });
});

describe('isPlanAheadActivity', () => {
  it('includes both dated events and activities with explicit booking friction', () => {
    const dated = activity('dated', '2026-09-05');

    // The planning filter is intentionally broader than the separate Favorites booking group.
    expect(isPlanAheadActivity(dated)).toBe(true);
    expect(isPlanAheadActivity({ ahead: 'Reserve early' })).toBe(true);
    expect(isPlanAheadActivity({ ahead: 'Reserve early', dated: dated.dated })).toBe(true);
    expect(isPlanAheadActivity({})).toBe(false);
  });
});

describe('getActivityTreatment', () => {
  it('gives editorial treatments precedence over the standard rotation', () => {
    const dated = { d: '1', m: 'JAN', w: 'MON', on: '2026-01-01' };

    expect(getActivityTreatment({ ahead: 'Reserve early', dated, noPhoto: true })).toBe('dated');
    expect(getActivityTreatment({ dated, noPhoto: true })).toBe('dated');
    expect(getActivityTreatment({ noPhoto: true })).toBe('type');
  });

  it('cycles standard treatments safely in both directions', () => {
    expect(STANDARD_ACTIVITY_TREATMENTS.map((_, index) => getActivityTreatment({}, index))).toEqual(
      STANDARD_ACTIVITY_TREATMENTS,
    );
    expect(getActivityTreatment({}, STANDARD_ACTIVITY_TREATMENTS.length)).toBe('bleed');
    expect(getActivityTreatment({}, -1)).toBe('bite');
  });
});

describe('activity URL helpers', () => {
  it('builds deterministic, one-based photo paths', () => {
    expect(activityPhotoUrl('teamlab')).toBe('photos/teamlab-01.jpg');
    expect(activityPhotoUrl({ id: 'teamlab' }, 12)).toBe('photos/teamlab-12.jpg');
    expect(() => activityPhotoUrl('teamlab', 0)).toThrow(RangeError);
    expect(() => activityPhotoUrl('teamlab', 1.5)).toThrow(RangeError);
  });

  it('builds encoded map searches and falls back to Dubai', () => {
    expect(activityMapUrl({ name: 'The Nest by Nara', where: 'Al Marmoom Reserve' })).toBe(
      'https://www.google.com/maps/search/?api=1&query=The%20Nest%20by%20Nara%20Al%20Marmoom%20Reserve',
    );
    expect(activityMapUrl({ name: 'A boat at sunset' })).toBe(
      'https://www.google.com/maps/search/?api=1&query=A%20boat%20at%20sunset%20Dubai',
    );
  });

  it('prefers booking links before official sites', () => {
    expect(activityPrimaryUrl({ book: 'https://book.example', site: 'https://site.example' })).toBe(
      'https://book.example',
    );
    expect(activityPrimaryUrl({ site: 'https://site.example' })).toBe('https://site.example');
    expect(activityPrimaryUrl({})).toBeNull();
  });
});
