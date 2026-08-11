export const CHAPTER_KEYS = [
  'loud',
  'strange',
  'dinners',
  'takehome',
  'cooking',
  'getgood',
  'adrenaline',
  'rides',
  'wandering',
  'quiet',
  'elsewhere',
  'animals',
] as const;

export type ChapterKey = (typeof CHAPTER_KEYS)[number];

export type Chapter = {
  readonly key: ChapterKey;
  readonly name: string;
};

export type ActivityDate = {
  readonly d: string;
  readonly m: string;
  readonly w: string;
  /** ISO 8601 sort key for an event or the first day of a date range. */
  readonly on: string;
};

export type ActivityFact = {
  readonly label: string;
  readonly value: string;
};

export type Activity = {
  readonly id: string;
  readonly ch: ChapterKey;
  readonly name: string;
  readonly blurb: string;
  readonly when: string;
  readonly where: string;
  readonly dated?: ActivityDate;
  readonly ahead?: string;
  readonly eyebrow?: string;
  /** Structured practical context shown in the detail sheet after when and where. */
  readonly facts?: readonly ActivityFact[];
  /** A candid caveat that materially changes how the activity should be planned. */
  readonly advisory?: string;
  readonly cta: string;
  readonly book?: string;
  readonly site?: string;
  readonly ig?: string;
  /** Editorial fallback description retained for future image sourcing. */
  readonly shot?: string;
  readonly noPhoto?: boolean;
  readonly photos: number;
};

export type ActivityTreatment =
  | 'bleed'
  | 'letter'
  | 'top'
  | 'slab'
  | 'columns'
  | 'bite'
  | 'dated'
  | 'ahead'
  | 'type';

export const STANDARD_ACTIVITY_TREATMENTS = [
  'bleed',
  'letter',
  'top',
  'slab',
  'columns',
  'bite',
] as const satisfies readonly ActivityTreatment[];

/**
 * Keep dated cards chronological while distributing their repeated visual treatment
 * as evenly as possible through the editorially ranked undated cards.
 */
export function orderChapterItems<T extends Activity>(items: readonly T[]): T[] {
  const dated = items
    .map((item, sourceIndex) => ({ item, sourceIndex }))
    .filter((entry): entry is { item: T & { dated: ActivityDate }; sourceIndex: number } =>
      Boolean(entry.item.dated),
    )
    .sort(
      (left, right) =>
        left.item.dated.on.localeCompare(right.item.dated.on) ||
        left.sourceIndex - right.sourceIndex,
    )
    .map(({ item }) => item);
  const undated = items.filter((item) => !item.dated);

  if (dated.length === 0) return [...undated];

  const total = dated.length + undated.length;
  const interval = total / dated.length;
  const datedSlots = new Set(
    dated.map((_, index) => Math.min(total - 1, Math.floor((index + 0.5) * interval))),
  );
  const ordered: T[] = [];
  let datedIndex = 0;
  let undatedIndex = 0;

  for (let index = 0; index < total; index += 1) {
    const nextDated = dated[datedIndex];
    const nextUndated = undated[undatedIndex];
    const useDated = datedSlots.has(index) || !nextUndated;
    if (useDated && nextDated) {
      ordered.push(nextDated);
      datedIndex += 1;
    } else if (nextUndated) {
      ordered.push(nextUndated);
      undatedIndex += 1;
    }
  }

  return ordered;
}

/** Keep every calendar event in the shared dated treatment, even when it also needs advance booking. */
export function getActivityTreatment(
  activity: Pick<Activity, 'ahead' | 'dated' | 'noPhoto'>,
  standardIndex = 0,
): ActivityTreatment {
  if (activity.dated) return 'dated';
  if (activity.ahead) return 'ahead';
  if (activity.noPhoto) return 'type';

  const count = STANDARD_ACTIVITY_TREATMENTS.length;
  const normalizedIndex = ((Math.trunc(standardIndex) % count) + count) % count;
  return STANDARD_ACTIVITY_TREATMENTS[normalizedIndex] ?? 'bleed';
}

/** Build the immutable public photo path shared by local preview and S3 hosting. */
export function activityPhotoUrl(
  activity: Pick<Activity, 'id'> | string,
  photoNumber = 1,
): string {
  if (!Number.isInteger(photoNumber) || photoNumber < 1) {
    throw new RangeError('photoNumber must be a positive integer');
  }

  const id = typeof activity === 'string' ? activity : activity.id;
  return `photos/${id}-${String(photoNumber).padStart(2, '0')}.jpg`;
}

/** Prefer a precise venue when building the Google Maps search, with Dubai as fallback. */
export function activityMapUrl(
  activity: Pick<Activity, 'name'> & Partial<Pick<Activity, 'where'>>,
): string {
  const query = `${activity.name} ${activity.where ?? 'Dubai'}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Booking links are the primary action; otherwise fall back to the official site. */
export function activityPrimaryUrl(
  activity: Partial<Pick<Activity, 'book' | 'site'>>,
): string | null {
  return activity.book ?? activity.site ?? null;
}
