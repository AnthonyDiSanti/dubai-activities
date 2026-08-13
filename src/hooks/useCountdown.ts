import { useEffect, useState } from 'react';

import { formatArrivalCountdown } from '../domain/countdown';

const UPDATE_INTERVAL_MS = 30_000;

export function useCountdown(arrivalDateKey: string, timeZone: string): string {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    // Minute-level copy does not justify waking the page on every second.
    const timer = window.setInterval(() => setNow(new Date()), UPDATE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, []);

  return formatArrivalCountdown(now, arrivalDateKey, timeZone);
}
