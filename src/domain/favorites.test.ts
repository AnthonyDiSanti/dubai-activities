import { describe, expect, it } from 'vitest';

import type { Activity } from './activity';
import {
  createFavoriteSharePayload,
  formatFavoriteMessage,
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

describe('favorite sharing', () => {
  it('replaces unrelated hash state with a deterministic validated list payload', () => {
    const payload = createFavoriteSharePayload(
      new URL('https://example.com/guide/?ref=naima#activity-teamlab'),
      ['teamlab', 'nest'],
    );

    expect(payload).toEqual({
      title: 'Things I want to do',
      url: 'https://example.com/guide/?ref=naima#list=teamlab%2Cnest',
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
