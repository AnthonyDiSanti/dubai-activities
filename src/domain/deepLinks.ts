const ACTIVITY_FRAGMENT_PREFIX = 'activity-';
const CREDITS_FRAGMENT = 'credits';

export type DeepLink =
  | { readonly type: 'chapter'; readonly chapterKey: string }
  | { readonly type: 'activity'; readonly activityId: string }
  | { readonly type: 'credits' };

/** Build the native fragment shared by chapter navigation and section IDs. */
export function chapterHash(chapterKey: string): string {
  return `#${encodeURIComponent(chapterKey)}`;
}

/** Namespace activity fragments so they cannot collide with chapter anchors. */
export function activityHash(activityId: string): string {
  return `#${ACTIVITY_FRAGMENT_PREFIX}${encodeURIComponent(activityId)}`;
}

/** Give the global credits sheet a stable, shareable fragment. */
export function creditsHash(): string {
  return `#${CREDITS_FRAGMENT}`;
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

  if (knownChapterKeys.has(fragment)) {
    return { type: 'chapter', chapterKey: fragment };
  }

  if (fragment === CREDITS_FRAGMENT) return { type: 'credits' };

  if (!fragment.startsWith(ACTIVITY_FRAGMENT_PREFIX)) return null;
  const activityId = fragment.slice(ACTIVITY_FRAGMENT_PREFIX.length);
  return knownActivityIds.has(activityId)
    ? { type: 'activity', activityId }
    : null;
}
