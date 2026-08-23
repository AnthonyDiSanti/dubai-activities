import { useId, useMemo, useState } from 'react';

import { getActivityTreatment, type Activity } from '../domain/activity';
import {
  groupArchiveEntries,
  type ArchiveEntry,
  type ArchiveStatus,
} from '../domain/archive';
import { ActivityCard } from './ActivityCard';
import { Modal } from './Modal';

export type ArchiveDialogProps = {
  readonly entries: readonly ArchiveEntry[];
  readonly onClose: () => void;
  readonly onOpenActivity: (activityId: Activity['id']) => void;
  readonly activities: readonly Activity[];
};

const GROUP_COPY: Readonly<Record<ArchiveStatus, Readonly<{
  description: string;
  title: string;
}>>> = {
  rejected: {
    description: 'Tried or deliberately ruled out. These stay recorded so they do not drift back into the guide.',
    title: 'Rejected',
  },
  tried: {
    description: 'Tried in person. Perfectly fine, but not strong enough to recommend in the live guide.',
    title: 'Tried',
  },
  verified: {
    description: 'Tried in person and liked. These stay in the live guide with a firsthand marker.',
    title: 'Tried & liked',
  },
};

const GROUP_ORDER = ['verified', 'tried', 'rejected'] as const satisfies readonly ArchiveStatus[];

/** Expose deliberate outcomes without mixing them back into active recommendations. */
export function ArchiveDialog({ activities, entries, onClose, onOpenActivity }: ArchiveDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const groups = useMemo(() => groupArchiveEntries(entries), [entries]);
  const activitiesById = useMemo(
    () => new Map(activities.map((activity) => [activity.id, activity])),
    [activities],
  );
  const [openStatuses, setOpenStatuses] = useState<ReadonlySet<ArchiveStatus>>(
    () => new Set(GROUP_ORDER),
  );

  const toggleStatus = (status: ArchiveStatus) => {
    // Keep outcome groups independent so the archive behaves like the main accordion.
    setOpenStatuses((current) => {
      const next = new Set(current);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  };

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
              Firsthand results belong here: what earned a verified place, what was merely okay,
              and what was ruled out. Nothing quietly returns to the guide later.
            </p>
          </header>

          <dl className="archive-sheet__summary">
            <div>
              <dt>Tried &amp; liked</dt>
              <dd>{groups.verified.length}</dd>
            </div>
            <div>
              <dt>Tried</dt>
              <dd>{groups.tried.length}</dd>
            </div>
            <div>
              <dt>Rejected</dt>
              <dd>{groups.rejected.length}</dd>
            </div>
          </dl>

          <div className="archive-sheet__groups">
            {GROUP_ORDER.flatMap((status) => {
              const groupEntries = groups[status];
              if (groupEntries.length === 0) return [];
              const copy = GROUP_COPY[status];
              const open = openStatuses.has(status);
              const activitiesId = `archive-${status}-activities`;
              const headingId = `archive-${status}-heading`;

              return [
                <section
                  aria-labelledby={headingId}
                  className={`chapter archive-sheet__group archive-sheet__group--${status}`}
                  key={status}
                >
                  <div className="chapter__header archive-sheet__group-header">
                    <h3 className="chapter__title" id={headingId}>
                      <button
                        aria-controls={activitiesId}
                        aria-expanded={open}
                        className="chapter__toggle"
                        onClick={() => toggleStatus(status)}
                        type="button"
                      >
                        <span>
                          <span className="chapter__toggle-label">{copy.title}</span>
                          <span className="archive-sheet__group-description">{copy.description}</span>
                        </span>
                        <span aria-hidden="true" className="chapter__toggle-icon">
                          {open ? '\u25BE' : '\u25B8'}
                        </span>
                      </button>
                    </h3>
                  </div>
                  <div className="chapter__activities" hidden={!open} id={activitiesId}>
                    {open && groupEntries.flatMap((entry, index) => {
                      const activity = activitiesById.get(entry.id);
                      if (!activity) return [];

                      return [
                        <ActivityCard
                          anchorId={`archive-activity-${entry.id}`}
                          favoriteEnabled={false}
                          isFavorite={false}
                          isVerified={status === 'verified'}
                          item={activity}
                          key={entry.id}
                          onOpen={onOpenActivity}
                          onToggleFavorite={() => undefined}
                          treatment={getActivityTreatment(activity, index)}
                        />,
                      ];
                    })}
                  </div>
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
