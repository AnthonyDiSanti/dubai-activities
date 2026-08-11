import { useEffect, useMemo, useState, type FocusEvent, type MouseEvent } from 'react';

import { activityPhotoUrl, type Activity, type Chapter } from '../domain/activity';
import { activityHash } from '../domain/deepLinks';

export type HeroCarouselProps = {
  readonly activeIndex: number;
  readonly autoRotate: boolean;
  readonly chapters: readonly Chapter[];
  readonly isFavorite: (activityId: Activity['id']) => boolean;
  readonly items: readonly Activity[];
  readonly onActiveIndexChange: (index: number) => void;
  readonly onOpen: (activityId: Activity['id']) => void;
  readonly onToggleFavorite: (activityId: Activity['id']) => void;
  readonly reducedMotion: boolean;
  readonly rotationIntervalMs?: number;
};

const DEFAULT_ROTATION_INTERVAL_MS = 7_000;

function handleActivityLinkClick(
  event: MouseEvent<HTMLAnchorElement>,
  activityId: Activity['id'],
  onOpen: HeroCarouselProps['onOpen'],
) {
  // Keep browser-native copy/new-tab behavior while routing ordinary activation in-page.
  if (
    event.button !== 0 ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey
  ) return;

  event.preventDefault();
  onOpen(activityId);
}

function normalizeIndex(index: number, itemCount: number): number {
  if (itemCount === 0) return 0;
  return ((Math.trunc(index) % itemCount) + itemCount) % itemCount;
}

export function HeroCarousel({
  activeIndex,
  autoRotate,
  chapters,
  isFavorite,
  items,
  onActiveIndexChange,
  onOpen,
  onToggleFavorite,
  reducedMotion,
  rotationIntervalMs = DEFAULT_ROTATION_INTERVAL_MS,
}: HeroCarouselProps) {
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [pointerInside, setPointerInside] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  const normalizedIndex = normalizeIndex(activeIndex, items.length);
  const activeItem = items[normalizedIndex];
  const chapterNames = useMemo(
    () => new Map(chapters.map((chapter) => [chapter.key, chapter.name])),
    [chapters],
  );
  const interactionPaused = pointerInside || focusInside;
  const rotationPaused = !autoRotate || reducedMotion || manuallyPaused || interactionPaused;

  useEffect(() => {
    if (rotationPaused || items.length < 2) return;

    const intervalId = window.setInterval(() => {
      onActiveIndexChange((normalizedIndex + 1) % items.length);
    }, rotationIntervalMs);
    return () => window.clearInterval(intervalId);
  }, [items.length, normalizedIndex, onActiveIndexChange, rotationIntervalMs, rotationPaused]);

  if (!activeItem) return null;

  const favorite = isFavorite(activeItem.id);
  const slideId = 'hero-active-slide';

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    // Moving between controls inside the carousel must not briefly restart its timer.
    if (!event.currentTarget.contains(event.relatedTarget)) setFocusInside(false);
  };

  return (
    <section
      aria-label="Featured activities"
      aria-roledescription="carousel"
      className="hero"
      onBlurCapture={handleBlur}
      onFocusCapture={() => setFocusInside(true)}
      onMouseEnter={() => setPointerInside(true)}
      onMouseLeave={() => setPointerInside(false)}
    >
      <div aria-live={rotationPaused ? 'polite' : 'off'}>
        <article
          aria-label={`${String(normalizedIndex + 1)} of ${String(items.length)}`}
          aria-roledescription="slide"
          className="hero__slide"
          id={slideId}
          role="group"
        >
          <div className="media-placeholder" />
          <img
            alt=""
            className="media-fill"
            decoding="async"
            fetchPriority="high"
            src={activityPhotoUrl(activeItem)}
          />
          <div className="hero__shade" />
          <button
            aria-label={`${favorite ? 'Remove' : 'Save'} ${activeItem.name} ${favorite ? 'from' : 'to'} favorites`}
            aria-pressed={favorite}
            className="favorite-button favorite-button--hero"
            onClick={() => onToggleFavorite(activeItem.id)}
            type="button"
          >
            <span aria-hidden="true">{favorite ? '\u2665' : '\u2661'}</span>
          </button>
          <div className="hero__copy">
            <p className="hero__kicker">{chapterNames.get(activeItem.ch) ?? ''}</p>
            <h2 className="hero__title">{activeItem.name}</h2>
            <p className="hero__blurb">{activeItem.blurb}</p>
            <div className="action-row action-row--hero">
              <a
                className="pill-button pill-button--primary pill-button--hero"
                href={activityHash(activeItem.id)}
                onClick={(event) => {
                  handleActivityLinkClick(event, activeItem.id, onOpen);
                }}
              >
                {activeItem.cta}
              </a>
              <a
                className="pill-button pill-button--secondary pill-button--hero"
                href={activityHash(activeItem.id)}
                onClick={(event) => {
                  handleActivityLinkClick(event, activeItem.id, onOpen);
                }}
              >
                More
              </a>
            </div>
          </div>
        </article>
      </div>
      <nav aria-label="Choose featured activity" className="hero-pills">
        {items.map((item, index) => (
          <button
            aria-controls={slideId}
            aria-current={index === normalizedIndex ? 'true' : undefined}
            className="hero-pills__button"
            key={item.id}
            onClick={() => onActiveIndexChange(index)}
            type="button"
          >
            {item.name}
          </button>
        ))}
        {items.length > 1 && (
          <button
            aria-pressed={manuallyPaused || reducedMotion}
            className="hero-pills__button"
            disabled={reducedMotion}
            onClick={() => setManuallyPaused((paused) => !paused)}
            type="button"
          >
            {reducedMotion
              ? 'Slideshow paused'
              : manuallyPaused ? 'Resume slideshow' : 'Pause slideshow'}
          </button>
        )}
      </nav>
    </section>
  );
}
