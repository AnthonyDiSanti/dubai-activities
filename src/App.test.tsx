import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { App } from './App';
import photoAttributionCatalog from '../public/photo-attributions.json';
import { CHAPTERS, HERO, ITEMS } from './data/activities';
import type { Activity } from './domain/activity';

const activities: readonly Activity[] = ITEMS;

beforeEach(() => {
  window.localStorage.clear();
  window.history.replaceState(null, '', '/');
});

afterEach(() => {
  cleanup();
  document.documentElement.style.overflow = '';
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('App', () => {
  it('renders the complete guide through the React component tree', () => {
    const { container } = render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: 'Dubai activities' }))
      .toBeInTheDocument();
    expect(container.querySelector('.arrival-bar')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'The Nest by Nara' })).toBeInTheDocument();
    expect(container.querySelectorAll('section.chapter')).toHaveLength(CHAPTERS.length);
    expect(container.querySelectorAll('.activity-card')).toHaveLength(activities.length);
    expect(screen.queryByRole('heading', { name: 'The Wall' })).not.toBeInTheDocument();
  });

  it('keeps the new animal chapter last with special treatments dispersed', () => {
    const animalIds = activities
      .filter(({ ch }) => ch === 'animals')
      .map(({ id }) => id);
    const animalItems = activities.filter(({ ch }) => ch === 'animals');

    expect(CHAPTERS.at(-1)).toEqual({ key: 'animals', name: 'Fur, feathers and scales' });
    expect(animalIds).toEqual([
      'rasalkhor',
      'falconhospital',
      'turtlerehab',
      'platinumcamel',
      'vibrissae',
      'camelfarm',
      'boomah',
      'fluffin',
    ]);
    expect(animalItems.flatMap((item, index) => item.ahead ? [index] : [])).toEqual([1, 3, 5]);
    expect(animalItems.some(({ dated }) => Boolean(dated))).toBe(false);
    expect(HERO).toEqual(['nest', 'teamlab', 'rasalkhor', 'elrow', 'skydive', 'laperle']);
  });

  it('opens details from passive card space', () => {
    render(<App />);
    const card = screen.getByRole('heading', { name: 'Honeycomb Hi-Fi' }).closest('.activity-card');
    if (!(card instanceof HTMLElement)) throw new Error('Expected Honeycomb Hi-Fi activity card');

    fireEvent.click(card);

    expect(screen.getByRole('dialog', { name: 'Honeycomb Hi-Fi' })).toBeInTheDocument();
    expect(screen.getByAltText('Honeycomb Hi-Fi, photo 1 of 4')).toBeInTheDocument();
    expect(window.location.hash).toBe('#activity-honeycomb');
  });

  it('opens a hero sheet from its passive text surface and restores its detail link', async () => {
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => undefined);
    render(<App />);
    const hero = screen.getByRole('region', { name: 'Featured activities' });
    const detailLink = within(hero).getByRole('link', { name: 'More' });

    fireEvent.click(within(hero).getByRole('heading', { name: 'The Nest by Nara' }));

    expect(screen.getByRole('dialog', { name: 'The Nest by Nara' })).toBeInTheDocument();
    expect(window.location.hash).toBe('#activity-nest');

    fireEvent.click(screen.getByRole('button', { name: 'Close activity details' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'The Nest by Nara' })).not.toBeInTheDocument();
    });
    expect(detailLink).toHaveFocus();
    expect(back).toHaveBeenCalledOnce();
  });

  it('opens a directly linked chapter as the only expanded section', () => {
    window.history.replaceState(null, '', '/#animals');
    const { container } = render(<App />);

    expect(screen.getByRole('button', { name: 'Fur, feathers and scales' }))
      .toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Nights that go loud' }))
      .toHaveAttribute('aria-expanded', 'false');
    expect(container.querySelectorAll('.activity-card')).toHaveLength(8);
    expect(screen.getByRole('heading', { name: 'Ras Al Khor Wildlife Sanctuary' }))
      .toBeInTheDocument();
  });

  it('opens every chapter when loaded directly at the everything route', () => {
    window.history.replaceState(null, '', '/guide/#everything');
    const { container } = render(<App />);

    expect(container.querySelectorAll('.chapter__toggle')).toHaveLength(CHAPTERS.length);
    container.querySelectorAll('.chapter__toggle').forEach((toggle) => {
      expect(toggle).toHaveAttribute('aria-expanded', 'true');
    });
    expect(window.location.hash).toBe('#everything');
  });

  it('restores every chapter through the explicit everything history route', async () => {
    window.history.replaceState(null, '', '/guide/?from=message#animals');
    const pushState = vi.spyOn(window.history, 'pushState');
    const { container } = render(<App />);
    const desktopNavigation = screen.getByRole('navigation', {
      name: 'Activity chapters on this page',
    });

    fireEvent.click(within(desktopNavigation).getByRole('button', { name: 'Open everything' }));

    await waitFor(() => {
      expect(container.querySelectorAll('.chapter__toggle')).toHaveLength(CHAPTERS.length);
      container.querySelectorAll('.chapter__toggle').forEach((toggle) => {
        expect(toggle).toHaveAttribute('aria-expanded', 'true');
      });
    });
    expect(pushState).toHaveBeenCalledWith({}, '', '/guide/?from=message#everything');
    expect(window.location.pathname).toBe('/guide/');
    expect(window.location.search).toBe('?from=message');
    expect(window.location.hash).toBe('#everything');

    actHistory('/guide/?from=message#animals');
    await waitFor(() => {
      expect(container.querySelectorAll('.chapter__toggle[aria-expanded="true"]')).toHaveLength(1);
      expect(screen.getByRole('button', { name: 'Fur, feathers and scales' }))
        .toHaveAttribute('aria-expanded', 'true');
    });

    actHistory('/guide/?from=message#everything');
    await waitFor(() => {
      expect(container.querySelectorAll('.chapter__toggle[aria-expanded="true"]'))
        .toHaveLength(CHAPTERS.length);
    });
  });

  it('opens a directly linked activity and closes it onto its owning chapter', async () => {
    window.history.replaceState(null, '', '/guide/?from=message#activity-rasalkhor');
    render(<App />);

    expect(screen.getByRole('dialog', { name: 'Ras Al Khor Wildlife Sanctuary' }))
      .toBeInTheDocument();
    expect(document.getElementById('activity-rasalkhor')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Close activity details' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Ras Al Khor Wildlife Sanctuary' }))
        .not.toBeInTheDocument();
    });
    expect(window.location.pathname).toBe('/guide/');
    expect(window.location.search).toBe('?from=message');
    expect(window.location.hash).toBe('#animals');
    expect(screen.getByRole('button', { name: 'Fur, feathers and scales' })).toHaveFocus();
  });

  it('opens the footer credits link as a history-aware sheet', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(photoAttributionCatalog),
      ok: true,
      status: 200,
    }));
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => undefined);
    render(<App />);
    const link = screen.getByRole('link', { name: 'Photo credits' });
    link.focus();

    fireEvent.click(link);

    const dialog = screen.getByRole('dialog', { name: 'Photo credits' });
    expect(window.location.hash).toBe('#credits');
    expect(await within(dialog).findByRole('heading', { name: 'Fur, feathers and scales' }))
      .toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: 'Ras Al Khor Wildlife Sanctuary' }))
      .toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole('button', { name: 'Close photo credits' }));
    await waitFor(() => { expect(screen.queryByRole('dialog', { name: 'Photo credits' })).not.toBeInTheDocument(); });
    expect(back).toHaveBeenCalledOnce();
    expect(link).toHaveFocus();
  });

  it('closes a direct credits link without leaving the guide', async () => {
    window.history.replaceState(null, '', '/guide/?from=message#credits');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(photoAttributionCatalog),
      ok: true,
      status: 200,
    }));
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Close photo credits' }));

    await waitFor(() => { expect(screen.queryByRole('dialog', { name: 'Photo credits' })).not.toBeInTheDocument(); });
    expect(window.location.pathname).toBe('/guide/');
    expect(window.location.search).toBe('?from=message');
    expect(window.location.hash).toBe('');
    expect(screen.getByRole('link', { name: 'Photo credits' })).toHaveFocus();
  });

  it('opens the firsthand outcome ledger from its footer anchor', async () => {
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => undefined);
    render(<App />);
    const link = screen.getByRole('link', { name: 'Tried & decided' });
    link.focus();

    fireEvent.click(link);

    const dialog = screen.getByRole('dialog', { name: 'Tried & decided' });
    expect(window.location.hash).toBe('#archive');
    expect(within(dialog).getByRole('heading', { name: 'Boulder Zone' })).toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: 'Soho Garden, HIVE and CODE' }))
      .toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: 'Brass Monkey · City Walk' }))
      .toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: 'Amazónico Dubai' })).toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: 'Ting Irie' })).toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: 'Meowtropolis Cat Café' })).toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: "Roberto's" })).toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: 'Salmon Guru' })).toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: 'Brunch & Cake' })).toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: 'Dubai Butterfly Garden' })).toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: 'The Wall' })).toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: 'Fashion Avenue at Dubai Mall' }))
      .toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: 'The Pods' })).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole('button', { name: 'Close tried and decided' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Tried & decided' })).not.toBeInTheDocument();
    });
    expect(back).toHaveBeenCalledOnce();
    expect(link).toHaveFocus();
  });

  it('closes a direct archive link without leaving the guide', async () => {
    window.history.replaceState(null, '', '/guide/?from=message#archive');
    render(<App />);

    expect(screen.getByRole('dialog', { name: 'Tried & decided' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close tried and decided' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Tried & decided' })).not.toBeInTheDocument();
    });
    expect(window.location.pathname).toBe('/guide/');
    expect(window.location.search).toBe('?from=message');
    expect(window.location.hash).toBe('');
    expect(screen.getByRole('link', { name: 'Tried & decided' })).toHaveFocus();
  });

  it('routes archive summaries to one open outcome group without adding a close step', async () => {
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => undefined);
    const replaceState = vi.spyOn(window.history, 'replaceState');
    render(<App />);
    fireEvent.click(screen.getByRole('link', { name: 'Tried & decided' }));
    const archive = screen.getByRole('dialog', { name: 'Tried & decided' });

    fireEvent.click(within(archive).getByRole('link', {
      name: 'Show 4 Tried archive entries',
    }));

    expect(window.location.hash).toBe('#archive-tried');
    expect(replaceState).toHaveBeenLastCalledWith(
      expect.any(Object),
      '',
      '/#archive-tried',
    );
    const selectedArchive = screen.getByRole('dialog', { name: 'Tried & decided' });
    expect(within(selectedArchive).getByRole('button', { name: /^TriedTried in person/ }))
      .toHaveAttribute('aria-expanded', 'true');
    expect(within(selectedArchive).getByRole('button', { name: /Tried & liked/ }))
      .toHaveAttribute('aria-expanded', 'false');
    expect(within(selectedArchive).getByRole('button', { name: /Rejected/ }))
      .toHaveAttribute('aria-expanded', 'false');
    expect(within(selectedArchive).getByRole('heading', { name: "Roberto's" }))
      .toBeInTheDocument();
    expect(within(selectedArchive).getByRole('heading', { name: 'Lock, Stock & Barrel · Business Bay' }))
      .toBeInTheDocument();
    expect(within(selectedArchive).queryByRole('heading', { name: 'Boulder Zone' }))
      .not.toBeInTheDocument();

    fireEvent.click(within(selectedArchive).getByRole('button', {
      name: 'Close tried and decided',
    }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Tried & decided' })).not.toBeInTheDocument();
    });
    expect(back).toHaveBeenCalledOnce();
  });

  it('opens a direct archive group link with only that outcome expanded', () => {
    window.history.replaceState(null, '', '/guide/?from=message#archive-rejected');
    render(<App />);
    const archive = screen.getByRole('dialog', { name: 'Tried & decided' });

    expect(within(archive).getByRole('link', {
      name: 'Show 5 Rejected archive entries',
    })).toHaveAttribute('aria-current', 'location');
    expect(within(archive).getByRole('button', { name: /Rejected/ }))
      .toHaveAttribute('aria-expanded', 'true');
    expect(within(archive).getByRole('button', { name: /Tried & liked/ }))
      .toHaveAttribute('aria-expanded', 'false');
    expect(within(archive).getByRole('button', { name: /^TriedTried in person/ }))
      .toHaveAttribute('aria-expanded', 'false');
    expect(within(archive).getByRole('heading', { name: 'The Pods' })).toBeInTheDocument();
    expect(within(archive).queryByRole('heading', { name: "Roberto's" }))
      .not.toBeInTheDocument();
  });

  it('opens an archived card as a full sheet and restores the archive through history', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('link', { name: 'Tried & decided' }));
    const archive = screen.getByRole('dialog', { name: 'Tried & decided' });

    fireEvent.click(within(archive).getByRole('link', {
      name: "Open details for Roberto's",
    }));

    const details = screen.getByRole('dialog', { name: "Roberto's" });
    expect(window.location.hash).toBe('#activity-robertos');
    expect(within(details).getByText('Tried', { selector: '.detail-sheet__outcome-label' }))
      .toBeInTheDocument();
    expect(within(details).queryByRole('button', { name: /favorites/i })).not.toBeInTheDocument();

    actHistory('/#archive');
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'Tried & decided' })).toBeInTheDocument();
    });
  });

  it('closes a direct archived activity link onto the archive', async () => {
    window.history.replaceState(null, '', '/guide/?from=message#activity-robertos');
    render(<App />);

    expect(screen.getByRole('dialog', { name: "Roberto's" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close activity details' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'Tried & decided' })).toBeInTheDocument();
    });
    expect(window.location.hash).toBe('#archive');
    expect(screen.getByRole('dialog', { name: 'Tried & decided' })
      .querySelector('[data-dialog-panel]')).toHaveFocus();
  });

  it('synchronizes an activity sheet with Back and Forward history traversal', async () => {
    render(<App />);
    const card = screen.getByRole('heading', { name: 'Honeycomb Hi-Fi' }).closest('.activity-card');
    if (!(card instanceof HTMLElement)) throw new Error('Expected Honeycomb Hi-Fi activity card');
    fireEvent.click(card);
    expect(screen.getByRole('dialog', { name: 'Honeycomb Hi-Fi' })).toBeInTheDocument();

    actHistory('/');
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Honeycomb Hi-Fi' })).not.toBeInTheDocument();
    });

    actHistory('/#activity-honeycomb');
    expect(await screen.findByRole('dialog', { name: 'Honeycomb Hi-Fi' })).toBeInTheDocument();
  });

  it('navigates chapters through real anchors and clears an excluding filter', async () => {
    const { container } = render(<App />);
    fireEvent.click(screen.getByRole('button', {
      name: 'Show only dated and book-ahead activities',
    }));

    const desktopNavigation = screen.getByRole('navigation', {
      name: 'Activity chapters on this page',
    });
    fireEvent.click(within(desktopNavigation).getByRole('link', {
      name: 'Fur, feathers and scales',
    }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Show only dated and book-ahead activities' }))
        .toHaveAttribute('aria-pressed', 'false');
    });
    expect(window.location.hash).toBe('#animals');
    expect(container.querySelectorAll('.activity-card')).toHaveLength(8);
  });

  it('ignores invalid activity anchors and preserves favorites-list links', () => {
    window.history.replaceState(null, '', '/#activity-retired');
    const { unmount } = render(<App />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open favorites, 0 saved' })).toBeInTheDocument();

    unmount();
    window.history.replaceState(null, '', '/#list=rasalkhor%2Cunknown%2Crasalkhor');
    render(<App />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open favorites, 1 saved' })).toBeInTheDocument();
  });

  it('keeps a favorite synchronized across the hero, storage, and favorites dialog', () => {
    render(<App />);
    const hero = screen.getByRole('region', { name: 'Featured activities' });

    fireEvent.click(
      within(hero).getByRole('button', { name: 'Save The Nest by Nara to favorites' }),
    );
    expect(within(hero).getByRole('button', { name: 'Remove The Nest by Nara from favorites' }))
      .toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Open favorites, 1 saved' })).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem('dubai-activities.favs.v1') ?? '[]'))
      .toEqual(['nest']);
    expect(screen.queryByRole('dialog', { name: 'The Nest by Nara' })).not.toBeInTheDocument();
    expect(window.location.hash).toBe('');

    fireEvent.click(screen.getByRole('button', { name: 'Open favorites, 1 saved' }));
    const favoritesDialog = screen.getByRole('dialog', { name: 'The ones you want' });
    expect(favoritesDialog).toHaveTextContent('The Nest by Nara');

    fireEvent.click(
      within(favoritesDialog).getByRole('link', { name: 'Open details for The Nest by Nara' }),
    );
    expect(screen.queryByRole('dialog', { name: 'The ones you want' })).not.toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'The Nest by Nara' })).toBeInTheDocument();
    expect(window.location.hash).toBe('#activity-nest');
  });

  it('filters the guide to dated and book-ahead activities and removes empty chapters', () => {
    const { container } = render(<App />);
    const planAheadActivities = activities.filter(({ ahead, dated }) => Boolean(dated ?? ahead));
    const planAheadChapterCount = new Set(
      planAheadActivities.map(({ ch }) => ch),
    ).size;

    fireEvent.click(
      screen.getByRole('button', { name: 'Show only dated and book-ahead activities' }),
    );

    expect(container.querySelectorAll('.activity-card')).toHaveLength(planAheadActivities.length);
    expect(container.querySelectorAll('section.chapter')).toHaveLength(planAheadChapterCount);
    expect(screen.queryByRole('heading', { name: 'Honeycomb Hi-Fi' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'ATB, Solarstone & Steve Allen' }))
      .toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'The Nest by Nara' }))
      .toBeInTheDocument();
  });

  it('filters to firsthand recommendations and marks every verified activity', () => {
    const { container } = render(<App />);
    const boulderCard = screen.getByRole('heading', { name: 'Boulder Zone' })
      .closest('.activity-card');
    const sohoCard = screen.getByRole('heading', { name: 'Soho Garden, HIVE and CODE' })
      .closest('.activity-card');
    const bluCard = screen.getByRole('heading', { name: 'BLU Dubai' })
      .closest('.activity-card');
    const brassMonkeyCard = screen.getByRole('heading', { name: 'Brass Monkey · City Walk' })
      .closest('.activity-card');
    const amazonicoCard = screen.getByRole('heading', { name: 'Amazónico Dubai' })
      .closest('.activity-card');
    const tingIrieCard = screen.getByRole('heading', { name: 'Ting Irie' })
      .closest('.activity-card');
    expect(boulderCard).not.toBeNull();
    expect(sohoCard).not.toBeNull();
    expect(bluCard).not.toBeNull();
    expect(brassMonkeyCard).not.toBeNull();
    expect(amazonicoCard).not.toBeNull();
    expect(tingIrieCard).not.toBeNull();
    expect(within(boulderCard as HTMLElement).getByRole('img', { name: 'Tried and liked' }))
      .toHaveClass('verified-stamp');
    expect(within(sohoCard as HTMLElement).getByRole('img', { name: 'Tried and liked' }))
      .toHaveClass('verified-stamp');
    for (const verifiedCard of [bluCard, brassMonkeyCard, amazonicoCard, tingIrieCard]) {
      expect(within(verifiedCard as HTMLElement).getByRole('img', { name: 'Tried and liked' }))
        .toHaveClass('verified-stamp');
    }

    fireEvent.click(screen.getByRole('button', {
      name: 'Show only tried and liked activities',
    }));

    expect(container.querySelectorAll('section.chapter')).toHaveLength(3);
    expect(container.querySelectorAll('.activity-card')).toHaveLength(6);
    expect(screen.getByRole('heading', { name: 'Soho Garden, HIVE and CODE' }))
      .toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'BLU Dubai' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Amazónico Dubai' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Ting Irie' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show all activities' }))
      .toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Show only dated and book-ahead activities' }))
      .toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(screen.getByRole('heading', { name: 'Boulder Zone' }));
    const dialog = screen.getByRole('dialog', { name: 'Boulder Zone' });
    expect(within(dialog).getByText('Tried & liked', { selector: '.detail-sheet__outcome-label' }))
      .toBeInTheDocument();
  });

  it('treats planning filters as mutually exclusive modes', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', {
      name: 'Show only tried and liked activities',
    }));
    fireEvent.click(screen.getByRole('button', {
      name: 'Show only dated and book-ahead activities',
    }));

    expect(screen.getByRole('button', { name: 'Show only tried and liked activities' }))
      .toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Show all activities' }))
      .toHaveTextContent('✕ Plan ahead');
  });

  it.each([
    'Show only dated and book-ahead activities',
    'Show only tried and liked activities',
  ])('expands every section when changing the %s filter', async (filterLabel) => {
    const { container } = render(<App />);
    const desktopNavigation = screen.getByRole('navigation', {
      name: 'Activity chapters on this page',
    });

    fireEvent.click(within(desktopNavigation).getByRole('link', {
      name: 'Fur, feathers and scales',
    }));
    expect(screen.getByRole('button', { name: 'Nights that go loud' }))
      .toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(screen.getByRole('button', { name: filterLabel }));
    await waitFor(() => {
      const visibleToggles = container.querySelectorAll('.chapter__toggle');
      expect(visibleToggles.length).toBeGreaterThan(0);
      visibleToggles.forEach((toggle) => {
        expect(toggle).toHaveAttribute('aria-expanded', 'true');
      });
    });
    const firstVisibleToggle = container.querySelector<HTMLButtonElement>('.chapter__toggle');
    if (!firstVisibleToggle) throw new Error('Expected a filtered chapter toggle');
    fireEvent.click(firstVisibleToggle);
    expect(firstVisibleToggle).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'Show all activities' }));
    await waitFor(() => {
      expect(container.querySelectorAll('.chapter__toggle')).toHaveLength(CHAPTERS.length);
      container.querySelectorAll('.chapter__toggle').forEach((toggle) => {
        expect(toggle).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });
});

function actHistory(url: string) {
  // pushState itself is silent; popstate represents the browser's Back/Forward notification.
  window.history.replaceState(null, '', url);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
