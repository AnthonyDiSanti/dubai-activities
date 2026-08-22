import { memo, type MouseEvent } from 'react';

import type { Chapter, ChapterKey } from '../domain/activity';

type SharedChapterNavigationProps = {
  readonly chapters: readonly Chapter[];
  readonly currentChapterKey: ChapterKey | null;
  readonly onOpenAll: () => void;
  readonly onSelectChapter: (chapterKey: ChapterKey) => void;
  readonly openChapterKeys: ReadonlySet<ChapterKey>;
};

export type ChapterNavigationProps = SharedChapterNavigationProps & {
  readonly aheadOnly: boolean;
  readonly mobileOpen: boolean;
  readonly onCloseAll: () => void;
  readonly onToggleAhead: () => void;
  readonly onToggleMobile: () => void;
  readonly onToggleVerified: () => void;
  readonly verifiedOnly: boolean;
};

export type ChapterSidebarProps = SharedChapterNavigationProps;

const MOBILE_MENU_ID = 'chapter-navigation-menu';

function sectionId(chapterKey: ChapterKey): string {
  return chapterKey;
}

function handleChapterLinkClick(
  event: MouseEvent<HTMLAnchorElement>,
  chapterKey: ChapterKey,
  onSelectChapter: (chapterKey: ChapterKey) => void,
) {
  // Preserve native new-tab and copy-link behavior for modified or non-primary clicks.
  if (
    event.button !== 0 ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey
  ) return;

  event.preventDefault();
  onSelectChapter(chapterKey);
}

export const ChapterNavigation = memo(function ChapterNavigation({
  aheadOnly,
  chapters,
  currentChapterKey,
  mobileOpen,
  onCloseAll,
  onOpenAll,
  onSelectChapter,
  onToggleAhead,
  onToggleMobile,
  onToggleVerified,
  openChapterKeys,
  verifiedOnly,
}: ChapterNavigationProps) {
  const currentChapter = chapters.find(({ key }) => key === currentChapterKey) ?? chapters[0];

  return (
    <nav aria-label="Activity chapters" className="chapter-bar">
      <div className="chapter-bar__inner">
        <span className="chapter-bar__label">You&apos;re in</span>
        <span aria-live="polite" className="chapter-bar__current">{currentChapter?.name ?? ''}</span>
        <button
          aria-label={aheadOnly ? 'Show all activities' : 'Show only activities to book ahead'}
          aria-pressed={aheadOnly}
          className="chapter-bar__filter"
          onClick={onToggleAhead}
          type="button"
        >
          {aheadOnly ? '\u2715 Book ahead' : 'Book ahead'}
        </button>
        <button
          aria-label={verifiedOnly ? 'Show all activities' : 'Show only tried and liked activities'}
          aria-pressed={verifiedOnly}
          className="chapter-bar__filter chapter-bar__filter--verified"
          onClick={onToggleVerified}
          type="button"
        >
          {verifiedOnly ? '\u2715 Tried & liked' : '✓ Tried & liked'}
        </button>
        <button
          aria-controls={MOBILE_MENU_ID}
          aria-expanded={mobileOpen}
          className="chapter-bar__menu-button"
          onClick={onToggleMobile}
          type="button"
        >
          {mobileOpen ? '\u2715 Close' : '\u2630 Chapters'}
        </button>
      </div>
      {mobileOpen && (
        <div className="chapter-menu" id={MOBILE_MENU_ID}>
          {chapters.map((chapter) => {
            const open = openChapterKeys.has(chapter.key);
            return (
              <a
                aria-label={chapter.name}
                aria-controls={sectionId(chapter.key)}
                aria-current={chapter.key === currentChapterKey ? 'location' : undefined}
                aria-expanded={open}
                className="chapter-menu__row"
                href={`#${sectionId(chapter.key)}`}
                key={chapter.key}
                onClick={(event) => {
                  handleChapterLinkClick(event, chapter.key, onSelectChapter);
                }}
              >
                <span className="chapter-menu__name">{chapter.name}</span>
                <span className="chapter-menu__state">{open ? '' : 'Folded'}</span>
              </a>
            );
          })}
          <div className="chapter-menu__actions">
            <button
              className="pill-button pill-button--primary chapter-menu__open-all"
              onClick={onOpenAll}
              type="button"
            >
              Open everything
            </button>
            <button
              className="pill-button pill-button--secondary chapter-menu__close-all"
              onClick={onCloseAll}
              type="button"
            >
              Fold all
            </button>
          </div>
        </div>
      )}
    </nav>
  );
});

export const ChapterSidebar = memo(function ChapterSidebar({
  chapters,
  currentChapterKey,
  onOpenAll,
  onSelectChapter,
  openChapterKeys,
}: ChapterSidebarProps) {
  return (
    <aside className="chapter-sidebar">
      <nav aria-label="Activity chapters on this page">
        <p className="chapter-sidebar__label">Chapters</p>
        {chapters.map((chapter) => (
          <a
            aria-controls={sectionId(chapter.key)}
            aria-current={chapter.key === currentChapterKey ? 'location' : undefined}
            aria-expanded={openChapterKeys.has(chapter.key)}
            className="chapter-sidebar__item"
            href={`#${sectionId(chapter.key)}`}
            key={chapter.key}
            onClick={(event) => {
              handleChapterLinkClick(event, chapter.key, onSelectChapter);
            }}
          >
            {chapter.name}
          </a>
        ))}
        <button className="chapter-sidebar__open-all" onClick={onOpenAll} type="button">
          Open everything
        </button>
      </nav>
    </aside>
  );
});
