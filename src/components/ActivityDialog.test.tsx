import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { Activity } from '../domain/activity';
import type { ArchiveEntry } from '../domain/archive';
import { ActivityDialog } from './ActivityDialog';

const activity: Activity = {
  id: 'teamlab',
  ch: 'strange',
  name: 'teamLab Phenomena',
  blurb: 'A whole building of responsive environments.',
  eyebrow: 'Wear something you can get wet',
  when: 'Daily, timed entry',
  where: 'Saadiyat, Abu Dhabi',
  ahead: 'Timed slots are limited',
  facts: [
    { label: 'Duration', value: 'Two to three hours' },
    { label: 'Price', value: 'Confirm at checkout' },
  ],
  advisory: 'Some rooms use water and mirrored floors; dress for both.',
  cta: 'Step inside',
  book: 'https://book.example/teamlab',
  site: 'https://site.example/teamlab',
  ig: 'https://instagram.com/teamlab',
  photos: 3,
};

const secondActivity: Activity = {
  id: 'nest',
  ch: 'quiet',
  name: 'The Nest by Nara',
  blurb: 'A private glass-roofed pod in the desert.',
  when: 'Overnight',
  where: 'Al Marmoom Reserve',
  cta: 'Book a pod',
  site: 'https://site.example/nest',
  photos: 2,
};

const datedActivity: Activity = {
  ...activity,
  id: 'atb',
  name: 'ATB, Solarstone & Steve Allen',
  dated: { d: '05', m: 'SEP', w: 'SAT', on: '2026-09-05' },
};

const archivedActivity: Activity = {
  id: 'robertos',
  ch: 'dinners',
  name: "Roberto's",
  blurb: 'A restaurant preserved as a firsthand record.',
  when: 'Tried in person',
  where: 'DIFC',
  cta: 'Archived after visiting',
  noPhoto: true,
  photos: 0,
};

const archiveEntry: ArchiveEntry = {
  id: 'robertos',
  name: "Roberto's",
  note: 'Fine, but not memorable enough to recommend.',
  originalChapterKey: 'dinners',
  originalChapterName: 'Long dinners',
  recordedOn: '2026-08-23',
  status: 'tried',
};

afterEach(() => {
  cleanup();
  document.documentElement.style.overflow = '';
});

describe('ActivityDialog', () => {
  it('advances from the full image surface, wraps, and lets pills jump backward', () => {
    render(
      <ActivityDialog
        activity={activity}
        isFavorite={false}
        isVerified={false}
        onClose={vi.fn()}
        onToggleFavorite={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Advance to photo 2 of 3' }));
    expect(screen.getByAltText('teamLab Phenomena, photo 2 of 3')).toHaveAttribute(
      'src',
      'photos/teamlab-02.jpg',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Advance to photo 3 of 3' }));
    fireEvent.click(screen.getByRole('button', { name: 'Advance to photo 1 of 3' }));
    expect(screen.getByAltText('teamLab Phenomena, photo 1 of 3')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Show photo 3 of 3' }));
    expect(screen.getByAltText('teamLab Phenomena, photo 3 of 3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show photo 3 of 3' })).toHaveAttribute(
      'aria-current',
      'true',
    );
  });

  it('resets immediately to photo one when the selected activity changes', () => {
    const { rerender } = render(
      <ActivityDialog
        activity={activity}
        isFavorite={false}
        isVerified={false}
        onClose={vi.fn()}
        onToggleFavorite={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Show photo 3 of 3' }));

    rerender(
      <ActivityDialog
        activity={secondActivity}
        isFavorite={false}
        isVerified={false}
        onClose={vi.fn()}
        onToggleFavorite={vi.fn()}
      />,
    );

    expect(screen.getByAltText('The Nest by Nara, photo 1 of 2')).toHaveAttribute(
      'src',
      'photos/nest-01.jpg',
    );
  });

  it('keeps the overlaid Save action isolated from gallery advancement', () => {
    const onToggleFavorite = vi.fn();
    render(
      <ActivityDialog
        activity={activity}
        isFavorite={false}
        isVerified={false}
        onClose={vi.fn()}
        onToggleFavorite={onToggleFavorite}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Save teamLab Phenomena to favorites' }));

    expect(onToggleFavorite).toHaveBeenCalledOnce();
    expect(onToggleFavorite).toHaveBeenCalledWith('teamlab');
    expect(screen.getByAltText('teamLab Phenomena, photo 1 of 3')).toHaveAttribute(
      'src',
      'photos/teamlab-01.jpg',
    );
  });

  it('offers both desktop and mobile close treatments', () => {
    const onClose = vi.fn();
    render(
      <ActivityDialog
        activity={activity}
        isFavorite
        isVerified={false}
        onClose={onClose}
        onToggleFavorite={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Close activity details' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('renders structured practical facts and a candid planning advisory', () => {
    render(
      <ActivityDialog
        activity={activity}
        isFavorite={false}
        isVerified={false}
        onClose={vi.fn()}
        onToggleFavorite={vi.fn()}
      />,
    );

    expect(screen.getByText('Duration')).toBeInTheDocument();
    expect(screen.getByText('Two to three hours')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Confirm at checkout')).toBeInTheDocument();
    expect(screen.getByText('Worth knowing')).toBeInTheDocument();
    expect(screen.getByText(activity.advisory ?? '')).toBeInTheDocument();
  });

  it('carries the dated-card calendar into the detail sheet', () => {
    render(
      <ActivityDialog
        activity={datedActivity}
        isFavorite={false}
        isVerified={false}
        onClose={vi.fn()}
        onToggleFavorite={vi.fn()}
      />,
    );

    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('SAT 05 SEP · 2026')).toBeInTheDocument();
  });

  it.each([
    [{ d: '30', m: 'AUG', w: 'STARTS', on: '2026-08-30' }, 'STARTS 30 AUG · 2026'],
    [{ d: '3–8', m: 'NOV', w: 'TUE–SUN', on: '2026-11-03' }, 'TUE–SUN 3–8 NOV · 2026'],
  ] as const)('formats range and series dates without losing the trip year', (dated, display) => {
    render(
      <ActivityDialog
        activity={{ ...activity, dated }}
        isFavorite={false}
        isVerified={false}
        onClose={vi.fn()}
        onToggleFavorite={vi.fn()}
      />,
    );

    expect(screen.getByText(display)).toBeInTheDocument();
  });

  it('carries the firsthand recommendation into the detail sheet', () => {
    render(
      <ActivityDialog
        activity={activity}
        isFavorite={false}
        isVerified
        onClose={vi.fn()}
        onToggleFavorite={vi.fn()}
      />,
    );

    expect(screen.getByText('Tried & liked', { selector: '.detail-sheet__verified' }))
      .toBeInTheDocument();
  });

  it('renders an inactive archive record without inventing a gallery or favorite action', () => {
    render(
      <ActivityDialog
        activity={archivedActivity}
        archiveEntry={archiveEntry}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByRole('dialog', { name: "Roberto's" })).toBeInTheDocument();
    expect(screen.getByText('Decision record')).toBeInTheDocument();
    expect(screen.getByText('Tried', { selector: '.detail-sheet__outcome-label' }))
      .toBeInTheDocument();
    expect(screen.getByText(archiveEntry.note)).toBeInTheDocument();
    expect(screen.getByText('Recorded 23 Aug 2026')).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Activity photos' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /favorites/i })).not.toBeInTheDocument();
  });
});
