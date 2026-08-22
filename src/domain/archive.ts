export type ArchiveStatus = 'rejected' | 'verified';

export type ArchiveEntry = Readonly<{
  id: string;
  name: string;
  note: string;
  originalChapterName: string;
  recordedOn: string;
  status: ArchiveStatus;
}>;

export type ArchiveGroups = Readonly<{
  rejected: readonly ArchiveEntry[];
  verified: readonly ArchiveEntry[];
}>;

/** Keep archive ordering editorial while separating the two durable outcomes. */
export function groupArchiveEntries(entries: readonly ArchiveEntry[]): ArchiveGroups {
  const rejected: ArchiveEntry[] = [];
  const verified: ArchiveEntry[] = [];
  for (const entry of entries) {
    if (entry.status === 'rejected') rejected.push(entry);
    else verified.push(entry);
  }
  return { rejected, verified };
}

/** Render a date-only archive key without allowing the viewer timezone to shift its day. */
export function formatArchiveDate(dateKey: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return dateKey;
  const date = new Date(`${dateKey}T00:00:00Z`);
  // Date normalizes impossible values, so round-trip before presenting the result.
  if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== dateKey) return dateKey;

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(date);
}
