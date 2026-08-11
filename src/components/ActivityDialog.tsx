import { useId, useState, type MouseEvent } from 'react';

import {
  activityMapUrl,
  activityPhotoUrl,
  activityPrimaryUrl,
  type Activity,
} from '../domain/activity';
import { Modal } from './Modal';

export type ActivityDialogProps = {
  readonly activity: Activity;
  readonly fallbackFocusId?: string;
  readonly isFavorite: boolean;
  readonly onClose: () => void;
  readonly onToggleFavorite: (activityId: Activity['id']) => void;
};

type GalleryState = {
  readonly activityId: Activity['id'];
  readonly index: number;
};

export function ActivityDialog({
  activity,
  fallbackFocusId,
  isFavorite,
  onClose,
  onToggleFavorite,
}: ActivityDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const [gallery, setGallery] = useState<GalleryState>({ activityId: activity.id, index: 0 });
  const photoCount = Math.max(1, Math.trunc(activity.photos));
  // Keying local state by activity prevents a stale frame when an open dialog changes item.
  const photoIndex = gallery.activityId === activity.id ? gallery.index % photoCount : 0;
  const displayedPhotoNumber = photoIndex + 1;
  const nextPhotoNumber = ((photoIndex + 1) % photoCount) + 1;
  const primaryUrl = activityPrimaryUrl(activity);
  const calendarValue = activity.dated
    ? [activity.dated.w, activity.dated.d, activity.dated.m].join(' ')
    : null;
  const datedYear = activity.dated?.on.slice(0, 4);
  // Preserve editorial range/season tokens while making the trip year explicit in the sheet.
  const datedDisplay = calendarValue && datedYear && !calendarValue.includes(datedYear)
    ? `${calendarValue} · ${datedYear}`
    : calendarValue;

  const goToPhoto = (index: number) => {
    setGallery({ activityId: activity.id, index: index % photoCount });
  };

  const nextPhoto = () => {
    goToPhoto((photoIndex + 1) % photoCount);
  };

  return (
    <Modal
      backdropLabel="Dismiss activity details"
      backdropClassName="modal__backdrop--details"
      className="modal--details"
      descriptionId={descriptionId}
      fallbackFocusId={fallbackFocusId}
      labelId={titleId}
      onClose={onClose}
    >
      <div className="detail-sheet__panel" data-dialog-panel tabIndex={-1}>
        <div className="detail-sheet__inner">
          <div className="detail-sheet__toolbar">
            <span className="detail-sheet__toolbar-label">Activity details</span>
            <button
              aria-label="Close activity details"
              className="detail-sheet__close-x"
              onClick={onClose}
              type="button"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="detail-sheet__handle" />
          <div className="detail-sheet__media">
            <div className="media-placeholder media-placeholder--detail" />
            <button
              aria-label={`Advance to photo ${String(nextPhotoNumber)} of ${String(photoCount)}`}
              className="detail-sheet__advance"
              onClick={nextPhoto}
              type="button"
            >
              <img
                alt={`${activity.name}, photo ${String(displayedPhotoNumber)} of ${String(photoCount)}`}
                className="media-fill"
                decoding="async"
                src={activityPhotoUrl(activity, photoIndex + 1)}
              />
            </button>
            <button
              aria-label={`${isFavorite ? 'Remove' : 'Save'} ${activity.name} ${isFavorite ? 'from' : 'to'} favorites`}
              aria-pressed={isFavorite}
              className="favorite-button favorite-button--detail"
              onClick={(event: MouseEvent<HTMLButtonElement>) => {
                // This control overlays the gallery but must never advance it.
                event.stopPropagation();
                onToggleFavorite(activity.id);
              }}
              type="button"
            >
              <span aria-hidden="true">{isFavorite ? '♥' : '♡'}</span>
            </button>
          </div>

          <div className="detail-sheet__dots" role="group" aria-label="Activity photos">
            {Array.from({ length: photoCount }, (_, index) => (
              <button
                aria-current={index === photoIndex}
                aria-label={`Show photo ${String(index + 1)} of ${String(photoCount)}`}
                className="detail-sheet__dot"
                key={index}
                onClick={() => { goToPhoto(index); }}
                type="button"
              >
                <span />
              </button>
            ))}
          </div>
          <p className="detail-sheet__hint">Tap or click the photo for the next picture</p>

          <div className="detail-sheet__copy">
            {activity.eyebrow && <p className="detail-sheet__eyebrow">{activity.eyebrow}</p>}
            <h2 className="detail-sheet__title" id={titleId}>{activity.name}</h2>
            <p className="detail-sheet__blurb" id={descriptionId}>{activity.blurb}</p>
            <dl className="detail-sheet__facts">
              {datedDisplay && (
                <div className="detail-sheet__fact">
                  <dt className="detail-sheet__fact-label">Date</dt>
                  <dd className="detail-sheet__fact-value">{datedDisplay}</dd>
                </div>
              )}
              <div className="detail-sheet__fact">
                <dt className="detail-sheet__fact-label">When</dt>
                <dd className="detail-sheet__fact-value">{activity.when}</dd>
              </div>
              <div className="detail-sheet__fact">
                <dt className="detail-sheet__fact-label">Where</dt>
                <dd className="detail-sheet__fact-value">{activity.where}</dd>
              </div>
              {activity.facts?.map((fact) => (
                <div className="detail-sheet__fact" key={fact.label}>
                  <dt className="detail-sheet__fact-label">{fact.label}</dt>
                  <dd className="detail-sheet__fact-value">{fact.value}</dd>
                </div>
              ))}
              {activity.ahead && (
                <div className="detail-sheet__fact">
                  <dt className="detail-sheet__fact-label detail-sheet__fact-label--ahead">
                    Book ahead
                  </dt>
                  <dd className="detail-sheet__fact-value detail-sheet__fact-value--ahead">
                    {activity.ahead}
                  </dd>
                </div>
              )}
            </dl>

            {activity.advisory && (
              <aside className="detail-sheet__advisory">
                <p className="detail-sheet__advisory-label">Worth knowing</p>
                <p className="detail-sheet__advisory-copy">{activity.advisory}</p>
              </aside>
            )}

            <div className="detail-sheet__actions">
              {primaryUrl && (
                <a className="detail-sheet__primary" href={primaryUrl} rel="noopener" target="_blank">
                  {activity.cta}
                </a>
              )}
              {activity.book && activity.site && (
                <a
                  className="detail-sheet__secondary"
                  href={activity.site}
                  rel="noopener"
                  target="_blank"
                >
                  Site
                </a>
              )}
              <a
                aria-label={`Map for ${activity.name}`}
                className="icon-link icon-link--detail"
                href={activityMapUrl(activity)}
                rel="noopener"
                target="_blank"
              >
                <img
                  alt=""
                  className="icon-link__image icon-link__image--detail"
                  src="photos/icon-google-maps.svg"
                />
                <span aria-hidden="true" className="icon-link__fallback icon-link__fallback--detail">
                  MAP
                </span>
              </a>
              {activity.ig && (
                <a
                  aria-label={`Instagram for ${activity.name}`}
                  className="icon-link icon-link--detail"
                  href={activity.ig}
                  rel="noopener"
                  target="_blank"
                >
                  <img
                    alt=""
                    className="icon-link__image icon-link__image--detail"
                    src="photos/icon-instagram.svg"
                  />
                  <span
                    aria-hidden="true"
                    className="icon-link__fallback icon-link__fallback--detail"
                  >
                    IG
                  </span>
                </a>
              )}
              <button className="detail-sheet__close-text" onClick={onClose} type="button">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
