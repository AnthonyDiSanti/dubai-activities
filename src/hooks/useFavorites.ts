import { useCallback, useEffect, useState } from 'react';

import { parseSharedFavoriteIds, sanitizeFavoriteIds } from '../domain/favorites';

const STORAGE_KEY = 'dubai-activities.favs.v1';

function parseStoredFavorites(value: string | null, knownIds: ReadonlySet<string>): string[] {
  try {
    const parsed: unknown = JSON.parse(value ?? '[]');
    return Array.isArray(parsed) ? sanitizeFavoriteIds(parsed, knownIds) : [];
  } catch {
    return [];
  }
}

function readStoredFavorites(knownIds: ReadonlySet<string>): string[] {
  try {
    return parseStoredFavorites(window.localStorage.getItem(STORAGE_KEY), knownIds);
  } catch {
    return [];
  }
}

export function useFavorites(knownIds: ReadonlySet<string>) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const shared = parseSharedFavoriteIds(window.location.hash, knownIds);
    return shared ?? readStoredFavorites(knownIds);
  });

  // Shared lists become the recipient's local list after validation.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Storage can be unavailable in private or constrained browsing contexts.
    }
  }, [favorites]);

  useEffect(() => {
    const synchronizeTabs = (event: StorageEvent) => {
      // Storage events originate in other tabs, keeping this tab's insertion order coherent.
      if (event.key === STORAGE_KEY) {
        setFavorites(parseStoredFavorites(event.newValue, knownIds));
      }
    };
    window.addEventListener('storage', synchronizeTabs);
    return () => window.removeEventListener('storage', synchronizeTabs);
  }, [knownIds]);

  const toggleFavorite = useCallback(
    (activityId: string) => {
      if (!knownIds.has(activityId)) return;
      setFavorites((current) =>
        current.includes(activityId)
          ? current.filter((favoriteId) => favoriteId !== activityId)
          : [...current, activityId],
      );
    },
    [knownIds],
  );

  return { favorites, toggleFavorite } as const;
}
