#!/usr/bin/env -S npm exec tsx --

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { CHAPTERS, HERO, ITEMS } from '../src/data/activities';
import { ARCHIVE_ACTIVITY_DETAILS, ARCHIVE_ENTRIES } from '../src/data/archive';
import { ARRIVAL_DATE_KEY } from '../src/config/site';
import { orderChapterItems, type Activity } from '../src/domain/activity';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PHOTO_DIR = path.join(ROOT, 'public', 'photos');
const DISPLAY_FIELDS = [
  'name',
  'blurb',
  'eyebrow',
  'when',
  'where',
  'ahead',
  'advisory',
  'cta',
] as const satisfies readonly (keyof Activity)[];
const URL_FIELDS = ['book', 'site', 'ig'] as const satisfies readonly (keyof Activity)[];
const RESERVED_FACT_LABELS = new Set(['date', 'when', 'where', 'book ahead']);
const RETIRED_ACTIVITY_IDS = new Set(['terrasolis', 'cyanotype', 'rawbarista']);
const FIRST_PERSON = /\b(?:i|i['’](?:m|ve|d|ll)|me|my|mine|myself|we|we['’](?:re|ve|d|ll)|us|our|ours|ourselves|let['’]s)\b/i;
const EXPECTED_CHAPTERS = 12;
const EXPECTED_ACTIVITIES = 122;
const EXPECTED_HEROES = 6;

const errors: string[] = [];
const fail = (message: string) => errors.push(message);

function isRealIsoDate(value: string): boolean {
  // Round-tripping rejects values such as 2026-02-31 that Date.parse normalizes.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

const chapterKeys = new Set<string>();
if (CHAPTERS.length !== EXPECTED_CHAPTERS) {
  fail(`Expected ${EXPECTED_CHAPTERS} chapters; found ${CHAPTERS.length}. Update the audit for an intentional change.`);
}
for (const chapter of CHAPTERS) {
  if (!chapter.key || !chapter.name) fail(`Chapter is missing a key or name: ${JSON.stringify(chapter)}`);
  if (chapterKeys.has(chapter.key)) fail(`Duplicate chapter key: ${chapter.key}`);
  chapterKeys.add(chapter.key);
  if (FIRST_PERSON.test(chapter.name)) fail(`First-person voice in chapter ${chapter.key}: ${chapter.name}`);
}

const archiveIds = new Set<string>();
const inactiveArchiveIds = new Set<string>();
const verifiedActivityIds = new Set<string>();
for (const entry of ARCHIVE_ENTRIES) {
  // Archive entries are release data: reject ambiguous records before they reach the footer sheet.
  if (!entry.id || !entry.name || !entry.note || !entry.originalChapterName) {
    fail(`Archive entry is missing required copy: ${JSON.stringify(entry)}`);
  }
  if (archiveIds.has(entry.id)) fail(`Duplicate archive activity id: ${entry.id}`);
  archiveIds.add(entry.id);
  if (!isRealIsoDate(entry.recordedOn)) {
    fail(`Archive entry ${entry.id} has an invalid recordedOn date: ${entry.recordedOn}`);
  }
  if (entry.status !== 'verified') inactiveArchiveIds.add(entry.id);
  if (entry.status === 'verified') verifiedActivityIds.add(entry.id);
}

const itemIds = new Set<string>();
const expectedPhotos = new Set<string>();
if (ITEMS.length !== EXPECTED_ACTIVITIES) {
  fail(`Expected ${EXPECTED_ACTIVITIES} activities; found ${ITEMS.length}. Update the audit for an intentional change.`);
}
for (const item of ITEMS) {
  if (!item.id) fail(`Activity is missing an id: ${JSON.stringify(item)}`);
  if (itemIds.has(item.id)) fail(`Duplicate activity id: ${item.id}`);
  if (RETIRED_ACTIVITY_IDS.has(item.id)) fail(`Retired activity returned to the guide: ${item.id}`);
  if (inactiveArchiveIds.has(item.id)) fail(`Inactive archive activity returned to the guide: ${item.id}`);
  itemIds.add(item.id);
  if (!chapterKeys.has(item.ch)) fail(`${item.id} references unknown chapter ${item.ch}.`);
  if (!item.blurb || !item.cta || !item.when || !item.where) {
    fail(`${item.id} is missing one of blurb, cta, when, or where.`);
  }

  for (const field of DISPLAY_FIELDS) {
    const value = item[field];
    if (value && FIRST_PERSON.test(String(value))) {
      fail(`First-person voice in ${item.id}.${field}: ${String(value)}`);
    }
  }
  if ((item.facts?.length ?? 0) > 4) {
    fail(`${item.id} has more than four practical facts; keep the sheet planning-focused.`);
  }
  const factLabels = new Set<string>();
  for (const fact of item.facts ?? []) {
    // Keep custom facts distinct from the sheet's automatic calendar and planning terms.
    if (!fact.label.trim() || !fact.value.trim()) fail(`${item.id} has an empty practical fact.`);
    const normalizedLabel = fact.label.trim().toLocaleLowerCase('en-US');
    if (RESERVED_FACT_LABELS.has(normalizedLabel)) {
      fail(`${item.id} uses reserved practical fact label ${fact.label}.`);
    }
    if (factLabels.has(normalizedLabel)) fail(`${item.id} repeats practical fact label ${fact.label}.`);
    factLabels.add(normalizedLabel);
    if (FIRST_PERSON.test(`${fact.label} ${fact.value}`)) {
      fail(`First-person voice in ${item.id}.facts: ${fact.label}: ${fact.value}`);
    }
  }
  for (const field of URL_FIELDS) {
    const value = item[field];
    if (value && !/^https?:\/\//.test(String(value))) {
      fail(`${item.id}.${field} is not an HTTP(S) URL: ${String(value)}`);
    }
  }
  if (item.advisory !== undefined) {
    if (!item.advisory.trim()) fail(`${item.id} has an empty advisory.`);
    if (item.advisory.length > 240) {
      fail(`${item.id} advisory exceeds 240 characters; keep the caveat scannable.`);
    }
  }
  if (item.dated) {
    // Calendar cards must remain both renderable and actionable for the configured trip.
    if (![item.dated.d, item.dated.m, item.dated.w].every((part) => part.trim())) {
      fail(`${item.id} has an incomplete dated display.`);
    }
    if (!isRealIsoDate(item.dated.on)) {
      fail(`${item.id} has an invalid dated.on value: ${item.dated.on || '(missing)'}`);
    } else if (item.dated.on < ARRIVAL_DATE_KEY) {
      fail(`${item.id} occurs before the ${ARRIVAL_DATE_KEY} arrival date: ${item.dated.on}`);
    }
  }
  if (!Number.isInteger(item.photos) || item.photos < 2) {
    fail(`${item.id} must have at least two contiguous photos; found ${item.photos}.`);
    continue;
  }
  for (let slot = 1; slot <= item.photos; slot += 1) {
    expectedPhotos.add(`${item.id}-${String(slot).padStart(2, '0')}.jpg`);
  }
}

for (const verifiedActivityId of verifiedActivityIds) {
  // A firsthand recommendation remains useful only while its activity is still live.
  if (!itemIds.has(verifiedActivityId)) {
    fail(`Verified activity is missing from the active guide: ${verifiedActivityId}`);
  }
}

const archiveDetailIds = new Set<string>();
for (const activity of ARCHIVE_ACTIVITY_DETAILS) {
  // Archived details may be typographic, but photographed records still require full galleries.
  if (archiveDetailIds.has(activity.id)) fail(`Duplicate archive detail id: ${activity.id}`);
  archiveDetailIds.add(activity.id);
  if (!inactiveArchiveIds.has(activity.id)) {
    fail(`Archive detail ${activity.id} does not belong to an inactive archive entry.`);
  }
  if (itemIds.has(activity.id)) fail(`Archive detail ${activity.id} duplicates an active activity.`);
  if (!chapterKeys.has(activity.ch)) fail(`Archive detail ${activity.id} references unknown chapter ${activity.ch}.`);
  if (!activity.blurb || !activity.cta || !activity.when || !activity.where) {
    fail(`Archive detail ${activity.id} is missing one of blurb, cta, when, or where.`);
  }
  if (!Number.isInteger(activity.photos) || activity.photos < 0 || activity.photos === 1) {
    fail(`${activity.id} archive detail must have zero or at least two photos; found ${activity.photos}.`);
    continue;
  }
  for (let slot = 1; slot <= activity.photos; slot += 1) {
    expectedPhotos.add(`${activity.id}-${String(slot).padStart(2, '0')}.jpg`);
  }
}
for (const inactiveArchiveId of inactiveArchiveIds) {
  if (!archiveDetailIds.has(inactiveArchiveId)) {
    fail(`Inactive archive activity is missing sheet data: ${inactiveArchiveId}`);
  }
}

for (const chapter of CHAPTERS) {
  const sourceItems = ITEMS.filter((item) => item.ch === chapter.key);
  if (!sourceItems.length) fail(`Chapter ${chapter.key} has no activities.`);
  const sourceDates = sourceItems.flatMap((item) => item.dated?.on ? [item.dated.on] : []);
  if (sourceDates.join('|') !== [...sourceDates].sort().join('|')) {
    fail(`${chapter.key} dated declarations are not chronological in src/data/activities.ts.`);
  }

  const visibleItems = orderChapterItems(sourceItems);
  const dates = visibleItems.flatMap((item) => item.dated?.on ? [item.dated.on] : []);
  if (dates.join('|') !== [...dates].sort().join('|')) {
    fail(`${chapter.key} dated activities do not render chronologically: ${dates.join(', ')}`);
  }

  // The smallest possible maximum run protects the requested visual separation.
  if (dates.length) {
    const allowedRun = Math.ceil(dates.length / (visibleItems.length - dates.length + 1));
    let currentRun = 0;
    let longestRun = 0;
    for (const item of visibleItems) {
      currentRun = item.dated ? currentRun + 1 : 0;
      longestRun = Math.max(longestRun, currentRun);
    }
    if (longestRun > allowedRun) {
      fail(`${chapter.key} renders ${longestRun} dated cards together; at most ${allowedRun} is necessary.`);
    }
  }
}

if (HERO.length !== EXPECTED_HEROES) fail(`Hero must contain exactly ${EXPECTED_HEROES} activities; found ${HERO.length}.`);
if (new Set(HERO).size !== HERO.length) fail('Hero contains duplicate activity IDs.');
for (const id of HERO) {
  const item = ITEMS.find((candidate) => candidate.id === id);
  if (!item) {
    fail(`Hero references unknown activity ${id}.`);
    continue;
  }
  if (item.photos < 3) fail(`Hero activity ${id} has fewer than three gallery photos.`);
}

if (!fs.existsSync(PHOTO_DIR) || !fs.statSync(PHOTO_DIR).isDirectory()) {
  fail(`Photo directory is missing: ${PHOTO_DIR}`);
} else {
  const diskPhotos = new Set(
    fs.readdirSync(PHOTO_DIR).filter((filename) => filename.toLowerCase().endsWith('.jpg')),
  );
  for (const filename of expectedPhotos) {
    if (!diskPhotos.has(filename)) fail(`Activity data references missing public photo: ${filename}`);
  }
  for (const filename of diskPhotos) {
    if (!expectedPhotos.has(filename)) fail(`Public photo is not represented by an activity count: ${filename}`);
  }
}

if (errors.length) {
  console.error(`Activity content audit failed with ${errors.length} error${errors.length === 1 ? '' : 's'}:`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Activity content audit passed: ${CHAPTERS.length} chapters, ${ITEMS.length} activities, ` +
  `${HERO.length} hero slides, ${expectedPhotos.size} public photos.`,
);
