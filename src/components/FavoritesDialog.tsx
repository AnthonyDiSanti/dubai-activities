import { useId, useMemo, useState, type MouseEvent } from 'react';

import { copyText } from '../browser/copyText';
import { activityPhotoUrl, type Activity, type Chapter } from '../domain/activity';
import { createFavoriteSharePayload, formatFavoriteMessage } from '../domain/favorites';
import { Modal } from './Modal';

export type FavoritesDialogProps = {
  readonly chapters: readonly Chapter[];
  readonly favorites: readonly Activity[];
  readonly onClose: () => void;
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

export function FavoritesDialog({
  chapters,
  favorites,
  onClose,
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
          <span aria-hidden="true">×</span>
        </button>
        <h2 className="favorites-sheet__title" id={titleId}>The ones you want</h2>
        <p className="favorites-sheet__note" id={noteId}>
          {favorites.length > 0
            ? 'Saved on this phone only — nobody sees them until you send them.'
            : 'Saved on this phone only.'}
        </p>

        {favorites.map((favorite) => (
          <div className="favorite-row" key={favorite.id}>
            <div className="favorite-row__thumb">
              <img alt="" className="media-fill" src={activityPhotoUrl(favorite)} />
            </div>
            <div className="favorite-row__copy">
              <p className="favorite-row__name">{favorite.name}</p>
              <p className="favorite-row__chapter">{chapterNames.get(favorite.ch)}</p>
            </div>
            <button
              aria-label={`Remove ${favorite.name} from favorites`}
              className="favorite-row__remove"
              onClick={(event: MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation();
                onToggleFavorite(favorite.id);
              }}
              type="button"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        ))}

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
