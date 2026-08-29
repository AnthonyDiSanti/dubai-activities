import type { ArchiveStatus } from './archive';

const ACTIVITY_FRAGMENT_PREFIX = 'activity-';
const ARCHIVE_FRAGMENT = 'archive';
const ARCHIVE_FRAGMENT_PREFIX = `${ARCHIVE_FRAGMENT}-`;
const ARCHIVE_STATUSES: readonly ArchiveStatus[] = ['verified', 'tried', 'rejected'];
const CREDITS_FRAGMENT = 'credits';
const EVERYTHING_FRAGMENT = 'everything';

/** Reject invented archive suffixes while preserving a narrowed status type. */
function isArchiveStatus(value: string): value is ArchiveStatus {
  return ARCHIVE_STATUSES.some((status) => status === value);
}

export type DeepLink =
  | { readonly type: 'chapter'; readonly chapterKey: string }
  | { readonly type: 'activity'; readonly activityId: string }
  | { readonly status?: ArchiveStatus; readonly type: 'archive' }
  | { readonly type: 'credits' }
  | { readonly type: 'everything' };

/** Build the native fragment shared by chapter navigation and section IDs. */
export function chapterHash(chapterKey: string): string {
  return `#${encodeURIComponent(chapterKey)}`;
}

/** Namespace activity fragments so they cannot collide with chapter anchors. */
export function activityHash(activityId: string): string {
  return `#${ACTIVITY_FRAGMENT_PREFIX}${encodeURIComponent(activityId)}`;
}

/** Give the archive and each outcome group stable, shareable fragments. */
export function archiveHash(status?: ArchiveStatus): string {
  return status
    ? `#${ARCHIVE_FRAGMENT_PREFIX}${status}`
    : `#${ARCHIVE_FRAGMENT}`;
}

/** Give the global credits sheet a stable, shareable fragment. */
export function creditsHash(): string {
  return `#${CREDITS_FRAGMENT}`;
}

/** Represent the all-chapters state explicitly so history traversal can restore it. */
export function everythingHash(): string {
  return `#${EVERYTHING_FRAGMENT}`;
}

/** Parse only exact, known application fragments; shared-list hashes remain independent. */
export function parseDeepLink(
  hash: string,
  knownChapterKeys: ReadonlySet<string>,
  knownActivityIds: ReadonlySet<string>,
): DeepLink | null {
  if (!hash.startsWith('#') || hash.length === 1) return null;

  let fragment: string;
  try {
    // Invalid percent escapes must not prevent the guide from rendering.
    fragment = decodeURIComponent(hash.slice(1));
  } catch {
    return null;
  }

  if (fragment === ARCHIVE_FRAGMENT) return { type: 'archive' };
  if (fragment.startsWith(ARCHIVE_FRAGMENT_PREFIX)) {
    const status = fragment.slice(ARCHIVE_FRAGMENT_PREFIX.length);
    if (isArchiveStatus(status)) return { type: 'archive', status };
    return null;
  }
  if (fragment === CREDITS_FRAGMENT) return { type: 'credits' };
  if (fragment === EVERYTHING_FRAGMENT) return { type: 'everything' };

  if (knownChapterKeys.has(fragment)) {
    return { type: 'chapter', chapterKey: fragment };
  }

  if (!fragment.startsWith(ACTIVITY_FRAGMENT_PREFIX)) return null;
  const activityId = fragment.slice(ACTIVITY_FRAGMENT_PREFIX.length);
  return knownActivityIds.has(activityId)
    ? { type: 'activity', activityId }
    : null;
}
