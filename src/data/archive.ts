import type { ArchiveEntry } from '../domain/archive';

/** Record deliberate exclusions separately from the live recommendation catalogue. */
export const ARCHIVE_ENTRIES = [
  {
    id: 'thewall',
    name: 'The Wall',
    note: 'Checked in person. The experience did not clear the bar, so it is out of the live guide.',
    originalChapterName: 'Something to get good at',
    recordedOn: '2026-08-22',
    status: 'rejected',
  },
  {
    id: 'boulderzone',
    name: 'Boulder Zone',
    note: 'Tried in person and genuinely enjoyed. This one earned its place among the proven choices.',
    originalChapterName: 'Something to get good at',
    recordedOn: '2026-08-22',
    status: 'verified',
  },
] as const satisfies readonly ArchiveEntry[];
