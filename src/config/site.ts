/** Keep the local calendar key separate so freshness checks never cross a UTC date boundary. */
export const ARRIVAL_DATE_KEY = '2026-08-16';
export const ARRIVAL_DATE = new Date(`${ARRIVAL_DATE_KEY}T00:00:00+04:00`);
