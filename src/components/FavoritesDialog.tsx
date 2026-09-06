import { useId, useMemo, useState, type MouseEvent } from 'react';

import { copyText } from '../browser/copyText';
import { activityPhotoUrl, type Activity, type Chapter } from '../domain/activity';
import { activityHash } from '../domain/deepLinks';
import {
  createFavoriteSharePayload,
  formatFavoriteMessage,
  groupFavoriteActivities,
} from '../domain/favorites';
import { CrossIcon } from './CrossIcon';
import { Modal } from './Modal';

export type FavoritesDialogProps = {
  readonly chapters: readonly Chapter[];
  readonly favorites: readonly Activity[];
  readonly onClose: () => void;
  readonly onOpenActivity: (activityId: Activity['id']) => void;
  readonly onToggleFavorite: (activityId: Activity['id']) => void;
};

type CopyState = {
  readonly favoriteKey: string;
  readonly status: 'idle' | 'success' | 'failure';
};

function supportsNativeShare(payload: ShareData): boolean {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') return false;

  // Some implementations expose canShare but throw for payloads they cannot inspect.
  try {
    return typeof navigator.canShare !== 'function' || navigator.canShare(payload);
  } catch {
    return false;
  }
}

function isShareCancellation(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

type FavoriteRowProps = {
  readonly chapterName: string;
  readonly favorite: Activity;
  readonly kind: 'book-ahead' | 'dated' | 'other';
  readonly onOpenActivity: FavoritesDialogProps['onOpenActivity'];
  readonly onToggleFavorite: FavoritesDialogProps['onToggleFavorite'];
};

function FavoriteRow({
  chapterName,
  favorite,
  kind,
  onOpenActivity,
  onToggleFavorite,
}: FavoriteRowProps) {
  const detail = kind === 'dated'
    ? favorite.when
    : favorite.ahead ?? favorite.where;

  return (
    <div className={`favorite-row favorite-row--${kind}`}>
      <a
        aria-label={`Open details for ${favorite.name}`}
        className="favorite-row__open"
        href={activityHash(favorite.id)}
        onClick={(event) => {
          // Keep copied links and new-tab gestures native; ordinary activation opens in-app.
          if (
            event.button !== 0
            || event.metaKey
            || event.ctrlKey
            || event.shiftKey
            || event.altKey
          ) return;
          event.preventDefault();
          onOpenActivity(favorite.id);
        }}
      >
        {favorite.dated ? (
          <time
            aria-label={`${favorite.dated.w} ${favorite.dated.d} ${favorite.dated.m} ${favorite.dated.on.slice(0, 4)}`}
            className="favorite-row__date"
            dateTime={favorite.dated.on}
          >
            <span className="favorite-row__date-weekday">{favorite.dated.w}</span>
            <span className="favorite-row__date-day">{favorite.dated.d}</span>
            <span className="favorite-row__date-month">{favorite.dated.m}</span>
          </time>
        ) : (
          <span className="favorite-row__thumb">
            <img alt="" className="media-fill" src={activityPhotoUrl(favorite)} />
          </span>
        )}
        <span className="favorite-row__copy">
          <span className="favorite-row__name">{favorite.name}</span>
          <span className="favorite-row__chapter">{chapterName}</span>
          <span className="favorite-row__detail">{detail}</span>
        </span>
      </a>
      <button
        aria-label={`Remove ${favorite.name} from favorites`}
        className="favorite-row__remove"
        onClick={(event: MouseEvent<HTMLButtonElement>) => {
          event.stopPropagation();
          onToggleFavorite(favorite.id);
        }}
        type="button"
      >
        <CrossIcon />
      </button>
    </div>
  );
}

type FavoriteGroupProps = {
  readonly chapterNames: ReadonlyMap<Activity['ch'], string>;
  readonly favorites: readonly Activity[];
  readonly headingId: string;
  readonly kind: FavoriteRowProps['kind'];
  readonly onOpenActivity: FavoritesDialogProps['onOpenActivity'];
  readonly onToggleFavorite: FavoritesDialogProps['onToggleFavorite'];
  readonly showHeading: boolean;
  readonly title: string;
};

function FavoriteGroup({
  chapterNames,
  favorites,
  headingId,
  kind,
  onOpenActivity,
  onToggleFavorite,
  showHeading,
  title,
}: FavoriteGroupProps) {
  if (favorites.length === 0) return null;

  return (
    <section
      aria-label={showHeading ? undefined : title}
      aria-labelledby={showHeading ? headingId : undefined}
      className={`favorites-group favorites-group--${kind}`}
    >
      {showHeading && (
        <div className="favorites-group__heading">
          <h3 id={headingId}>{title}</h3>
          <span aria-label={`${String(favorites.length)} saved`}>{favorites.length}</span>
        </div>
      )}
      <div className="favorites-group__items">
        {favorites.map((favorite) => (
          <FavoriteRow
            chapterName={chapterNames.get(favorite.ch) ?? ''}
            favorite={favorite}
            key={favorite.id}
            kind={kind}
            onOpenActivity={onOpenActivity}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </section>
  );
}

export function FavoritesDialog({
  chapters,
  favorites,
  onClose,
  onOpenActivity,
  onToggleFavorite,
}: FavoritesDialogProps) {
  const titleId = useId();
  const noteId = useId();
  const favoriteIds = favorites.map(({ id }) => id);
  const favoriteKey = favoriteIds.join('\u0000');
  const [copyState, setCopyState] = useState<CopyState>({ favoriteKey, status: 'idle' });
  const [shareFailed, setShareFailed] = useState(false);
  const copyStatus = copyState.favoriteKey === favoriteKey ? copyState.status : 'idle';
  const chapterNames = useMemo(
    () => new Map(chapters.map((chapter) => [chapter.key, chapter.name])),
    [chapters],
  );
  const groupedFavorites = useMemo(
    () => groupFavoriteActivities(favorites),
    [favorites],
  );
  const visibleGroupCount = [
    groupedFavorites.dated,
    groupedFavorites.bookAhead,
    groupedFavorites.other,
  ].filter((group) => group.length > 0).length;
  // Group labels add orientation only when there is another category to distinguish.
  const showGroupHeadings = visibleGroupCount > 1;
  const activitiesById = useMemo(
    () => new Map(favorites.map((activity) => [activity.id, activity])),
    [favorites],
  );
  const sharePayload = createFavoriteSharePayload(
    new URL(typeof window === 'undefined' ? 'https://example.invalid/' : window.location.href),
    favoriteIds,
  );
  const showNativeShare = supportsNativeShare(sharePayload);

  const handleCopy = async () => {
    const message = formatFavoriteMessage(favoriteIds, activitiesById, chapterNames);
    setCopyState({ favoriteKey, status: 'idle' });
    setShareFailed(false);
    try {
      await copyText(message);
      setCopyState({ favoriteKey, status: 'success' });
    } catch {
      setCopyState({ favoriteKey, status: 'failure' });
    }
  };

  const handleShare = async () => {
    if (!showNativeShare || typeof navigator.share !== 'function') return;
    setShareFailed(false);
    try {
      await navigator.share(sharePayload);
    } catch (error) {
      // User cancellation is expected; genuine handoff failures need an accessible recovery cue.
      if (!isShareCancellation(error)) setShareFailed(true);
    }
  };

  const copyLabel =
    copyStatus === 'success'
      ? 'Copied — now paste it to me'
      : copyStatus === 'failure'
        ? "Couldn't copy — try again"
        : 'Copy as a message';
  const statusMessage = shareFailed
    ? "Favorites couldn't be shared. Try copying them instead."
    : copyStatus === 'success'
      ? 'Favorites copied to the clipboard.'
      : copyStatus === 'failure'
        ? "Favorites couldn't be copied. Try again."
        : '';

  return (
    <Modal
      backdropLabel="Dismiss favorites"
      backdropClassName="modal__backdrop--favorites"
      className="modal--favorites"
      descriptionId={noteId}
      labelId={titleId}
      onClose={onClose}
    >
      <div className="favorites-sheet" data-dialog-panel tabIndex={-1}>
        <div className="sheet-handle sheet-handle--favorites" />
        <button
          aria-label="Close favorites"
          className="favorites-sheet__close"
          onClick={onClose}
          type="button"
        >
          <CrossIcon />
        </button>
        <h2 className="favorites-sheet__title" id={titleId}>The ones you want</h2>
        <p className="favorites-sheet__note" id={noteId}>
          {favorites.length > 0
            ? 'Saved on this phone only — nobody sees them until you send them.'
            : 'Saved on this phone only.'}
        </p>

        {favorites.length > 0 && (
          <div className="favorites-sheet__groups">
            <FavoriteGroup
              chapterNames={chapterNames}
              favorites={groupedFavorites.dated}
              headingId={`${titleId}-dated`}
              kind="dated"
              onOpenActivity={onOpenActivity}
              onToggleFavorite={onToggleFavorite}
              showHeading={showGroupHeadings}
              title="Dated events"
            />
            <FavoriteGroup
              chapterNames={chapterNames}
              favorites={groupedFavorites.bookAhead}
              headingId={`${titleId}-ahead`}
              kind="book-ahead"
              onOpenActivity={onOpenActivity}
              onToggleFavorite={onToggleFavorite}
              showHeading={showGroupHeadings}
              title="Book ahead"
            />
            <FavoriteGroup
              chapterNames={chapterNames}
              favorites={groupedFavorites.other}
              headingId={`${titleId}-other`}
              kind="other"
              onOpenActivity={onOpenActivity}
              onToggleFavorite={onToggleFavorite}
              showHeading={showGroupHeadings}
              title="Everything else"
            />
          </div>
        )}

        {favorites.length === 0 && (
          <p className="favorites-sheet__empty">
            Nothing saved yet. Tap the heart on anything you like the look of — it stays on this
            phone until you send it.
          </p>
        )}

        {favorites.length > 0 && (
          <div className="favorites-sheet__actions">
            <button
              className="pill-button pill-button--primary favorites-sheet__copy"
              onClick={handleCopy}
              type="button"
            >
              {copyLabel}
            </button>
            {showNativeShare && (
              <button
                aria-label="Share favorites"
                className="favorites-share"
                onClick={handleShare}
                type="button"
              >
                <svg aria-hidden="true" height="21" viewBox="0 0 24 24" width="21">
                  <path
                    d="M21 10.5 14 4v4.1C8.3 8.7 4.4 12 3 18c2.8-3.1 6.4-4.6 11-4.4v3.9l7-7Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
        <p aria-live="polite" className="visually-hidden" role="status">
          {statusMessage}
        </p>
      </div>
    </Modal>
  );
}
