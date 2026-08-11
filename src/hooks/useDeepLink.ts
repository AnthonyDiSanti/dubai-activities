import { useCallback, useEffect, useRef, useState } from 'react';

import type { ChapterKey } from '../domain/activity';
import {
  activityHash,
  chapterHash,
  parseDeepLink,
  type DeepLink,
} from '../domain/deepLinks';

const HISTORY_MARKER_KEY = '__naimaDeepLink';

type ActivityHistoryMarker = {
  readonly activityId: string;
  readonly type: 'activity';
};

type UseDeepLinkResult = {
  readonly closeActivity: (activityId: string, chapterKey: ChapterKey) => void;
  readonly deepLink: DeepLink | null;
  readonly navigateToActivity: (activityId: string) => void;
  readonly navigateToChapter: (chapterKey: ChapterKey) => void;
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
function activityHistoryMarker(): ActivityHistoryMarker | null {
  const marker = historyStateRecord()[HISTORY_MARKER_KEY];
  if (typeof marker !== 'object' || marker === null) return null;

  const candidate = marker as Partial<ActivityHistoryMarker>;
  return candidate.type === 'activity' && typeof candidate.activityId === 'string'
    ? { type: 'activity', activityId: candidate.activityId }
    : null;
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
    state[HISTORY_MARKER_KEY] = { type: 'activity', activityId } satisfies ActivityHistoryMarker;
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

  const closeActivity = useCallback((activityId: string, chapterKey: ChapterKey) => {
    const marker = activityHistoryMarker();
    if (marker?.activityId === activityId && window.location.hash === activityHash(activityId)) {
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

  return { closeActivity, deepLink, navigateToActivity, navigateToChapter };
}
