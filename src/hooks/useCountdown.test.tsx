import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ARRIVAL_DATE_KEY, TRIP_TIME_ZONE } from '../config/site';
import { useCountdown } from './useCountdown';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('useCountdown', () => {
  it('updates after Dubai crosses into the day before arrival', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-14T19:59:45Z'));
    const { result } = renderHook(() => useCountdown(ARRIVAL_DATE_KEY, TRIP_TIME_ZONE));

    expect(result.current).toBe('2 days until I land');

    act(() => { vi.advanceTimersByTime(30_000); });

    expect(result.current).toBe('1 day until I land');
  });

  it('switches to the one-day reunion message at Dubai midnight', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-16T19:59:45Z'));
    const { result } = renderHook(() => useCountdown(ARRIVAL_DATE_KEY, TRIP_TIME_ZONE));

    expect(result.current).toBe('I land today');

    act(() => { vi.advanceTimersByTime(30_000); });

    expect(result.current).toBe("Tonight, it's you + me");
  });

  it('counts the next Dubai date as trip day 2', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-17T19:59:45Z'));
    const { result } = renderHook(() => useCountdown(ARRIVAL_DATE_KEY, TRIP_TIME_ZONE));

    expect(result.current).toBe("Tonight, it's you + me");

    act(() => { vi.advanceTimersByTime(30_000); });

    expect(result.current).toBe("I'm here — day 2");
  });
});
