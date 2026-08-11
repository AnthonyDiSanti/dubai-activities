import type { Activity } from './activity';

export type SharePayload = {
  readonly title: string;
  readonly url: string;
};

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
