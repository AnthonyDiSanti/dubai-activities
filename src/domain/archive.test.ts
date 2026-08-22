import { describe, expect, it } from 'vitest';

import type { ArchiveEntry } from './archive';
import { formatArchiveDate, groupArchiveEntries } from './archive';

const entries: readonly ArchiveEntry[] = [
  {
    id: 'rejected-one',
    name: 'Rejected one',
    note: 'Not worth returning to.',
    originalChapterName: 'Original chapter',
    recordedOn: '2026-08-22',
    status: 'rejected',
  },
  {
    id: 'verified-one',
    name: 'Verified one',
    note: 'Earned a return visit.',
    originalChapterName: 'Original chapter',
    recordedOn: '2026-08-21',
    status: 'verified',
  },
  {
    id: 'rejected-two',
    name: 'Rejected two',
    note: 'Ruled out deliberately.',
    originalChapterName: 'Original chapter',
    recordedOn: '2026-08-20',
    status: 'rejected',
  },
];

describe('archive domain', () => {
  it('groups outcomes without disturbing their editorial order', () => {
    const groups = groupArchiveEntries(entries);

    expect(groups.rejected.map(({ id }) => id)).toEqual(['rejected-one', 'rejected-two']);
    expect(groups.verified.map(({ id }) => id)).toEqual(['verified-one']);
  });

  it('formats date-only keys without shifting them through the viewer timezone', () => {
    expect(formatArchiveDate('2026-08-22')).toBe('22 Aug 2026');
    expect(formatArchiveDate('not-a-date')).toBe('not-a-date');
    expect(formatArchiveDate('2026-02-31')).toBe('2026-02-31');
  });
});
