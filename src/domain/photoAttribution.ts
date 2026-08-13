export type AttributionParty = {
  readonly name: string;
  readonly type: 'organization' | 'person';
  readonly url: string | null;
};

export type AttributionLink = {
  readonly name: string;
  readonly url: string | null;
};

export const PHOTO_CREDIT_BASES = [
  'creative_commons',
  'stock_license',
  'public_domain',
  'creator_credit',
  'source_credit',
  'trademark',
] as const;

export type PhotoCreditBasis = (typeof PHOTO_CREDIT_BASES)[number];

function isPhotoCreditBasis(value: string): value is PhotoCreditBasis {
  // Runtime JSON must stay within the same vocabulary as the reviewed CSV ledger.
  return (PHOTO_CREDIT_BASES as readonly string[]).includes(value);
}

export type PhotoAttribution = {
  readonly filename: string;
  readonly activityId: string | null;
  readonly activityName: string;
  readonly chapterName: string;
  readonly slot: number | null;
  readonly workTitle: string | null;
  readonly creator: AttributionParty | null;
  readonly source: AttributionLink & { readonly url: string };
  readonly license: AttributionLink | null;
  readonly creditBasis: PhotoCreditBasis;
  readonly modifications: string | null;
  readonly creditText: string;
};

export type PhotoAttributionCatalog = {
  readonly schemaVersion: 1;
  readonly assets: readonly PhotoAttribution[];
};

export type AttributionLine = Omit<PhotoAttribution, 'filename' | 'slot'> & {
  readonly filenames: readonly string[];
  readonly slots: readonly number[];
};

export type AttributionActivityGroup = {
  readonly activityId: string | null;
  readonly activityName: string;
  readonly lines: readonly AttributionLine[];
};

export type AttributionChapterGroup = {
  readonly chapterName: string;
  readonly activities: readonly AttributionActivityGroup[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requiredString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`Photo attribution field ${key} must be a non-empty string`);
  }
  return value;
}

function nullableString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  if (value === null) return null;
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`Photo attribution field ${key} must be a string or null`);
  }
  return value;
}

function parseParty(value: unknown): AttributionParty | null {
  if (value === null) return null;
  if (!isRecord(value)) throw new TypeError('Photo attribution creator must be an object or null');
  const type = requiredString(value, 'type');
  if (type !== 'organization' && type !== 'person') {
    throw new TypeError('Photo attribution creator type is invalid');
  }
  return {
    name: requiredString(value, 'name'),
    type,
    url: nullableString(value, 'url'),
  };
}

function parseLink(value: unknown, allowNull: false): AttributionLink & { readonly url: string };
function parseLink(value: unknown, allowNull: true): AttributionLink | null;
function parseLink(value: unknown, allowNull: boolean): AttributionLink | null {
  if (allowNull && value === null) return null;
  if (!isRecord(value)) throw new TypeError('Photo attribution link must be an object');
  const url = nullableString(value, 'url');
  if (!allowNull && url === null) throw new TypeError('Photo attribution source URL is required');
  return { name: requiredString(value, 'name'), url };
}

function parseAsset(value: unknown): PhotoAttribution {
  if (!isRecord(value)) throw new TypeError('Photo attribution asset must be an object');
  const slot = value.slot;
  if (slot !== null && (!Number.isInteger(slot) || Number(slot) < 1)) {
    throw new TypeError('Photo attribution slot must be a positive integer or null');
  }
  const creditBasis = requiredString(value, 'creditBasis');
  if (!isPhotoCreditBasis(creditBasis)) {
    throw new TypeError('Photo attribution credit basis is invalid');
  }
  return {
    filename: requiredString(value, 'filename'),
    activityId: nullableString(value, 'activityId'),
    activityName: requiredString(value, 'activityName'),
    chapterName: requiredString(value, 'chapterName'),
    slot: slot === null ? null : Number(slot),
    workTitle: nullableString(value, 'workTitle'),
    creator: parseParty(value.creator),
    source: parseLink(value.source, false),
    license: parseLink(value.license, true),
    creditBasis,
    modifications: nullableString(value, 'modifications'),
    creditText: requiredString(value, 'creditText'),
  };
}

/** Validate generated JSON at the browser boundary before it reaches the dialog. */
export function parsePhotoAttributionCatalog(value: unknown): PhotoAttributionCatalog {
  if (!isRecord(value) || value.schemaVersion !== 1 || !Array.isArray(value.assets)) {
    throw new TypeError('Photo attribution catalog has an unsupported schema');
  }
  return { schemaVersion: 1, assets: value.assets.map(parseAsset) };
}

function lineIdentity(asset: PhotoAttribution): string {
  // Only truly identical credit statements may collapse into one human-readable line.
  return JSON.stringify([
    asset.workTitle,
    asset.creator,
    asset.source,
    asset.license,
    asset.creditBasis,
    asset.modifications,
  ]);
}

/** Preserve manifest order while grouping repeated credits within one activity. */
export function groupPhotoAttributions(
  assets: readonly PhotoAttribution[],
): AttributionChapterGroup[] {
  const chapterGroups: {
    chapterName: string;
    activities: {
      activityId: string | null;
      activityName: string;
      lines: AttributionLine[];
      lineIndexes: Map<string, number>;
    }[];
    activityIndexes: Map<string, number>;
  }[] = [];
  const chapterIndexes = new Map<string, number>();

  for (const asset of assets) {
    let chapterIndex = chapterIndexes.get(asset.chapterName);
    if (chapterIndex === undefined) {
      chapterIndex = chapterGroups.length;
      chapterIndexes.set(asset.chapterName, chapterIndex);
      chapterGroups.push({
        chapterName: asset.chapterName,
        activities: [],
        activityIndexes: new Map(),
      });
    }
    const chapter = chapterGroups[chapterIndex];
    if (!chapter) continue;
    const activityKey = asset.activityId ?? asset.activityName;
    let activityIndex = chapter.activityIndexes.get(activityKey);
    if (activityIndex === undefined) {
      activityIndex = chapter.activities.length;
      chapter.activityIndexes.set(activityKey, activityIndex);
      chapter.activities.push({
        activityId: asset.activityId,
        activityName: asset.activityName,
        lines: [],
        lineIndexes: new Map(),
      });
    }
    const activity = chapter.activities[activityIndex];
    if (!activity) continue;
    const identity = lineIdentity(asset);
    const lineIndex = activity.lineIndexes.get(identity);
    if (lineIndex === undefined) {
      activity.lineIndexes.set(identity, activity.lines.length);
      activity.lines.push({
        ...asset,
        filenames: [asset.filename],
        slots: asset.slot === null ? [] : [asset.slot],
      });
      continue;
    }
    const line = activity.lines[lineIndex];
    if (!line) continue;
    activity.lines[lineIndex] = {
      ...line,
      filenames: [...line.filenames, asset.filename],
      slots: asset.slot === null ? line.slots : [...line.slots, asset.slot],
    };
  }

  return chapterGroups.map((chapter) => ({
    chapterName: chapter.chapterName,
    activities: chapter.activities.map((activity) => ({
      activityId: activity.activityId,
      activityName: activity.activityName,
      lines: activity.lines,
    })),
  }));
}

/** Turn a slot set into the compact label used before each visible credit. */
export function formatPhotoSlots(slots: readonly number[]): string {
  if (slots.length === 0) return 'Mark';
  const sorted = [...new Set(slots)].sort((left, right) => left - right);
  const ranges: string[] = [];
  let start = sorted[0];
  let end = sorted[0];
  for (const slot of sorted.slice(1)) {
    if (end !== undefined && slot === end + 1) {
      end = slot;
      continue;
    }
    if (start !== undefined && end !== undefined) {
      ranges.push(start === end ? String(start) : `${String(start)}–${String(end)}`);
    }
    start = slot;
    end = slot;
  }
  if (start !== undefined && end !== undefined) {
    ranges.push(start === end ? String(start) : `${String(start)}–${String(end)}`);
  }
  return `${sorted.length === 1 ? 'Photo' : 'Photos'} ${ranges.join(', ')}`;
}
