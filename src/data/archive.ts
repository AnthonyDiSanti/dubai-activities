import type { Activity } from '../domain/activity';
import type { ArchiveEntry } from '../domain/archive';

/** Preserve firsthand outcomes separately from current interest and editorial research. */
export const ARCHIVE_ENTRIES = [
  {
    id: 'boulderzone',
    name: 'Boulder Zone',
    note: 'Tried in person and genuinely enjoyed. This one earned its place among the proven choices.',
    originalChapterKey: 'getgood',
    originalChapterName: 'Something to get good at',
    recordedOn: '2026-08-22',
    status: 'verified',
  },
  {
    id: 'meowtropolis',
    name: 'Meowtropolis Cat Café',
    note: 'Tried in person. It was okay, but not strong enough to keep as an active recommendation.',
    originalChapterKey: 'animals',
    originalChapterName: 'Fur, feathers and scales',
    recordedOn: '2026-08-23',
    status: 'tried',
  },
  {
    id: 'robertos',
    name: "Roberto's",
    note: 'Tried in person. Fine, but not memorable enough to earn a place in the live guide.',
    originalChapterKey: 'dinners',
    originalChapterName: 'Long dinners',
    recordedOn: '2026-08-23',
    status: 'tried',
  },
  {
    id: 'salmonguru',
    name: 'Salmon Guru',
    note: 'Tried in person. It was okay, but not compelling enough to recommend as a live candidate.',
    originalChapterKey: 'strange',
    originalChapterName: 'Genuinely strange',
    recordedOn: '2026-08-23',
    status: 'tried',
  },
  {
    id: 'thewall',
    name: 'The Wall',
    note: 'Checked in person. The experience did not clear the bar, so it is out of the live guide.',
    originalChapterKey: 'getgood',
    originalChapterName: 'Something to get good at',
    recordedOn: '2026-08-22',
    status: 'rejected',
  },
  {
    id: 'brunchandcake',
    name: 'Brunch & Cake',
    note: 'Tried the Jumeirah Islands location in person and rejected it. The experience was bad enough to rule out the entire Brunch & Cake chain.',
    originalChapterKey: 'dinners',
    originalChapterName: 'Long dinners',
    recordedOn: '2026-08-23',
    status: 'rejected',
  },
  {
    id: 'butterflygarden',
    name: 'Dubai Butterfly Garden',
    note: 'Tried in person and rejected. The visit did not clear the bar, so it is out of the live guide.',
    originalChapterKey: 'animals',
    originalChapterName: 'Fur, feathers and scales',
    recordedOn: '2026-08-23',
    status: 'rejected',
  },
] as const satisfies readonly ArchiveEntry[];

/** Retain sheet-ready context for inactive records without returning them to recommendations. */
export const ARCHIVE_ACTIVITY_DETAILS = [
  {
    id: 'meowtropolis', ch: 'animals', name: 'Meowtropolis Cat Café',
    blurb: 'Wooden pods, wall runs, and a small café counter give this JLT cat lounge its identity. Timed visits work best when the room stays quiet and the cats are allowed to choose whether to come over.',
    eyebrow: 'A cat lounge in JLT', when: 'Timed sessions · reserve online', where: 'Cluster Y, JLT',
    facts: [{ label: 'Format', value: 'Timed cat-lounge sessions' }, { label: 'House rules', value: 'No flash, grabbing, chasing, or loud behaviour' }],
    cta: 'See Meowtropolis', site: 'https://www.meowtropoliscatcafe.online/', photos: 4,
  },
  {
    id: 'robertos', ch: 'dinners', name: "Roberto's",
    blurb: 'Roberto’s divides the evening between a formal Italian dining room, the Scala cocktail lounge, and a skyline terrace in Gate Village. The polished Milanese-inspired rooms make the setting as central as the pasta and seafood.',
    eyebrow: 'Three rooms in Gate Village', when: 'Mon–Sat · 16:00–03:00', where: 'Gate Village 1, DIFC',
    facts: [{ label: 'Spaces', value: 'Ristorante · Scala lounge · Giardino terrace' }, { label: 'Cuisine', value: 'Contemporary Italian' }],
    cta: "See Roberto's Dubai", site: 'https://robertosrestaurants.com/dubai/home', photos: 4,
  },
  {
    id: 'salmonguru', ch: 'strange', name: 'Salmon Guru',
    blurb: 'A tropical speakeasy, an Asian night market, and comic-book neon collide inside one presentation-heavy cocktail bar. The open central bar keeps the technical drink-making visible from most of the room.',
    eyebrow: 'Three theatrical rooms', when: 'Daily · 12:30–02:00', where: 'The Opus, Business Bay',
    facts: [{ label: 'Format', value: 'Cocktails and international small plates' }, { label: 'Setting', value: 'Tropical · night market · comic-book rooms' }],
    cta: 'See Salmon Guru', site: 'https://salmon-guru.ae/', ig: 'https://www.instagram.com/salmongurudubai/', photos: 4,
  },
  {
    id: 'thewall', ch: 'getgood', name: 'The Wall',
    blurb: 'A compact indoor climbing wall built around short sessions rather than a full-scale bouldering gym. Its smaller footprint makes it the lightweight end of Dubai’s climbing options.',
    eyebrow: 'A compact climbing wall', when: 'Session-based entry', where: 'Dubai',
    facts: [{ label: 'Category', value: 'Indoor climbing wall' }, { label: 'Format', value: 'Short climbing sessions' }],
    cta: 'See the former venue', site: 'https://www.thewallclimbinggym.ae/', photos: 2,
  },
  {
    id: 'brunchandcake', ch: 'dinners', name: 'Brunch & Cake',
    blurb: 'Brunch & Cake’s Jumeirah Islands branch opens onto the Pavilion’s lakeside landscaping, with indoor and outdoor seating and an in-house bakery. The pale, plant-heavy rooms frame the chain’s generous all-day café dishes.',
    eyebrow: 'A lakeside café at the Pavilion', when: 'Daily · 08:00–20:00', where: 'Jumeirah Islands Pavilion',
    facts: [{ label: 'Setting', value: 'Indoor and outdoor lakeside seating' }, { label: 'Specialty', value: 'In-house bakery and all-day café menu' }],
    cta: 'See the Jumeirah Islands branch', site: 'https://brunchandcake.com/jumeirah-islands/', photos: 4,
  },
  {
    id: 'butterflygarden', ch: 'animals', name: 'Dubai Butterfly Garden',
    blurb: 'Ten climate-controlled domes hold a large walk-through butterfly collection, feeding stations, and displays that trace the life cycle from pupa to adult. The indoor route is open year-round.',
    eyebrow: 'Ten climate-controlled domes', when: 'Daily · 09:00–18:00', where: 'Al Barsha South 3',
    facts: [{ label: 'Collection', value: '15,000+ butterflies across 50+ species' }, { label: 'Format', value: 'Walk-through domes and life-cycle displays' }],
    cta: 'See the Butterfly Garden', site: 'https://www.dubaimiraclegarden.com/butterfly-garden', photos: 4,
  },
] as const satisfies readonly Activity[];
