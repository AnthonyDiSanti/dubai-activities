import { describe, expect, it } from 'vitest';

import type { Activity } from './activity';
import {
  createFavoriteSharePayload,
  formatFavoriteMessage,
  groupFavoriteActivities,
  parseSharedFavoriteIds,
  sanitizeFavoriteIds,
} from './favorites';

const knownIds = new Set(['nest', 'teamlab', 'balloon']);

describe('favorite ID validation', () => {
  it('removes unknown, duplicate, and non-string values without changing valid order', () => {
    expect(
      sanitizeFavoriteIds(['teamlab', 'unknown', 'nest', 'teamlab', 3, 'balloon'], knownIds),
    ).toEqual(['teamlab', 'nest', 'balloon']);
  });

  it('distinguishes an absent shared list from a deliberately empty list', () => {
    expect(parseSharedFavoriteIds('#quiet', knownIds)).toBeNull();
    expect(parseSharedFavoriteIds('#activity-nest', knownIds)).toBeNull();
    expect(parseSharedFavoriteIds('#list=', knownIds)).toEqual([]);
    expect(parseSharedFavoriteIds('#list=teamlab%2Cunknown%2Cnest', knownIds)).toEqual([
      'teamlab',
      'nest',
    ]);
  });
});

describe('favorite planning groups', () => {
  it('sorts dated activities chronologically and keeps the other groups in save order', () => {
    const activities: Activity[] = [
      {
        id: 'ordinary-first', ch: 'quiet', name: 'Ordinary first', blurb: 'A.', when: 'Daily',
        where: 'Dubai', cta: 'Go', photos: 1,
      },
      {
        id: 'later-date', ch: 'loud', name: 'Later date', blurb: 'B.', when: 'Night',
        where: 'Dubai', dated: { d: '24', m: 'OCT', w: 'SAT', on: '2026-10-24' },
        ahead: 'Tickets sell out', cta: 'Book', photos: 1,
      },
      {
        id: 'ahead-first', ch: 'quiet', name: 'Ahead first', blurb: 'C.', when: 'Daily',
        where: 'Dubai', ahead: 'Reserve first', cta: 'Book', photos: 1,
      },
      {
        id: 'earlier-date', ch: 'takehome', name: 'Earlier date', blurb: 'D.', when: 'Evening',
        where: 'Dubai', dated: { d: '29', m: 'AUG', w: 'SAT', on: '2026-08-29' },
        cta: 'Join', photos: 1,
      },
      {
        id: 'ordinary-second', ch: 'strange', name: 'Ordinary second', blurb: 'E.', when: 'Daily',
        where: 'Dubai', cta: 'Go', photos: 1,
      },
      {
        id: 'ahead-second', ch: 'animals', name: 'Ahead second', blurb: 'F.', when: 'Daily',
        where: 'Dubai', ahead: 'Message first', cta: 'Ask', photos: 1,
      },
    ];

    const grouped = groupFavoriteActivities(activities);

    expect(grouped.dated.map(({ id }) => id)).toEqual(['earlier-date', 'later-date']);
    expect(grouped.bookAhead.map(({ id }) => id)).toEqual(['ahead-first', 'ahead-second']);
    expect(grouped.other.map(({ id }) => id)).toEqual(['ordinary-first', 'ordinary-second']);
    expect(activities.map(({ id }) => id)).toEqual([
      'ordinary-first', 'later-date', 'ahead-first', 'earlier-date',
      'ordinary-second', 'ahead-second',
    ]);
  });
});

describe('favorite sharing', () => {
  it('replaces unrelated hash state with a deterministic validated list payload', () => {
    const payload = createFavoriteSharePayload(
      new URL('https://example.com/guide/?ref=message#activity-teamlab'),
      ['teamlab', 'nest'],
    );

    expect(payload).toEqual({
      title: 'Things I want to do',
      url: 'https://example.com/guide/?ref=message#list=teamlab%2Cnest',
    });
  });

  it('formats only known activities in favorite order', () => {
    const activities: Activity[] = [
      {
        id: 'nest',
        ch: 'quiet',
        name: 'The Nest',
        blurb: 'A night away.',
        when: 'Overnight',
        where: 'Al Marmoom Reserve',
        cta: 'Book a pod',
        photos: 3,
      },
      {
        id: 'teamlab',
        ch: 'strange',
        name: 'teamLab',
        blurb: 'A room of light.',
        when: 'Daily',
        where: 'Saadiyat',
        cta: 'Step inside',
        photos: 6,
      },
    ];

    expect(
      formatFavoriteMessage(
        ['teamlab', 'missing', 'nest'],
        new Map(activities.map((activity) => [activity.id, activity])),
        new Map([
          ['quiet', 'Quiet and dark'],
          ['strange', 'Genuinely strange'],
        ]),
      ),
    ).toBe(
      'Things I want to do:\n\n• teamLab — Genuinely strange\n• The Nest — Quiet and dark',
    );
  });
});
