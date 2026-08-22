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

    expect(screen.getByRole('heading', { level: 1, name: 'For Naima' })).toBeInTheDocument();
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
      'butterflygarden',
      'meowtropolis',
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
    expect(container.querySelectorAll('.activity-card')).toHaveLength(9);
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
    expect(within(dialog).getByRole('heading', { name: 'The Wall' })).toBeInTheDocument();

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
    fireEvent.click(screen.getByRole('button', { name: 'Show only activities to book ahead' }));

    const desktopNavigation = screen.getByRole('navigation', {
      name: 'Activity chapters on this page',
    });
    fireEvent.click(within(desktopNavigation).getByRole('link', {
      name: 'Fur, feathers and scales',
    }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Show only activities to book ahead' }))
        .toHaveAttribute('aria-pressed', 'false');
    });
    expect(window.location.hash).toBe('#animals');
    expect(container.querySelectorAll('.activity-card')).toHaveLength(9);
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
    expect(JSON.parse(window.localStorage.getItem('naima.favs.v1') ?? '[]')).toEqual(['nest']);
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

  it('filters the guide to book-ahead activities and removes empty chapters', () => {
    const { container } = render(<App />);
    const aheadCount = activities.filter(({ ahead }) => Boolean(ahead)).length;
    const aheadChapterCount = new Set(
      activities.filter(({ ahead }) => Boolean(ahead)).map(({ ch }) => ch),
    ).size;

    fireEvent.click(
      screen.getByRole('button', { name: 'Show only activities to book ahead' }),
    );

    expect(container.querySelectorAll('.activity-card')).toHaveLength(aheadCount);
    expect(container.querySelectorAll('section.chapter')).toHaveLength(aheadChapterCount);
    expect(screen.queryByRole('heading', { name: 'Honeycomb Hi-Fi' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'The Nest by Nara' }))
      .toBeInTheDocument();
  });

  it('filters to firsthand recommendations and marks Boulder Zone in both views', () => {
    const { container } = render(<App />);
    const boulderCard = screen.getByRole('heading', { name: 'Boulder Zone' })
      .closest('.activity-card');
    expect(boulderCard).not.toBeNull();
    expect(within(boulderCard as HTMLElement).getByRole('img', { name: 'Tried and liked' }))
      .toHaveClass('verified-stamp');

    fireEvent.click(screen.getByRole('button', {
      name: 'Show only tried and liked activities',
    }));

    expect(container.querySelectorAll('section.chapter')).toHaveLength(1);
    expect(container.querySelectorAll('.activity-card')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Show all activities' }))
      .toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Show only activities to book ahead' }))
      .toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(screen.getByRole('heading', { name: 'Boulder Zone' }));
    const dialog = screen.getByRole('dialog', { name: 'Boulder Zone' });
    expect(within(dialog).getByText('Tried & liked', { selector: '.detail-sheet__verified' }))
      .toBeInTheDocument();
  });

  it('treats planning filters as mutually exclusive modes', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', {
      name: 'Show only tried and liked activities',
    }));
    fireEvent.click(screen.getByRole('button', {
      name: 'Show only activities to book ahead',
    }));

    expect(screen.getByRole('button', { name: 'Show only tried and liked activities' }))
      .toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Show all activities' }))
      .toHaveTextContent('✕ Book ahead');
  });

  it.each([
    'Show only activities to book ahead',
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
