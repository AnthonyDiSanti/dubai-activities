import { useCallback, useEffect, useRef, useState } from 'react';

import type { ChapterKey } from '../domain/activity';
import {
  activityHash,
  archiveHash,
  chapterHash,
  creditsHash,
  everythingHash,
  parseDeepLink,
  type DeepLink,
} from '../domain/deepLinks';

const HISTORY_MARKER_KEY = '__naimaDeepLink';
type GlobalSheetType = 'archive' | 'credits';

type DeepLinkHistoryMarker =
  | { readonly activityId: string; readonly type: 'activity' }
  | { readonly type: GlobalSheetType };

type UseDeepLinkResult = {
  readonly closeActivity: (activityId: string, chapterKey: ChapterKey) => void;
  readonly closeArchive: () => void;
  readonly closeCredits: () => void;
  readonly deepLink: DeepLink | null;
  readonly navigateToActivity: (activityId: string) => void;
  readonly navigateToArchive: () => void;
  readonly navigateToChapter: (chapterKey: ChapterKey) => void;
  readonly navigateToCredits: () => void;
  readonly navigateToEverything: () => void;
};

type DeepLinkChangeHandler = (deepLink: DeepLink | null) => void;

/** Compare normalized routes so duplicate browser events do not repeat UI transitions. */
function sameDeepLink(left: DeepLink | null, right: DeepLink | null): boolean {
  if (left?.type !== right?.type) return false;
  if (left?.type === 'activity' && right?.type === 'activity') {
    return left.activityId === right.activityId;
  }
  if (left?.type === 'chapter' && right?.type === 'chapter') {
    return left.chapterKey === right.chapterKey;
  }
  if (left?.type === 'archive' && right?.type === 'archive') return true;
  if (left?.type === 'credits' && right?.type === 'credits') return true;
  if (left?.type === 'everything' && right?.type === 'everything') return true;
  return left === null && right === null;
}

function currentDocumentUrl(hash: string): string {
  // Hash navigation must retain an S3 prefix and any campaign query string.
  return `${window.location.pathname}${window.location.search}${hash}`;
}

/** Clone only record-like history state so unrelated consumers retain their fields. */
function historyStateRecord(): Record<string, unknown> {
  const state: unknown = window.history.state;
  return typeof state === 'object' && state !== null && !Array.isArray(state)
    ? { ...state as Record<string, unknown> }
    : {};
}

/** Remove ownership when leaving an activity entry without disturbing other state. */
function historyStateWithoutMarker(): Record<string, unknown> {
  const state = historyStateRecord();
  Reflect.deleteProperty(state, HISTORY_MARKER_KEY);
  return state;
}

/** Read only the marker shape this guide owns; foreign history state is untrusted. */
function deepLinkHistoryMarker(): DeepLinkHistoryMarker | null {
  const marker = historyStateRecord()[HISTORY_MARKER_KEY];
  if (typeof marker !== 'object' || marker === null) return null;

  const candidate = marker as { readonly activityId?: unknown; readonly type?: unknown };
  if (candidate.type === 'activity' && typeof candidate.activityId === 'string') {
    return { type: 'activity', activityId: candidate.activityId };
  }
  if (candidate.type === 'archive' || candidate.type === 'credits') {
    return { type: candidate.type };
  }
  return null;
}

function globalSheetHash(type: GlobalSheetType): string {
  // Global sheets share history mechanics but retain readable, distinct fragments.
  return type === 'archive' ? archiveHash() : creditsHash();
}

/** Synchronize validated fragments with React state and native session history. */
export function useDeepLink(
  knownChapterKeys: ReadonlySet<string>,
  knownActivityIds: ReadonlySet<string>,
  onDeepLinkChange: DeepLinkChangeHandler,
): UseDeepLinkResult {
  const readLocation = useCallback(
    () => parseDeepLink(window.location.hash, knownChapterKeys, knownActivityIds),
    [knownActivityIds, knownChapterKeys],
  );
  const [deepLink, setDeepLink] = useState<DeepLink | null>(readLocation);
  const deepLinkRef = useRef(deepLink);

  const commitDeepLink = useCallback((next: DeepLink | null, notifyWhenUnchanged = false) => {
    const changed = !sameDeepLink(deepLinkRef.current, next);
    if (changed) {
      deepLinkRef.current = next;
      setDeepLink(next);
    }
    // Explicit selections may need to reapply chapter/filter state even at the same URL.
    if (changed || notifyWhenUnchanged) onDeepLinkChange(next);
  }, [onDeepLinkChange]);

  useEffect(() => {
    const synchronizeLocation = () => {
      const next = readLocation();
      // Browsers can emit both events for one fragment traversal; keep effects single-shot.
      commitDeepLink(next);
    };

    window.addEventListener('hashchange', synchronizeLocation);
    window.addEventListener('popstate', synchronizeLocation);
    return () => {
      window.removeEventListener('hashchange', synchronizeLocation);
      window.removeEventListener('popstate', synchronizeLocation);
    };
  }, [commitDeepLink, readLocation]);

  const navigateToActivity = useCallback((activityId: string) => {
    if (!knownActivityIds.has(activityId)) return;

    const next: DeepLink = { type: 'activity', activityId };
    const hash = activityHash(activityId);
    if (window.location.hash === hash) {
      commitDeepLink(next, true);
      return;
    }

    const state = historyStateWithoutMarker();
    state[HISTORY_MARKER_KEY] = { type: 'activity', activityId } satisfies DeepLinkHistoryMarker;
    window.history.pushState(state, '', currentDocumentUrl(hash));
    // pushState emits no location event, so update the route snapshot explicitly.
    commitDeepLink(next, true);
  }, [commitDeepLink, knownActivityIds]);

  const navigateToChapter = useCallback((chapterKey: ChapterKey) => {
    if (!knownChapterKeys.has(chapterKey)) return;

    const next: DeepLink = { type: 'chapter', chapterKey };
    const hash = chapterHash(chapterKey);
    const state = historyStateWithoutMarker();
    if (window.location.hash === hash) {
      window.history.replaceState(state, '', currentDocumentUrl(hash));
    } else {
      window.history.pushState(state, '', currentDocumentUrl(hash));
    }
    commitDeepLink(next, true);
  }, [commitDeepLink, knownChapterKeys]);

  const navigateToEverything = useCallback(() => {
    // An explicit route lets load and history traversal restore the all-chapters state.
    const next: DeepLink = { type: 'everything' };
    const hash = everythingHash();
    const state = historyStateWithoutMarker();
    if (window.location.hash === hash) {
      window.history.replaceState(state, '', currentDocumentUrl(hash));
    } else {
      window.history.pushState(state, '', currentDocumentUrl(hash));
    }
    commitDeepLink(next, true);
  }, [commitDeepLink]);

  const navigateToGlobalSheet = useCallback((type: GlobalSheetType) => {
    const next: DeepLink = type === 'archive' ? { type: 'archive' } : { type: 'credits' };
    const hash = globalSheetHash(type);
    if (window.location.hash === hash) {
      commitDeepLink(next, true);
      return;
    }

    const state = historyStateWithoutMarker();
    state[HISTORY_MARKER_KEY] = { type } satisfies DeepLinkHistoryMarker;
    window.history.pushState(state, '', currentDocumentUrl(hash));
    // pushState emits no location event, so the requested global sheet updates explicitly.
    commitDeepLink(next, true);
  }, [commitDeepLink]);
  const navigateToArchive = useCallback(
    () => navigateToGlobalSheet('archive'),
    [navigateToGlobalSheet],
  );
  const navigateToCredits = useCallback(
    () => navigateToGlobalSheet('credits'),
    [navigateToGlobalSheet],
  );

  const closeActivity = useCallback((activityId: string, chapterKey: ChapterKey) => {
    const marker = deepLinkHistoryMarker();
    if (
      marker?.type === 'activity'
      && marker.activityId === activityId
      && window.location.hash === activityHash(activityId)
    ) {
      // This entry was created in-page, so Back restores the exact prior URL and scroll state.
      commitDeepLink(null);
      window.history.back();
      return;
    }

    const next: DeepLink = { type: 'chapter', chapterKey };
    window.history.replaceState(
      historyStateWithoutMarker(),
      '',
      currentDocumentUrl(chapterHash(chapterKey)),
    );
    commitDeepLink(next, true);
  }, [commitDeepLink]);

  const closeGlobalSheet = useCallback((type: GlobalSheetType) => {
    const marker = deepLinkHistoryMarker();
    if (marker?.type === type && window.location.hash === globalSheetHash(type)) {
      commitDeepLink(null);
      window.history.back();
      return;
    }

    window.history.replaceState(historyStateWithoutMarker(), '', currentDocumentUrl(''));
    commitDeepLink(null, true);
  }, [commitDeepLink]);
  const closeArchive = useCallback(
    () => closeGlobalSheet('archive'),
    [closeGlobalSheet],
  );
  const closeCredits = useCallback(
    () => closeGlobalSheet('credits'),
    [closeGlobalSheet],
  );

  return {
    closeActivity,
    closeArchive,
    closeCredits,
    deepLink,
    navigateToActivity,
    navigateToArchive,
    navigateToChapter,
    navigateToCredits,
    navigateToEverything,
  };
}
