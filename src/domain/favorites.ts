import type { Activity } from './activity';

export type SharePayload = {
  readonly title: string;
  readonly url: string;
};

export type FavoriteActivityGroups = {
  readonly dated: readonly Activity[];
  readonly bookAhead: readonly Activity[];
  readonly other: readonly Activity[];
};

/** Separate planning-sensitive favorites while retaining meaningful source order. */
export function groupFavoriteActivities(
  favorites: readonly Activity[],
): FavoriteActivityGroups {
  const dated = favorites
    .map((activity, sourceIndex) => ({ activity, sourceIndex }))
    .filter(
      (entry): entry is { activity: Activity & { dated: NonNullable<Activity['dated']> }; sourceIndex: number } =>
        Boolean(entry.activity.dated),
    )
    .sort(
      (left, right) =>
        left.activity.dated.on.localeCompare(right.activity.dated.on)
        || left.sourceIndex - right.sourceIndex,
    )
    .map(({ activity }) => activity);

  return {
    dated,
    // Dated activities appear once in the calendar group even when booking is also urgent.
    bookAhead: favorites.filter((activity) => !activity.dated && Boolean(activity.ahead)),
    other: favorites.filter((activity) => !activity.dated && !activity.ahead),
  };
}

/** Remove unknown and duplicate IDs before favorites can enter application state. */
export function sanitizeFavoriteIds(
  candidateIds: readonly unknown[],
  knownIds: ReadonlySet<string>,
): string[] {
  const seen = new Set<string>();

  return candidateIds.flatMap((candidate) => {
    if (typeof candidate !== 'string' || !knownIds.has(candidate) || seen.has(candidate)) {
      return [];
    }
    seen.add(candidate);
    return [candidate];
  });
}

/** Return null when the URL has no shared list, keeping local state authoritative. */
export function parseSharedFavoriteIds(
  hash: string,
  knownIds: ReadonlySet<string>,
): string[] | null {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const shared = params.get('list');
  if (shared === null) return null;
  return sanitizeFavoriteIds(shared.split(',').filter(Boolean), knownIds);
}

export function createFavoriteSharePayload(url: URL, favoriteIds: readonly string[]): SharePayload {
  const sharedUrl = new URL(url);
  sharedUrl.hash = new URLSearchParams({ list: favoriteIds.join(',') }).toString();
  return {
    title: 'Things I want to do',
    url: sharedUrl.toString(),
  };
}

export function formatFavoriteMessage(
  favoriteIds: readonly string[],
  activitiesById: ReadonlyMap<string, Activity>,
  chapterNames: ReadonlyMap<Activity['ch'], string>,
): string {
  const lines = favoriteIds.flatMap((id) => {
    const activity = activitiesById.get(id);
    if (!activity) return [];
    return [`• ${activity.name} — ${chapterNames.get(activity.ch) ?? ''}`];
  });

  return `Things I want to do:\n\n${lines.join('\n')}`;
}
