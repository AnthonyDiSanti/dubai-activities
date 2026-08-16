const DAY_MS = 86_400_000;

type CalendarDate = {
  readonly day: number;
  readonly month: number;
  readonly year: number;
};

function parseCalendarDate(dateKey: string): CalendarDate {
  // Reject rollover-prone Date parsing so configuration mistakes fail visibly.
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!match) throw new RangeError(`Invalid calendar date: ${dateKey}`);

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  if (
    utcDate.getUTCFullYear() !== year ||
    utcDate.getUTCMonth() + 1 !== month ||
    utcDate.getUTCDate() !== day
  ) throw new RangeError(`Invalid calendar date: ${dateKey}`);

  return { day, month, year };
}

function calendarDateInTimeZone(now: Date, timeZone: string): CalendarDate {
  // formatToParts keeps the visitor's system zone from changing the trip calendar.
  const parts = new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    timeZone,
    year: 'numeric',
  }).formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);

  return { day: value('day'), month: value('month'), year: value('year') };
}

function calendarDayNumber({ day, month, year }: CalendarDate): number {
  // UTC is only a stable ordinal here; elapsed hours never enter the calculation.
  return Math.trunc(Date.UTC(year, month - 1, day) / DAY_MS);
}

/** Format arrival copy by Dubai calendar dates rather than elapsed 24-hour blocks. */
export function formatArrivalCountdown(
  now: Date,
  arrivalDateKey: string,
  timeZone: string,
): string {
  const arrival = parseCalendarDate(arrivalDateKey);
  const today = calendarDateInTimeZone(now, timeZone);
  const days = calendarDayNumber(arrival) - calendarDayNumber(today);

  if (days > 1) return `${String(days)} days until I land`;
  if (days === 1) return '1 day until I land';
  if (days === 0) return 'I land today';
  // The first full Dubai day gets one personal message before trip-day numbering resumes.
  if (days === -1) return "Tonight, it's you + me";
  return `I'm here — day ${String(Math.abs(days))}`;
}
