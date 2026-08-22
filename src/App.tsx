import { useCallback, useEffect, useMemo, useState, type MouseEvent } from 'react';

import { ActivityDialog } from './components/ActivityDialog';
import { ArchiveDialog } from './components/ArchiveDialog';
import { ArrivalBar } from './components/ArrivalBar';
import {
  ChapterNavigation,
  ChapterSidebar,
} from './components/ChapterNavigation';
import { ChapterSection } from './components/ChapterSection';
import { CreditsDialog } from './components/CreditsDialog';
import { FavoritesDialog } from './components/FavoritesDialog';
import { HeroCarousel } from './components/HeroCarousel';
import { ARRIVAL_DATE_KEY, TRIP_TIME_ZONE } from './config/site';
import { CHAPTERS, HERO, ITEMS } from './data/activities';
import { ARCHIVE_ENTRIES } from './data/archive';
import type { Activity, ChapterKey } from './domain/activity';
import { parseDeepLink, type DeepLink } from './domain/deepLinks';
import { useCountdown } from './hooks/useCountdown';
import { useCurrentChapter } from './hooks/useCurrentChapter';
import { useDeepLink } from './hooks/useDeepLink';
import { useFavorites } from './hooks/useFavorites';
import { usePhotoAttributions } from './hooks/usePhotoAttributions';
import { useReducedMotion } from './hooks/useReducedMotion';

const ALL_CHAPTER_KEYS = CHAPTERS.map(({ key }) => key);
const ACTIVITIES: readonly Activity[] = ITEMS;
const DEFAULT_CHAPTER_KEY: ChapterKey = 'loud';

function LiveArrivalBar() {
  // Keep the clock's 30-second updates outside the full activity-card application tree.
  const countdown = useCountdown(ARRIVAL_DATE_KEY, TRIP_TIME_ZONE);
  return <ArrivalBar countdown={countdown} />;
}

function openFooterSheet(event: MouseEvent<HTMLAnchorElement>, navigate: () => void) {
  // Leave modified clicks and copied links native while ordinary activation stays history-aware.
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  navigate();
}

export function App() {
  const activitiesById = useMemo(
    () => new Map<string, Activity>(ACTIVITIES.map((item) => [item.id, item])),
    [],
  );
  const knownActivityIds = useMemo(() => new Set(ACTIVITIES.map(({ id }) => id)), []);
  const knownChapterKeys = useMemo(() => new Set(CHAPTERS.map(({ key }) => key)), []);
  const initialDeepLink = useMemo(
    () => parseDeepLink(window.location.hash, knownChapterKeys, knownActivityIds),
    [knownActivityIds, knownChapterKeys],
  );
  const { favorites, toggleFavorite } = useFavorites(knownActivityIds);
  const favoriteIds = useMemo(() => new Set(favorites), [favorites]);
  const verifiedActivityIds = useMemo(
    () => new Set<string>(
      ARCHIVE_ENTRIES.filter(({ status }) => status === 'verified').map(({ id }) => id),
    ),
    [],
  );
  const [openChapterKeys, setOpenChapterKeys] = useState<ReadonlySet<ChapterKey>>(
    () => {
      // Resolve the initial fragment synchronously so routed content never starts folded.
      if (initialDeepLink?.type === 'activity') {
        const activity = activitiesById.get(initialDeepLink.activityId);
        return activity ? new Set([activity.ch]) : new Set(ALL_CHAPTER_KEYS);
      }
      if (initialDeepLink?.type === 'chapter') {
        const chapter = CHAPTERS.find(({ key }) => key === initialDeepLink.chapterKey);
        return chapter ? new Set([chapter.key]) : new Set(ALL_CHAPTER_KEYS);
      }
      return new Set(ALL_CHAPTER_KEYS);
    },
  );
  const [heroIndex, setHeroIndex] = useState(0);
  const [chapterMenuOpen, setChapterMenuOpen] = useState(false);
  const [aheadOnly, setAheadOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  const synchronizeDeepLinkState = useCallback((next: DeepLink | null) => {
    if (!next) return;

    setAheadOnly(false);
    setVerifiedOnly(false);
    setChapterMenuOpen(false);
    setFavoritesOpen(false);
    if (next.type === 'activity') {
      const activity = activitiesById.get(next.activityId);
      if (!activity) return;
      setOpenChapterKeys((current) => {
        if (current.has(activity.ch)) return current;
        return new Set([...current, activity.ch]);
      });
      return;
    }

    if (next.type === 'everything') {
      setOpenChapterKeys(new Set(ALL_CHAPTER_KEYS));
      return;
    }

    if (next.type === 'archive' || next.type === 'credits') return;

    const chapter = CHAPTERS.find(({ key }) => key === next.chapterKey);
    if (chapter) setOpenChapterKeys(new Set([chapter.key]));
  }, [activitiesById]);
  const {
    closeActivity,
    closeArchive,
    closeCredits,
    deepLink,
    navigateToActivity,
    navigateToArchive,
    navigateToChapter,
    navigateToCredits,
    navigateToEverything,
  } = useDeepLink(knownChapterKeys, knownActivityIds, synchronizeDeepLinkState);

  const chapterModels = useMemo(
    () =>
      CHAPTERS.flatMap((chapter) => {
        const filtered = ACTIVITIES.filter(
          (item) =>
            item.ch === chapter.key
            && (!aheadOnly || Boolean(item.ahead))
            && (!verifiedOnly || verifiedActivityIds.has(item.id)),
        );
        return filtered.length > 0
          ? [{ chapter, items: filtered }]
          : [];
      }),
    [aheadOnly, verifiedActivityIds, verifiedOnly],
  );
  const visibleChapters = useMemo(
    () => chapterModels.map(({ chapter }) => chapter),
    [chapterModels],
  );
  const currentChapterName = useCurrentChapter(visibleChapters);
  const currentChapterKey =
    visibleChapters.find(({ name }) => name === currentChapterName)?.key ??
    visibleChapters[0]?.key ??
    DEFAULT_CHAPTER_KEY;
  const heroItems = useMemo(
    () => HERO.flatMap((id) => {
      const activity = activitiesById.get(id);
      return activity ? [activity] : [];
    }),
    [activitiesById],
  );
  const favoriteActivities = useMemo(
    () => favorites.flatMap((id) => {
      const activity = activitiesById.get(id);
      return activity ? [activity] : [];
    }),
    [activitiesById, favorites],
  );
  const activeActivity = deepLink?.type === 'activity'
    ? activitiesById.get(deepLink.activityId) ?? null
    : null;
  const archiveOpen = deepLink?.type === 'archive';
  const creditsOpen = deepLink?.type === 'credits';
  const photoAttributions = usePhotoAttributions(creditsOpen);

  useEffect(() => {
    if (deepLink?.type !== 'chapter') return;

    const chapter = CHAPTERS.find(({ key }) => key === deepLink.chapterKey);
    if (!chapter) return;

    const frameId = window.requestAnimationFrame(() => {
      // React must reveal the routed section before the browser can align its anchor.
      document.getElementById(chapter.key)?.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [activitiesById, deepLink, reducedMotion]);

  useEffect(() => {
    if (!chapterMenuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setChapterMenuOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [chapterMenuOpen]);

  const openActivity = useCallback((activityId: Activity['id']) => {
    navigateToActivity(activityId);
  }, [navigateToActivity]);

  const toggleChapter = useCallback((chapterKey: ChapterKey) => {
    setOpenChapterKeys((current) => {
      const next = new Set(current);
      if (next.has(chapterKey)) next.delete(chapterKey);
      else next.add(chapterKey);
      return next;
    });
  }, []);

  const selectChapter = useCallback(
    (chapterKey: ChapterKey) => {
      setChapterMenuOpen(false);
      navigateToChapter(chapterKey);
      window.requestAnimationFrame(() => {
        // Re-selecting the current URL should still return to its visible section.
        document.getElementById(chapterKey)?.scrollIntoView({
          behavior: reducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      });
    },
    [navigateToChapter, reducedMotion],
  );

  const setAllChapters = useCallback((open: boolean) => {
    setOpenChapterKeys(open ? new Set(ALL_CHAPTER_KEYS) : new Set());
    setChapterMenuOpen(false);
  }, []);
  const revealAllChapters = useCallback(() => setAllChapters(true), [setAllChapters]);
  const openAllChapters = useCallback(() => {
    // #everything makes the all-open state restorable through load and history traversal.
    revealAllChapters();
    navigateToEverything();
  }, [navigateToEverything, revealAllChapters]);
  const closeAllChapters = useCallback(() => setAllChapters(false), [setAllChapters]);
  const toggleAheadOnly = useCallback(() => {
    // A new planning view must reveal its results instead of inheriting collapsed sections.
    revealAllChapters();
    setVerifiedOnly(false);
    setAheadOnly((current) => !current);
  }, [revealAllChapters]);
  const toggleVerifiedOnly = useCallback(() => {
    revealAllChapters();
    setAheadOnly(false);
    setVerifiedOnly((current) => !current);
  }, [revealAllChapters]);
  const toggleChapterMenu = useCallback(
    () => setChapterMenuOpen((current) => !current),
    [],
  );

  const navigationProps = {
    aheadOnly,
    chapters: visibleChapters,
    currentChapterKey,
    mobileOpen: chapterMenuOpen,
    onCloseAll: closeAllChapters,
    onOpenAll: openAllChapters,
    onSelectChapter: selectChapter,
    onToggleAhead: toggleAheadOnly,
    onToggleMobile: toggleChapterMenu,
    onToggleVerified: toggleVerifiedOnly,
    openChapterKeys,
    verifiedOnly,
  } as const;

  return (
    <div className="page">
      <h1 className="visually-hidden">For Naima</h1>
      <LiveArrivalBar />
      <HeroCarousel
        activeIndex={heroIndex}
        autoRotate={!favoritesOpen && activeActivity === null && !archiveOpen && !creditsOpen}
        chapters={CHAPTERS}
        isFavorite={(activityId) => favoriteIds.has(activityId)}
        items={heroItems}
        onActiveIndexChange={setHeroIndex}
        onOpen={openActivity}
        onToggleFavorite={toggleFavorite}
        reducedMotion={reducedMotion}
      />
      <ChapterNavigation {...navigationProps} />

      <div className="page-layout">
        <ChapterSidebar {...navigationProps} />
        <main className="activity-main">
          {chapterModels.map(({ chapter, items }) => (
            <ChapterSection
              chapter={chapter}
              favoriteIds={favoriteIds}
              items={items}
              key={chapter.key}
              onOpenActivity={openActivity}
              onToggle={toggleChapter}
              onToggleFavorite={toggleFavorite}
              open={openChapterKeys.has(chapter.key)}
              verifiedIds={verifiedActivityIds}
            />
          ))}
          <footer className="site-footer">
            <p className="site-signoff">
              Everything here was worth writing down. Nothing here is a plan.
              <br />— A.
            </p>
            <nav aria-label="Guide records" className="site-footer__links">
              <a
                className="site-footer__link"
                href="#archive"
                id="archive-link"
                onClick={(event) => openFooterSheet(event, navigateToArchive)}
              >
                Tried &amp; decided
              </a>
              <a
                className="site-footer__link"
                href="#credits"
                id="photo-credits-link"
                onClick={(event) => openFooterSheet(event, navigateToCredits)}
              >
                Photo credits
              </a>
            </nav>
          </footer>
        </main>
      </div>

      <button
        aria-label={`Open favorites, ${String(favorites.length)} saved`}
        className="floating-favorites"
        onClick={() => setFavoritesOpen(true)}
        type="button"
      >
        <span aria-hidden="true">♥</span> {favorites.length}
      </button>

      {favoritesOpen && (
        <FavoritesDialog
          chapters={CHAPTERS}
          favorites={favoriteActivities}
          onClose={() => setFavoritesOpen(false)}
          onOpenActivity={openActivity}
          onToggleFavorite={toggleFavorite}
        />
      )}
      {activeActivity && (
        <ActivityDialog
          activity={activeActivity}
          fallbackFocusId={`${activeActivity.ch}-toggle`}
          isFavorite={favoriteIds.has(activeActivity.id)}
          isVerified={verifiedActivityIds.has(activeActivity.id)}
          onClose={() => closeActivity(activeActivity.id, activeActivity.ch)}
          onToggleFavorite={toggleFavorite}
        />
      )}
      {archiveOpen && (
        <ArchiveDialog entries={ARCHIVE_ENTRIES} onClose={closeArchive} />
      )}
      {creditsOpen && (
        <CreditsDialog
          catalog={photoAttributions.catalog}
          onClose={closeCredits}
          onRetry={photoAttributions.retry}
          status={photoAttributions.status}
        />
      )}
    </div>
  );
}
