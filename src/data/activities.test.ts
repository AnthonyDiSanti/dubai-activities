import { describe, expect, it } from 'vitest';

import { getActivityTreatment, orderChapterItems, type Activity } from '../domain/activity';
import { ITEMS } from './activities';

const activities: readonly Activity[] = ITEMS;
const activitiesById = new Map(activities.map((activity) => [activity.id, activity]));
const FACT_ENRICHED_IDS = [
  'stardom',
  'untold',
  'teamlab',
  'laperle',
  'krasota',
  'chaoskarts',
  'motf',
  'moonrise',
  'ossiano',
  'dits',
  'opa',
  'sevenpaintings',
  'thepods',
  'oolalab',
  'lecole',
  'limba',
  'gemology',
  'ruya',
  'topchef',
  'spicespoons',
  'mtnextreme',
  'smartgate',
  'goclimb',
  'skydive',
  'xline',
  'jaisflight',
  'viaferrata',
  'aquaventure',
  'skidubai',
  'ferrariworld',
  'aquafun',
  'olddubai',
  'artemarket',
  'globalvillage',
  'nest',
  'balloon',
  'musandam',
  'hatta',
  'jebeljais',
  'abudhabiday',
] as const;

describe('activity planning content', () => {
  it.each(['terrasolis', 'cyanotype', 'rawbarista'])('keeps retired activity %s out', (id) => {
    expect(activitiesById.has(id)).toBe(false);
  });

  it.each(FACT_ENRICHED_IDS)('gives %s a focused practical fact set', (id) => {
    const activity = activitiesById.get(id);
    expect(activity, `${id} must remain in the guide`).toBeDefined();
    expect(activity?.facts?.length).toBeGreaterThanOrEqual(1);
    expect(activity?.facts?.length).toBeLessThanOrEqual(4);
  });

  it('keeps the new workshop dates chronological and visually dispersed', () => {
    const takehome = orderChapterItems(activities.filter(({ ch }) => ch === 'takehome'));
    const dated = takehome.filter((activity) => activity.dated);

    expect(dated.map(({ id, dated: date }) => [id, date?.on])).toEqual([
      ['chipcarving', '2026-08-29'],
      ['procreate', '2026-08-30'],
      ['makerspace', '2026-11-03'],
    ]);
    expect(dated.map((activity) => getActivityTreatment(activity))).toEqual([
      'dated',
      'dated',
      'dated',
    ]);
    for (let index = 1; index < takehome.length; index += 1) {
      // With six undated cards available, no two workshop stamps need to touch.
      expect(takehome[index - 1]?.dated && takehome[index]?.dated).toBeFalsy();
    }
  });

  it('keeps unannounced seasonal openings out of the dated stream', () => {
    expect(activitiesById.get('globalvillage')?.dated).toBeUndefined();
    expect(activitiesById.get('artemarket')?.dated?.on).toBe('2026-08-29');
  });

  it('keeps OPA actionable without promising an unpublished plate stack', () => {
    const opa = activitiesById.get('opa');

    // The venue confirms plate smashing, but its current pages do not guarantee a quantity or add-on price.
    expect(opa).toMatchObject({
      ch: 'dinners',
      name: 'OPA Dubai',
      photos: 4,
      book: 'https://www.sevenrooms.com/reservations/opadubai/website-opa-dubai',
    });
    expect(opa?.advisory).toMatch(/does not publish how many smashing plates/i);
  });
});
