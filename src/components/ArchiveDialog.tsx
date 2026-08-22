import { useId, useMemo } from 'react';

import {
  formatArchiveDate,
  groupArchiveEntries,
  type ArchiveEntry,
  type ArchiveStatus,
} from '../domain/archive';
import { Modal } from './Modal';

export type ArchiveDialogProps = {
  readonly entries: readonly ArchiveEntry[];
  readonly onClose: () => void;
};

const GROUP_COPY: Readonly<Record<ArchiveStatus, Readonly<{
  description: string;
  title: string;
}>>> = {
  rejected: {
    description: 'Tried or deliberately ruled out. These stay recorded so they do not drift back into the guide.',
    title: 'Rejected',
  },
  verified: {
    description: 'Tried in person and liked. These stay in the live guide with a firsthand marker.',
    title: 'Tried & liked',
  },
};

const GROUP_ORDER = ['verified', 'rejected'] as const satisfies readonly ArchiveStatus[];

/** Expose deliberate outcomes without mixing them back into active recommendations. */
export function ArchiveDialog({ entries, onClose }: ArchiveDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const groups = useMemo(() => groupArchiveEntries(entries), [entries]);

  return (
    <Modal
      backdropLabel="Dismiss tried and decided"
      backdropClassName="modal__backdrop--archive"
      className="modal--archive"
      descriptionId={descriptionId}
      fallbackFocusId="archive-link"
      labelId={titleId}
      onClose={onClose}
    >
      <div className="reference-sheet archive-sheet" data-dialog-panel tabIndex={-1}>
        <div className="reference-sheet__inner">
          <div className="reference-sheet__toolbar">
            <span className="reference-sheet__toolbar-label">Firsthand notes</span>
            <button
              aria-label="Close tried and decided"
              className="reference-sheet__close-x"
              onClick={onClose}
              type="button"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="reference-sheet__handle" />
          <header className="reference-sheet__header">
            <p className="reference-sheet__eyebrow">What survived real life</p>
            <h2 className="reference-sheet__title" id={titleId}>Tried &amp; decided</h2>
            <p className="reference-sheet__intro" id={descriptionId}>
              Firsthand results belong here: what earned a verified place in the guide and what
              was ruled out. Rejected ideas stay recorded so they cannot quietly return.
            </p>
          </header>

          <dl className="archive-sheet__summary">
            <div>
              <dt>Rejected</dt>
              <dd>{groups.rejected.length}</dd>
            </div>
            <div>
              <dt>Tried &amp; liked</dt>
              <dd>{groups.verified.length}</dd>
            </div>
          </dl>

          <div className="archive-sheet__groups">
            {GROUP_ORDER.flatMap((status) => {
              const groupEntries = groups[status];
              if (groupEntries.length === 0) return [];
              const copy = GROUP_COPY[status];

              return [
                <section className={`archive-sheet__group archive-sheet__group--${status}`} key={status}>
                  <header className="archive-sheet__group-header">
                    <h3>{copy.title}</h3>
                    <p>{copy.description}</p>
                  </header>
                  <ul className="archive-sheet__entries">
                    {groupEntries.map((entry) => (
                      <li className="archive-sheet__entry" key={entry.id}>
                        <p className="archive-sheet__entry-meta">
                          {entry.originalChapterName} · {formatArchiveDate(entry.recordedOn)}
                        </p>
                        <h4>{entry.name}</h4>
                        <p className="archive-sheet__entry-note">{entry.note}</p>
                      </li>
                    ))}
                  </ul>
                </section>,
              ];
            })}
          </div>

          <button className="reference-sheet__close-text" onClick={onClose} type="button">
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
