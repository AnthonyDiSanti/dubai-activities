import { describe, expect, it } from 'vitest';

import { formatArrivalCountdown } from './countdown';

const arrival = new Date('2026-08-16T00:00:00+04:00');

describe('formatArrivalCountdown', () => {
  it.each([
    ['2026-08-13T00:00:00+04:00', '3 days until I land'],
    ['2026-08-15T00:00:00+04:00', '1 day until I land'],
    ['2026-08-15T21:00:00+04:00', '3 hours until I land'],
    ['2026-08-15T23:00:00+04:00', '1 hour until I land'],
    ['2026-08-15T23:45:00+04:00', 'Less than an hour until I land'],
    ['2026-08-16T00:00:00+04:00', 'I land today'],
    ['2026-08-17T00:00:00+04:00', "I'm here — day 2"],
  ])('formats %s as %s', (now, expected) => {
    expect(formatArrivalCountdown(new Date(now), arrival)).toBe(expected);
  });
});

