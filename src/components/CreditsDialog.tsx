import { useId, useMemo } from 'react';

import {
  formatPhotoSlots,
  groupPhotoAttributions,
  type AttributionLine,
  type PhotoAttributionCatalog,
} from '../domain/photoAttribution';
import type { PhotoAttributionState } from '../hooks/usePhotoAttributions';
import { Modal } from './Modal';

export type CreditsDialogProps = {
  readonly catalog: PhotoAttributionCatalog | null;
  readonly onClose: () => void;
  readonly onRetry: () => void;
  readonly status: PhotoAttributionState['status'];
};

function CreditLine({ line }: { readonly line: AttributionLine }) {
  return (
    <li className="credits-sheet__credit">
      <span className="credits-sheet__slots">{formatPhotoSlots(line.slots)}</span>
      <span>
        {line.workTitle && <><cite>{line.workTitle}</cite>{' · '}</>}
        {line.creator && (
          <>
            By{' '}
            {line.creator.url ? (
              <a href={line.creator.url} rel="noopener" target="_blank">{line.creator.name}</a>
            ) : line.creator.name}
            {' · '}
          </>
        )}
        Via{' '}
        <a href={line.source.url} rel="noopener" target="_blank">{line.source.name}</a>
        {line.license && (
          <>
            {' · '}
            {line.license.url ? (
              <a href={line.license.url} rel="noopener" target="_blank">{line.license.name}</a>
            ) : line.license.name}
          </>
        )}
        {line.modifications && <> · {line.modifications}</>}
      </span>
    </li>
  );
}

/** Present every deployed asset in manifest order without hiding incomplete creator data. */
export function CreditsDialog({ catalog, onClose, onRetry, status }: CreditsDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const groups = useMemo(
    () => groupPhotoAttributions(catalog?.assets ?? []),
    [catalog],
  );

  return (
    <Modal
      backdropLabel="Dismiss photo credits"
      backdropClassName="modal__backdrop--credits"
      className="modal--credits"
      descriptionId={descriptionId}
      fallbackFocusId="photo-credits-link"
      labelId={titleId}
      onClose={onClose}
    >
      <div className="credits-sheet" data-dialog-panel tabIndex={-1}>
        <div className="credits-sheet__inner">
          <div className="credits-sheet__toolbar">
            <span className="credits-sheet__toolbar-label">Photography</span>
            <button
              aria-label="Close photo credits"
              className="credits-sheet__close-x"
              onClick={onClose}
              type="button"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="credits-sheet__handle" />
          <header className="credits-sheet__header">
            <p className="credits-sheet__eyebrow">The people behind the pictures</p>
            <h2 className="credits-sheet__title" id={titleId}>Photo credits</h2>
            <p className="credits-sheet__intro" id={descriptionId}>
              Creators are named wherever they could be identified. Otherwise, the original
              venue, publisher, or source is credited without implying permission or endorsement.
            </p>
          </header>

          {(status === 'idle' || status === 'loading') && (
            <p aria-live="polite" className="credits-sheet__status">Loading credits…</p>
          )}
          {status === 'error' && (
            <div className="credits-sheet__status" role="alert">
              <p>The photo credits could not be loaded.</p>
              <button className="pill-button pill-button--primary" onClick={onRetry} type="button">
                Try again
              </button>
            </div>
          )}
          {status === 'ready' && (
            <div className="credits-sheet__list">
              {groups.map((chapter) => (
                <section className="credits-sheet__chapter" key={chapter.chapterName}>
                  <h3 className="credits-sheet__chapter-title">{chapter.chapterName}</h3>
                  {chapter.activities.map((activity) => (
                    <section
                      className="credits-sheet__activity"
                      key={activity.activityId ?? activity.activityName}
                    >
                      <h4 className="credits-sheet__activity-title">{activity.activityName}</h4>
                      <ul className="credits-sheet__credits">
                        {activity.lines.map((line) => (
                          <CreditLine key={line.filenames.join('|')} line={line} />
                        ))}
                      </ul>
                    </section>
                  ))}
                </section>
              ))}
            </div>
          )}

          <button className="credits-sheet__close-text" onClick={onClose} type="button">
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
