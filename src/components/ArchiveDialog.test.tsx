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
  const verifiedActivities = ARCHIVE_ENTRIES
    .filter(({ status }) => status === 'verified')
    .map(({ id }) => ITEMS.find((item) => item.id === id));
  if (verifiedActivities.some((activity) => !activity)) {
    throw new Error('Expected every verified archive record to remain active');
  }
  // Mirror App's archive data join so future verified records cannot silently disappear in this fixture.
  const activities = [...verifiedActivities, ...ARCHIVE_ACTIVITY_DETAILS].filter(
    (activity) => activity !== undefined,
  );

  it('separates liked, merely tried, and deliberately rejected outcomes', () => {
    render(
      <ArchiveDialog
        activities={activities}
        entries={ARCHIVE_ENTRIES}
        onClose={vi.fn()}
        onOpenActivity={vi.fn()}
        onSelectStatus={vi.fn()}
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
    expect(verified).toHaveTextContent('Soho Garden, HIVE and CODE');
    expect(verified).toHaveTextContent('BLU Dubai');
    expect(verified).toHaveTextContent('Brass Monkey · City Walk');
    expect(verified).toHaveTextContent('Amazónico Dubai');
    // The paired café visit appears once in the liked group.
    expect(verified).toHaveTextContent('Ting Irie');
    expect(verified).toHaveTextContent('Cat Café Vibrissae & Fluffin · Creek Harbour');
    expect(verified).not.toHaveTextContent('The Wall');
    expect(tried).toHaveTextContent('Meowtropolis Cat Café');
    expect(tried).toHaveTextContent("Roberto's");
    expect(tried).toHaveTextContent('Salmon Guru');
    expect(tried).toHaveTextContent('Lock, Stock & Barrel · Business Bay');
    expect(tried).not.toHaveTextContent('Boulder Zone');
    expect(rejected).toHaveTextContent('The Wall');
    expect(rejected).toHaveTextContent('Mountain Extreme');
    expect(rejected).toHaveTextContent('Brunch & Cake');
    expect(rejected).toHaveTextContent('Dubai Butterfly Garden');
    expect(rejected).toHaveTextContent('Fashion Avenue at Dubai Mall');
    expect(rejected).toHaveTextContent('The Pods');
    expect(rejected).not.toHaveTextContent('Boulder Zone');
    expect(within(dialog).getAllByRole('article')).toHaveLength(17);
    expect(within(verified).getAllByRole('img', { name: 'Tried and liked' }))
      .toHaveLength(7);
    // Outcome totals can match; scope each count to its labeled destination.
    expect(within(dialog).getByRole('link', { name: 'Show 7 Tried & liked archive entries' }))
      .toHaveTextContent('7');
    expect(within(dialog).getByRole('link', { name: 'Show 6 Rejected archive entries' }))
      .toHaveTextContent('6');
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
        onSelectStatus={vi.fn()}
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

  it('links summary counts to isolated archive group views', () => {
    const onSelectStatus = vi.fn();
    render(
      <ArchiveDialog
        activities={activities}
        entries={ARCHIVE_ENTRIES}
        onClose={vi.fn()}
        onOpenActivity={vi.fn()}
        onSelectStatus={onSelectStatus}
      />,
    );

    const triedSummary = screen.getByRole('link', { name: 'Show 4 Tried archive entries' });
    expect(triedSummary).toHaveAttribute('href', '#archive-tried');
    fireEvent.click(triedSummary);

    expect(onSelectStatus).toHaveBeenCalledWith('tried');
    expect(screen.getByRole('button', { name: /^TriedTried in person/ }))
      .toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: /Tried & liked/ }))
      .toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: /Rejected/ }))
      .toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText("Roberto's")).toBeInTheDocument();
    expect(screen.queryByText('Boulder Zone')).not.toBeInTheDocument();
    expect(screen.queryByText('The Wall')).not.toBeInTheDocument();
  });

  it('reconstructs a directly linked archive group as the only open section', () => {
    render(
      <ArchiveDialog
        activeStatus="rejected"
        activities={activities}
        entries={ARCHIVE_ENTRIES}
        onClose={vi.fn()}
        onOpenActivity={vi.fn()}
        onSelectStatus={vi.fn()}
      />,
    );

    expect(screen.getByRole('link', { name: 'Show 6 Rejected archive entries' }))
      .toHaveAttribute('aria-current', 'location');
    expect(screen.getByRole('button', { name: /Rejected/ }))
      .toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: /Tried & liked/ }))
      .toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: /^TriedTried in person/ }))
      .toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('The Wall')).toBeInTheDocument();
    expect(screen.queryByText("Roberto's")).not.toBeInTheDocument();
  });

  it('routes both close treatments through its owner', () => {
    const onClose = vi.fn();
    render(
      <ArchiveDialog
        activities={activities}
        entries={ARCHIVE_ENTRIES}
        onClose={onClose}
        onOpenActivity={vi.fn()}
        onSelectStatus={vi.fn()}
      />,
    );

    const desktopClose = screen.getByRole('button', { name: 'Close tried and decided' });
    expect(desktopClose.querySelector('.cross-icon')).toBeInTheDocument();
    expect(desktopClose).not.toHaveTextContent('×');
    fireEvent.click(desktopClose);
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
        onSelectStatus={vi.fn()}
      />,
    );

    expect(document.querySelectorAll('.activity-card')).toHaveLength(17);
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
