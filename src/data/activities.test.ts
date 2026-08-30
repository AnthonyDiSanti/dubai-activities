import { describe, expect, it } from 'vitest';

import {
  getActivityTreatment,
  isPlanAheadActivity,
  orderChapterItems,
  type Activity,
} from '../domain/activity';
import { ITEMS } from './activities';

const activities: readonly Activity[] = ITEMS;
const activitiesById = new Map(activities.map((activity) => [activity.id, activity]));
const FACT_ENRICHED_IDS = [
  'stardom',
  'bludubai',
  'brassmonkey',
  'triple777',
  'untold',
  'teamlab',
  'laperle',
  'krasota',
  'chaoskarts',
  'motf',
  'moonrise',
  'amazonico',
  'tingirie',
  'nammos',
  'amritsr',
  'ossiano',
  'dits',
  'opa',
  'sevenpaintings',
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
  it.each([
    'terrasolis',
    'cyanotype',
    'rawbarista',
    'wavehouse',
    'boombattlebar',
    'fashionavenue',
    'thepods',
  ])(
    'keeps retired or screened-out activity %s out',
    (id) => {
      // Explicit exclusions are product decisions, not temporary research omissions.
      expect(activitiesById.has(id)).toBe(false);
    },
  );

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

  it('keeps both game-bar additions adult, licensed, and candid about their format', () => {
    const brassMonkey = activitiesById.get('brassmonkey');
    const triple777 = activitiesById.get('triple777');

    // Brass reflects the firsthand game mix; Triple 777 retains its researched late-night role.
    expect(brassMonkey).toMatchObject({ ch: 'loud', when: 'Daily · 21+', photos: 4 });
    expect(brassMonkey?.facts?.find(({ label }) => label === 'Games')?.value).toMatch(/mini basketball/i);
    expect(brassMonkey?.blurb).toMatch(/fun date/i);
    expect(brassMonkey?.advisory).toMatch(/rather than a deep Barcade-style cabinet lineup/i);
    expect(triple777).toMatchObject({ ch: 'loud', when: 'Daily · 18:00–03:00 · 21+', photos: 4 });
    expect(triple777?.facts?.find(({ label }) => label === 'Fun Pass')?.value).toMatch(/unlimited drinks/i);
    expect(triple777?.advisory).toMatch(/does not publish the arcade machine count/i);
  });

  it('keeps BLU practical about its Thursday crowd and compact dance area', () => {
    const blu = activitiesById.get('bludubai');

    // Firsthand strengths stay in the card without turning a normal walk-in into a reservation task.
    expect(blu).toMatchObject({
      ch: 'loud',
      name: 'BLU Dubai',
      where: '32nd floor, V Hotel, Al Habtoor City',
      photos: 4,
    });
    expect(blu?.ahead).toBeUndefined();
    expect(blu?.book).toBeUndefined();
    expect(blu && isPlanAheadActivity(blu)).toBe(false);
    expect(blu?.blurb).toMatch(/ladies-first table policy/i);
    expect(blu?.facts?.find(({ label }) => label === 'Thursday sound')?.value)
      .toMatch(/hip-hop/i);
    expect(blu?.advisory).toMatch(/dance area is compact/i);
    expect(blu?.advisory).toMatch(/tables and bottles are aimed at women/i);
    expect(blu?.advisory).toMatch(/normal walk-in was enough/i);
  });

  it('keeps both newly verified dinners practical and fully photographed', () => {
    const amazonico = activitiesById.get('amazonico');
    const tingIrie = activitiesById.get('tingirie');

    // A same-day reservation stays actionable without overstating its planning burden.
    expect(amazonico).toMatchObject({ ch: 'dinners', where: 'DIFC Pavilion', photos: 4 });
    expect(amazonico?.ahead).toBeUndefined();
    expect(amazonico?.book).toMatch(/covermanager/i);
    expect(amazonico && isPlanAheadActivity(amazonico)).toBe(false);
    expect(amazonico?.advisory).toMatch(/same-day booking worked/i);
    expect(amazonico?.facts?.find(({ label }) => label === 'Cuisine')?.value)
      .toMatch(/Latin American/i);
    expect(tingIrie).toMatchObject({ ch: 'dinners', where: 'Souk Al Manzil, Downtown', photos: 4 });
    expect(tingIrie?.facts?.find(({ label }) => label === 'Cuisine')?.value)
      .toMatch(/Jamaican/i);
  });

  it('keeps Amritsr in Karama without treating the Dubai branch as verified', () => {
    const amritsr = activitiesById.get('amritsr');

    // The Bangkok preference motivates the candidate, but this exact kitchen still needs a visit.
    expect(amritsr).toMatchObject({
      ch: 'dinners',
      name: 'Amritsr · Al Karama',
      where: 'Al Attar Center, Al Karama',
      photos: 4,
    });
    expect(amritsr?.blurb).toMatch(/Bangkok meals/i);
    expect(amritsr?.advisory).toMatch(/Dubai branch is still untested/i);
    expect(amritsr?.facts?.find(({ label }) => label === 'Start with')?.value)
      .toMatch(/Amritsari kulcha/i);
  });

  it('adds Nammos as a complete beachside restaurant rather than a generic beach club', () => {
    const nammos = activitiesById.get('nammos');

    // Separate venue hours preserve the choice between a meal, the lounge, and a beach afternoon.
    expect(nammos).toMatchObject({
      ch: 'dinners',
      name: 'Nammos Dubai',
      when: 'Daily · restaurant 12:30–02:00',
      where: 'Four Seasons Resort · Jumeirah 2',
      photos: 4,
    });
    expect(nammos?.book).toMatch(/sevenrooms\.com\/explore\/nammosdubai/i);
    expect(nammos?.facts?.find(({ label }) => label === 'Cuisine')?.value)
      .toMatch(/Mediterranean/i);
    expect(nammos?.facts?.find(({ label }) => label === 'Beach')?.value)
      .toBe('Daily 11:00–19:00');
    expect(nammos?.advisory).toMatch(/which area a booking covers/i);
  });

  it('keeps Boomah candid about its location, price, and owl-welfare trade-off', () => {
    const boomah = activitiesById.get('boomah');

    // The live venue is in Abu Dhabi, and the operator does not publish a current owl-room price.
    expect(boomah).toMatchObject({
      ch: 'animals',
      name: 'Boomah Owl Café',
      where: 'Al Seef Village Mall, Abu Dhabi',
      photos: 4,
    });
    const owlRoomFact = boomah?.facts?.find(({ label }) => label === 'Owl room');
    expect(owlRoomFact?.value).toMatch(/confirm the live price/i);
    expect(boomah?.advisory).toMatch(/captive owls is controversial/i);
    expect(boomah?.advisory).toMatch(/operator claims/i);
  });
});
