import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { Activity, Chapter } from '../domain/activity';
import { FavoritesDialog } from './FavoritesDialog';

const chapters: readonly Chapter[] = [
  { key: 'quiet', name: 'Quiet and dark' },
  { key: 'strange', name: 'Genuinely strange' },
];

const favorites: readonly Activity[] = [
  {
    id: 'nest',
    ch: 'quiet',
    name: 'The Nest',
    blurb: 'A private night in the desert.',
    when: 'Overnight',
    where: 'Al Marmoom Reserve',
    cta: 'Book a pod',
    photos: 2,
  },
  {
    id: 'teamlab',
    ch: 'strange',
    name: 'teamLab',
    blurb: 'A building full of changing light.',
    when: 'Daily',
    where: 'Saadiyat',
    cta: 'Step inside',
    photos: 3,
  },
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
        onToggleFavorite={onToggleFavorite}
      />,
    );

    expect(screen.getByRole('dialog', { name: 'The ones you want' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Remove The Nest from favorites' }));

    expect(onToggleFavorite).toHaveBeenCalledOnce();
    expect(onToggleFavorite).toHaveBeenCalledWith('nest');
    fireEvent.click(screen.getByRole('button', { name: 'Close favorites' }));
    expect(onClose).toHaveBeenCalledOnce();
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
        onToggleFavorite={vi.fn()}
      />,
    );

    expect(screen.getByText(/Nothing saved yet/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Copy as a message' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Share favorites' })).not.toBeInTheDocument();
  });
});
