import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { Activity, Chapter } from '../domain/activity';
import { ChapterSection, type ChapterSectionProps } from './ChapterSection';

const chapter: Chapter = { key: 'loud', name: 'Nights that go loud' };

function activity(id: string, extras: Partial<Activity> = {}): Activity {
  return {
    id,
    ch: 'loud',
    name: id,
    blurb: `${id} description`,
    when: 'Evening',
    where: 'Dubai',
    cta: `Open ${id}`,
    photos: 1,
    ...extras,
  };
}

const items: readonly Activity[] = [
  activity('standard-one'),
  activity('dated-late', { dated: { d: '2', m: 'SEP', w: 'WED', on: '2026-09-02' } }),
  activity('standard-two'),
  activity('dated-early', { dated: { d: '1', m: 'SEP', w: 'TUE', on: '2026-09-01' } }),
  activity('ahead', { ahead: 'Limited seats' }),
  activity('no-photo', { noPhoto: true }),
];

function props(overrides: Partial<ChapterSectionProps> = {}): ChapterSectionProps {
  return {
    chapter,
    favoriteIds: new Set(['standard-two']),
    items,
    onOpenActivity: vi.fn(),
    onToggle: vi.fn(),
    onToggleFavorite: vi.fn(),
    open: true,
    verifiedIds: new Set(),
    ...overrides,
  };
}

afterEach(cleanup);

describe('ChapterSection', () => {
  it('keeps the chapter icon lit in a collapsed empty section', () => {
    const { container } = render(<ChapterSection {...props({ items: [], open: false })} />);
    expect(container.querySelector('.chapter-icon')).toHaveAttribute('data-lit', 'true');
    expect(container.querySelector('.ui-icon--chevron')).toHaveAttribute('aria-hidden', 'true');
  });

  it('exposes stable section semantics and collapse controls', () => {
    const onToggle = vi.fn();
    const { container, rerender } = render(<ChapterSection {...props({ onToggle })} />);
    const section = container.querySelector('section');
    const toggle = screen.getByRole('button', { name: chapter.name });

    expect(section).toHaveAttribute('id', chapter.key);
    expect(section).toHaveAttribute('data-screen-label', chapter.name);
    expect(section).toHaveAccessibleName(chapter.name);
    expect(screen.getByRole('heading', { name: chapter.name })).toContainElement(toggle);
    expect(toggle).toHaveAttribute('id', `${chapter.key}-toggle`);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle).toHaveAttribute('aria-controls', `${chapter.key}-activities`);
    fireEvent.click(screen.getByText(chapter.name));
    expect(onToggle).toHaveBeenCalledWith(chapter.key);

    rerender(<ChapterSection {...props({ onToggle, open: false })} />);
    expect(screen.getByRole('button', { name: chapter.name })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(container.querySelector('.chapter__activities')).toHaveAttribute('hidden');
    expect(container.querySelector('.activity-card')).not.toBeInTheDocument();
  });

  it('supports native keyboard activation without losing focus', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<ChapterSection {...props({ onToggle })} />);
    const toggle = screen.getByRole('button', { name: chapter.name });

    toggle.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(onToggle).toHaveBeenNthCalledWith(1, chapter.key);
    expect(onToggle).toHaveBeenNthCalledWith(2, chapter.key);
    expect(toggle).toHaveFocus();
  });

  it('orders dated activities chronologically while preserving the standard treatment rotation', () => {
    const { container } = render(<ChapterSection {...props()} />);
    const cards = [...container.querySelectorAll<HTMLElement>('.activity-card')];
    const names = cards.map((card) => within(card).getByRole('heading').textContent);

    expect(names).toEqual([
      'standard-one',
      'dated-early',
      'standard-two',
      'ahead',
      'dated-late',
      'no-photo',
    ]);
    expect(cards[0]?.querySelector('.card--bleed')).toBeInTheDocument();
    expect(cards[1]?.querySelector('.card--dated')).toBeInTheDocument();
    expect(cards[2]?.querySelector('.card--letter')).toBeInTheDocument();
    expect(cards[3]?.querySelector('.card--ahead')).toBeInTheDocument();
    expect(cards[4]?.querySelector('.card--dated')).toBeInTheDocument();
    expect(cards[5]?.querySelector('.card--type')).toBeInTheDocument();
  });

  it('passes favorite and activity actions through to the card', () => {
    const onOpenActivity = vi.fn();
    const onToggleFavorite = vi.fn();
    render(<ChapterSection {...props({ onOpenActivity, onToggleFavorite })} />);

    fireEvent.click(screen.getByRole('link', { name: 'Open details for standard-one' }));
    fireEvent.click(screen.getByRole('button', { name: 'Remove standard-two from favorites' }));

    expect(onOpenActivity).toHaveBeenCalledWith('standard-one');
    expect(onToggleFavorite).toHaveBeenCalledWith('standard-two');
  });

  it('marks only activities present in the verified ledger', () => {
    render(<ChapterSection {...props({ verifiedIds: new Set(['standard-one']) })} />);

    const verifiedCard = screen.getByRole('heading', { name: 'standard-one' }).closest('.activity-card');
    const unverifiedCard = screen.getByRole('heading', { name: 'standard-two' }).closest('.activity-card');
    expect(verifiedCard).not.toBeNull();
    expect(unverifiedCard).not.toBeNull();
    expect(within(verifiedCard as HTMLElement).getByRole('img', { name: 'Tried and liked' }))
      .toHaveClass('verified-stamp');
    expect(within(unverifiedCard as HTMLElement).queryByRole('img', { name: 'Tried and liked' }))
      .not.toBeInTheDocument();
  });
});
