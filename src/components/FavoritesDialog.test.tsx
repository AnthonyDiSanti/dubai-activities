import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { Activity, Chapter } from '../domain/activity';
import { FavoritesDialog } from './FavoritesDialog';

const chapters: readonly Chapter[] = [
  { key: 'quiet', name: 'Quiet and dark' },
  { key: 'strange', name: 'Genuinely strange' },
];

const nestFavorite: Activity = {
  id: 'nest',
  ch: 'quiet',
  name: 'The Nest',
  blurb: 'A private night in the desert.',
  when: 'Overnight',
  where: 'Al Marmoom Reserve',
  cta: 'Book a pod',
  photos: 2,
};

const teamlabFavorite: Activity = {
  id: 'teamlab',
  ch: 'strange',
  name: 'teamLab',
  blurb: 'A building full of changing light.',
  when: 'Daily',
  where: 'Saadiyat',
  cta: 'Step inside',
  photos: 3,
};

const favorites: readonly Activity[] = [nestFavorite, teamlabFavorite];

const organizedFavorites: readonly Activity[] = [
  teamlabFavorite,
  {
    ...nestFavorite,
    id: 'later-date',
    name: 'Later date',
    dated: { d: '24', m: 'OCT', w: 'SAT', on: '2026-10-24' },
    ahead: 'Tickets sell out',
  },
  {
    ...nestFavorite,
    id: 'reserve-first',
    name: 'Reserve first',
    ahead: 'Only a few places each night',
  },
  {
    ...nestFavorite,
    id: 'earlier-date',
    name: 'Earlier date',
    dated: { d: '29', m: 'AUG', w: 'SAT', on: '2026-08-29' },
  },
  nestFavorite,
];

const originalClipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
const originalShare = Object.getOwnPropertyDescriptor(navigator, 'share');
const originalCanShare = Object.getOwnPropertyDescriptor(navigator, 'canShare');

function restoreNavigatorProperty(name: 'canShare' | 'clipboard' | 'share', descriptor?: PropertyDescriptor) {
  if (descriptor) Object.defineProperty(navigator, name, descriptor);
  else Reflect.deleteProperty(navigator, name);
}

afterEach(() => {
  cleanup();
  restoreNavigatorProperty('clipboard', originalClipboard);
  restoreNavigatorProperty('share', originalShare);
  restoreNavigatorProperty('canShare', originalCanShare);
  document.documentElement.style.overflow = '';
});

describe('FavoritesDialog', () => {
  it('renders saved activities and removes only the selected favorite', () => {
    const onClose = vi.fn();
    const onToggleFavorite = vi.fn();
    render(
      <FavoritesDialog
        chapters={chapters}
        favorites={favorites}
        onClose={onClose}
        onOpenActivity={vi.fn()}
        onToggleFavorite={onToggleFavorite}
      />,
    );

    // The accessible description must work on laptops as well as touch devices.
    expect(screen.getByRole('dialog', { name: 'The ones you want' })).toHaveAccessibleDescription(
      'Saved here, just for you — share them whenever you like.',
    );
    const removeButton = screen.getByRole('button', { name: 'Remove The Nest from favorites' });
    expect(removeButton.querySelector('.cross-icon')).toBeInTheDocument();
    fireEvent.click(removeButton);

    expect(onToggleFavorite).toHaveBeenCalledOnce();
    expect(onToggleFavorite).toHaveBeenCalledWith('nest');
    const closeButton = screen.getByRole('button', { name: 'Close favorites' });
    expect(closeButton.querySelector('.cross-icon')).toBeInTheDocument();
    expect(closeButton).not.toHaveTextContent('×');
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('groups favorites by planning need and sorts dated events chronologically', () => {
    render(
      <FavoritesDialog
        chapters={chapters}
        favorites={organizedFavorites}
        onClose={vi.fn()}
        onOpenActivity={vi.fn()}
        onToggleFavorite={vi.fn()}
      />,
    );

    const dialog = screen.getByRole('dialog', { name: 'The ones you want' });
    const sectionHeadings = within(dialog)
      .getAllByRole('heading', { level: 3 })
      .map((heading) => heading.textContent);
    expect(sectionHeadings).toEqual(['Dated events', 'Book ahead', 'Everything else']);

    const datedSection = within(dialog).getByRole('heading', { name: 'Dated events' })
      .closest('section');
    if (!datedSection) throw new Error('Expected dated favorites section');
    expect(within(datedSection).getAllByRole('link').map((link) => link.textContent)).toEqual([
      expect.stringContaining('Earlier date'),
      expect.stringContaining('Later date'),
    ]);
    expect(datedSection.querySelectorAll('time')[0]).toHaveAttribute('datetime', '2026-08-29');
    expect(datedSection.querySelectorAll('time')[1]).toHaveAttribute('datetime', '2026-10-24');

    const aheadSection = within(dialog).getByRole('heading', { name: 'Book ahead' })
      .closest('section');
    if (!aheadSection) throw new Error('Expected book-ahead favorites section');
    expect(aheadSection).toHaveTextContent('Reserve first');
    expect(aheadSection).not.toHaveTextContent('Later date');
  });

  it('omits the visible group heading when every favorite belongs to one group', () => {
    render(
      <FavoritesDialog
        chapters={chapters}
        favorites={[teamlabFavorite]}
        onClose={vi.fn()}
        onOpenActivity={vi.fn()}
        onToggleFavorite={vi.fn()}
      />,
    );

    const dialog = screen.getByRole('dialog', { name: 'The ones you want' });
    expect(within(dialog).queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
    expect(within(dialog).getByRole('region', { name: 'Everything else' })).toHaveTextContent(
      'teamLab',
    );
  });

  it('opens a saved activity from its native detail link', () => {
    const onOpenActivity = vi.fn();
    render(
      <FavoritesDialog
        chapters={chapters}
        favorites={favorites}
        onClose={vi.fn()}
        onOpenActivity={onOpenActivity}
        onToggleFavorite={vi.fn()}
      />,
    );

    const link = screen.getByRole('link', { name: 'Open details for The Nest' });
    expect(link).toHaveAttribute('href', '#activity-nest');
    fireEvent.click(link);
    expect(onOpenActivity).toHaveBeenCalledWith('nest');
  });

  it('reports clipboard failure in a persistent live region', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('Clipboard permission denied'));
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    render(
      <FavoritesDialog
        chapters={chapters}
        favorites={favorites}
        onClose={vi.fn()}
        onOpenActivity={vi.fn()}
        onToggleFavorite={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Copy as a message' }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent("Favorites couldn't be copied. Try again.");
    });
    expect(screen.getByRole('button', { name: "Couldn't copy — try again" })).toBeInTheDocument();
    expect(writeText).toHaveBeenCalledWith(
      'Things I want to do:\n\n• The Nest — Quiet and dark\n• teamLab — Genuinely strange',
    );
  });

  it('shows native sharing only when the complete payload is supported', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const canShare = vi.fn().mockReturnValue(true);
    Object.defineProperty(navigator, 'share', { configurable: true, value: share });
    Object.defineProperty(navigator, 'canShare', { configurable: true, value: canShare });
    render(
      <FavoritesDialog
        chapters={chapters}
        favorites={favorites}
        onClose={vi.fn()}
        onOpenActivity={vi.fn()}
        onToggleFavorite={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Share favorites' }));

    await waitFor(() => { expect(share).toHaveBeenCalledOnce(); });
    expect(canShare).toHaveBeenCalledWith(expect.objectContaining({ title: 'Things I want to do' }));
    expect(share).toHaveBeenCalledWith(
      expect.objectContaining({ url: expect.stringContaining('#list=nest%2Cteamlab') as string }),
    );
  });

  it('reports a genuine native-share failure but ignores user cancellation', async () => {
    const share = vi
      .fn()
      .mockRejectedValueOnce(new Error('Native handoff failed'))
      .mockRejectedValueOnce(new DOMException('Canceled', 'AbortError'));
    Object.defineProperty(navigator, 'share', { configurable: true, value: share });
    Object.defineProperty(navigator, 'canShare', {
      configurable: true,
      value: vi.fn().mockReturnValue(true),
    });
    render(
      <FavoritesDialog
        chapters={chapters}
        favorites={favorites}
        onClose={vi.fn()}
        onOpenActivity={vi.fn()}
        onToggleFavorite={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Share favorites' }));
    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        "Favorites couldn't be shared. Try copying them instead.",
      );
    });

    fireEvent.click(screen.getByRole('button', { name: 'Share favorites' }));
    await waitFor(() => {
      expect(share).toHaveBeenCalledTimes(2);
      expect(screen.getByRole('status')).toBeEmptyDOMElement();
    });
  });

  it('renders the empty guidance without copy or share actions', () => {
    Object.defineProperty(navigator, 'share', { configurable: true, value: vi.fn() });
    render(
      <FavoritesDialog
        chapters={chapters}
        favorites={[]}
        onClose={vi.fn()}
        onOpenActivity={vi.fn()}
        onToggleFavorite={vi.fn()}
      />,
    );

    // Empty-state guidance must not assume a phone or touch input either.
    expect(screen.getByRole('dialog', { name: 'The ones you want' })).toHaveAccessibleDescription(
      'Saved here, just for you.',
    );
    expect(screen.getByText(/Nothing saved yet/)).toHaveTextContent(
      'Nothing saved yet. Choose the heart on anything you like the look of — we’ll keep it here for you.',
    );
    expect(screen.queryByRole('button', { name: 'Copy as a message' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Share favorites' })).not.toBeInTheDocument();
  });
});
