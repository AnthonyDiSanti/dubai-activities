import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ARCHIVE_ENTRIES } from '../data/archive';
import { ARCHIVE_ACTIVITY_DETAILS } from '../data/archive';
import { ITEMS } from '../data/activities';
import { ArchiveDialog } from './ArchiveDialog';

afterEach(() => {
  cleanup();
  document.documentElement.style.overflow = '';
});

describe('ArchiveDialog', () => {
  const boulderZone = ITEMS.find(({ id }) => id === 'boulderzone');
  if (!boulderZone) throw new Error('Expected active Boulder Zone data');
  const activities = [boulderZone, ...ARCHIVE_ACTIVITY_DETAILS];

  it('separates liked, merely tried, and rejected firsthand outcomes', () => {
    render(
      <ArchiveDialog
        activities={activities}
        entries={ARCHIVE_ENTRIES}
        onClose={vi.fn()}
        onOpenActivity={vi.fn()}
      />,
    );

    const dialog = screen.getByRole('dialog', { name: 'Tried & decided' });
    const verified = within(dialog).getByRole('button', { name: /Tried & liked/ })
      .closest('section');
    const tried = within(dialog).getByRole('button', { name: /^TriedTried in person/ })
      .closest('section');
    const rejected = within(dialog).getByRole('button', { name: /Rejected/ })
      .closest('section');
    if (!verified || !tried || !rejected) throw new Error('Expected all archive sections');
    expect(verified).toHaveTextContent('Boulder Zone');
    expect(verified).not.toHaveTextContent('The Wall');
    expect(tried).toHaveTextContent('Meowtropolis Cat Café');
    expect(tried).toHaveTextContent("Roberto's");
    expect(tried).toHaveTextContent('Salmon Guru');
    expect(tried).not.toHaveTextContent('Boulder Zone');
    expect(rejected).toHaveTextContent('The Wall');
    expect(rejected).toHaveTextContent('Brunch & Cake');
    expect(rejected).toHaveTextContent('Dubai Butterfly Garden');
    expect(rejected).not.toHaveTextContent('Boulder Zone');
    expect(within(dialog).getAllByRole('article')).toHaveLength(7);
    expect(within(verified).getByRole('img', { name: 'Tried and liked' }))
      .toBeInTheDocument();
    expect(within(tried).queryByRole('img', { name: 'Tried and liked' }))
      .not.toBeInTheDocument();
    expect(dialog).not.toHaveTextContent('It was okay');
  });

  it('opens and closes each outcome section from its full-width header', () => {
    render(
      <ArchiveDialog
        activities={activities}
        entries={ARCHIVE_ENTRIES}
        onClose={vi.fn()}
        onOpenActivity={vi.fn()}
      />,
    );

    const triedToggle = screen.getByRole('button', { name: /^TriedTried in person/ });
    expect(triedToggle).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(triedToggle);
    expect(triedToggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText("Roberto's")).not.toBeInTheDocument();
    expect(document.getElementById('archive-tried-activities')).toHaveAttribute('hidden');
    fireEvent.click(triedToggle);
    expect(triedToggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText("Roberto's")).toBeInTheDocument();
  });

  it('routes both close treatments through its owner', () => {
    const onClose = vi.fn();
    render(
      <ArchiveDialog
        activities={activities}
        entries={ARCHIVE_ENTRIES}
        onClose={onClose}
        onOpenActivity={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Close tried and decided' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('reuses photographic activity cards and durable activity links', () => {
    const onOpenActivity = vi.fn();
    render(
      <ArchiveDialog
        activities={activities}
        entries={ARCHIVE_ENTRIES}
        onClose={vi.fn()}
        onOpenActivity={onOpenActivity}
      />,
    );

    expect(document.querySelectorAll('.activity-card')).toHaveLength(7);
    expect(document.querySelector('#archive-activity-robertos .media-fill')).toHaveAttribute(
      'src',
      'photos/robertos-01.jpg',
    );
    expect(document.querySelector('.archive-card__placeholder')).not.toBeInTheDocument();
    const robertos = screen.getByRole('link', { name: "Open details for Roberto's" });
    expect(robertos).toHaveAttribute('href', '#activity-robertos');
    fireEvent.click(robertos);
    expect(onOpenActivity).toHaveBeenCalledWith('robertos');
  });
});
