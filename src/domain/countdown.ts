const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;

/** Format the personal arrival note without ever producing the confusing "0 hours" state. */
export function formatArrivalCountdown(now: Date, arrival: Date): string {
  const difference = arrival.getTime() - now.getTime();

  if (difference > 0) {
    const days = Math.floor(difference / DAY_MS);
    if (days > 0) return `${String(days)} ${days === 1 ? 'day' : 'days'} until I land`;

    const hours = Math.floor(difference / HOUR_MS);
    if (hours > 0) {
      return `${String(hours)} ${hours === 1 ? 'hour' : 'hours'} until I land`;
    }
    return 'Less than an hour until I land';
  }

  const daysSinceArrival = Math.floor(-difference / DAY_MS);
  return daysSinceArrival < 1
    ? 'I land today'
    : `I'm here — day ${String(daysSinceArrival + 1)}`;
}
