import { useEffect, useId, useMemo, useState, type MouseEvent } from 'react';

import { getActivityTreatment, type Activity } from '../domain/activity';
import {
  groupArchiveEntries,
  type ArchiveEntry,
  type ArchiveStatus,
} from '../domain/archive';
import { archiveHash } from '../domain/deepLinks';
import { ActivityCard } from './ActivityCard';
import { CrossIcon } from './CrossIcon';
import { Modal } from './Modal';

export type ArchiveDialogProps = {
  readonly activeStatus?: ArchiveStatus;
  readonly entries: readonly ArchiveEntry[];
  readonly onClose: () => void;
  readonly onOpenActivity: (activityId: Activity['id']) => void;
  readonly onSelectStatus: (status: ArchiveStatus) => void;
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
export function ArchiveDialog({
  activeStatus,
  activities,
  entries,
  onClose,
  onOpenActivity,
  onSelectStatus,
}: ArchiveDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const groups = useMemo(() => groupArchiveEntries(entries), [entries]);
  const activitiesById = useMemo(
    () => new Map(activities.map((activity) => [activity.id, activity])),
    [activities],
  );
  const [openStatuses, setOpenStatuses] = useState<ReadonlySet<ArchiveStatus>>(
    () => new Set(activeStatus ? [activeStatus] : GROUP_ORDER),
  );

  useEffect(() => {
    // Align a routed group only after its selected card collection has rendered.
    if (!activeStatus) return;

    const frameId = window.requestAnimationFrame(() => {
      document.getElementById(`archive-${activeStatus}`)?.scrollIntoView({ block: 'start' });
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [activeStatus]);

  const toggleStatus = (status: ArchiveStatus) => {
    // Keep outcome groups independent so the archive behaves like the main accordion.
    setOpenStatuses((current) => {
      const next = new Set(current);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  };

  const selectStatus = (event: MouseEvent<HTMLAnchorElement>, status: ArchiveStatus) => {
    // Preserve native modified-click behavior while ordinary activation updates the sheet route.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setOpenStatuses(new Set([status]));
    onSelectStatus(status);
    window.requestAnimationFrame(() => {
      document.getElementById(`archive-${status}`)?.scrollIntoView({ block: 'start' });
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
            <span className="reference-sheet__toolbar-label">Decision notes</span>
            <button
              aria-label="Close tried and decided"
              className="reference-sheet__close-x"
              onClick={onClose}
              type="button"
            >
              <CrossIcon />
            </button>
          </div>
          <div className="reference-sheet__handle" />
          <header className="reference-sheet__header">
            <p className="reference-sheet__eyebrow">What made the cut</p>
            <h2 className="reference-sheet__title" id={titleId}>Tried &amp; decided</h2>
            <p className="reference-sheet__intro" id={descriptionId}>
              Tried places and deliberate decisions belong here: what earned a verified place,
              what was merely okay, and what was ruled out. Nothing quietly returns later.
            </p>
          </header>

          <nav aria-label="Archive outcome summaries" className="archive-sheet__summary">
            {GROUP_ORDER.map((status) => {
              const copy = GROUP_COPY[status];
              const count = groups[status].length;
              return (
                <a
                  aria-current={activeStatus === status ? 'location' : undefined}
                  aria-label={`Show ${String(count)} ${copy.title} archive entries`}
                  href={archiveHash(status)}
                  key={status}
                  onClick={(event) => selectStatus(event, status)}
                >
                  <span className="archive-sheet__summary-label">{copy.title}</span>
                  <span className="archive-sheet__summary-count">{count}</span>
                </a>
              );
            })}
          </nav>

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
                  id={`archive-${status}`}
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
