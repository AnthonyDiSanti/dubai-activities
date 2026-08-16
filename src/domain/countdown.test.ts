import { describe, expect, it } from 'vitest';

import { ARRIVAL_DATE_KEY, TRIP_TIME_ZONE } from '../config/site';
import { formatArrivalCountdown } from './countdown';

describe('formatArrivalCountdown', () => {
  it.each([
    ['2026-08-13T00:00:00+04:00', '3 days until I land'],
    ['2026-08-13T20:00:00+04:00', '3 days until I land'],
    ['2026-08-13T12:00:00-04:00', '3 days until I land'],
    ['2026-08-14T23:59:59+04:00', '2 days until I land'],
    ['2026-08-15T00:00:00+04:00', '1 day until I land'],
    ['2026-08-15T23:59:59+04:00', '1 day until I land'],
    ['2026-08-16T00:00:00+04:00', 'I land today'],
    ['2026-08-16T23:59:59+04:00', 'I land today'],
    ['2026-08-17T00:00:00+04:00', "Tonight, it's you + me"],
    ['2026-08-17T23:59:59+04:00', "Tonight, it's you + me"],
    ['2026-08-18T00:00:00+04:00', "I'm here — day 2"],
    ['2026-08-19T00:00:00+04:00', "I'm here — day 3"],
  ])('formats %s as %s', (now, expected) => {
    expect(formatArrivalCountdown(new Date(now), ARRIVAL_DATE_KEY, TRIP_TIME_ZONE)).toBe(expected);
  });

  it('switches only when Dubai crosses a calendar-date boundary', () => {
    expect(formatArrivalCountdown(
      new Date('2026-08-14T19:59:59Z'),
      ARRIVAL_DATE_KEY,
      TRIP_TIME_ZONE,
    )).toBe('2 days until I land');
    expect(formatArrivalCountdown(
      new Date('2026-08-14T20:00:00Z'),
      ARRIVAL_DATE_KEY,
      TRIP_TIME_ZONE,
    )).toBe('1 day until I land');
  });

  it.each(['2026-02-30', 'August 16, 2026', ''])('rejects invalid date key %s', (dateKey) => {
    expect(() => formatArrivalCountdown(new Date(), dateKey, TRIP_TIME_ZONE)).toThrow(RangeError);
  });
});
