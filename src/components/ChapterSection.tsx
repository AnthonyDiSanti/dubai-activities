import { memo, useMemo } from 'react';

import {
  getActivityTreatment,
  orderChapterItems,
  type Activity,
  type Chapter,
  type ChapterKey,
} from '../domain/activity';
import { ActivityCard } from './ActivityCard';

export type ChapterSectionProps = {
  readonly chapter: Chapter;
  readonly favoriteIds: ReadonlySet<Activity['id']>;
  readonly items: readonly Activity[];
  readonly onOpenActivity: (activityId: Activity['id']) => void;
  readonly onToggle: (chapterKey: ChapterKey) => void;
  readonly onToggleFavorite: (activityId: Activity['id']) => void;
  readonly open: boolean;
  readonly verifiedIds: ReadonlySet<Activity['id']>;
};

export const ChapterSection = memo(function ChapterSection({
  chapter,
  favoriteIds,
  items,
  onOpenActivity,
  onToggle,
  onToggleFavorite,
  open,
  verifiedIds,
}: ChapterSectionProps) {
  const cards = useMemo(() => {
    const orderedItems = orderChapterItems(items);
    const standardIndexById = new Map(
      orderedItems
        .filter((item) => !item.ahead && !item.dated && !item.noPhoto)
        .map((item, index) => [item.id, index] as const),
    );

    // Editorial treatments do not consume a position in the six-card visual rotation.
    return orderedItems.map((item) => ({
      item,
      treatment: getActivityTreatment(item, standardIndexById.get(item.id) ?? 0),
    }));
  }, [items]);
  const activitiesId = `${chapter.key}-activities`;
  const headingId = `${chapter.key}-heading`;

  return (
    <section
      aria-labelledby={headingId}
      className="chapter"
      data-screen-label={chapter.name}
      id={chapter.key}
    >
      <div className="chapter__header">
        <h2 className="chapter__title" id={headingId}>
          {/* One full-width control gives pointer and keyboard users the same toggle target. */}
          <button
            aria-controls={activitiesId}
            aria-expanded={open}
            className="chapter__toggle"
            id={`${chapter.key}-toggle`}
            onClick={() => onToggle(chapter.key)}
            type="button"
          >
            <span className="chapter__toggle-label">{chapter.name}</span>
            <span aria-hidden="true" className="chapter__toggle-icon">
              {open ? '\u25BE' : '\u25B8'}
            </span>
          </button>
        </h2>
      </div>
      <div className="chapter__activities" hidden={!open} id={activitiesId}>
        {open &&
          cards.map(({ item, treatment }) => (
            <ActivityCard
              isFavorite={favoriteIds.has(item.id)}
              isVerified={verifiedIds.has(item.id)}
              item={item}
              key={item.id}
              onOpen={onOpenActivity}
              onToggleFavorite={onToggleFavorite}
              treatment={treatment}
            />
          ))}
      </div>
    </section>
  );
});
