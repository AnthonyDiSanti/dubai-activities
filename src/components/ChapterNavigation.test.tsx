import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { Chapter } from '../domain/activity';
import {
  ChapterNavigation,
  ChapterSidebar,
  type ChapterNavigationProps,
} from './ChapterNavigation';

const chapters: readonly Chapter[] = [
  { key: 'loud', name: 'Nights that go loud' },
  { key: 'quiet', name: 'Quiet and dark' },
];

function props(overrides: Partial<ChapterNavigationProps> = {}): ChapterNavigationProps {
  return {
    chapters,
    currentChapterKey: 'loud',
    mobileOpen: false,
    onCloseAll: vi.fn(),
    onOpenAll: vi.fn(),
    onSelectChapter: vi.fn(),
    onToggleMobile: vi.fn(),
    onTogglePlanAhead: vi.fn(),
    onToggleVerified: vi.fn(),
    openChapterKeys: new Set(['loud']),
    planAheadOnly: false,
    verifiedOnly: false,
    ...overrides,
  };
}

afterEach(cleanup);

describe('ChapterNavigation', () => {
  it('lights only the current chapter on both navigation surfaces', () => {
    const { container } = render(<><ChapterNavigation {...props()} mobileOpen /><ChapterSidebar {...props()} /></>);
    expect(container.querySelectorAll('.chapter-icon')).toHaveLength(4);
    expect(container.querySelectorAll('.chapter-icon[data-lit="true"]')).toHaveLength(2);
    for (const icon of container.querySelectorAll('.chapter-icon[data-lit="true"]')) {
      expect(icon).toHaveAttribute('data-chapter', 'loud');
    }
  });

  it('connects the sticky menu trigger to its expandable menu', () => {
    const onToggleMobile = vi.fn();
    const initialProps = props({ onToggleMobile });
    const { rerender } = render(<ChapterNavigation {...initialProps} />);
    const menuButton = screen.getByRole('button', { name: /Chapters/ });

    expect(menuButton).toHaveAttribute('aria-controls', 'chapter-navigation-menu');
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link', { name: chapters[0]?.name })).not.toBeInTheDocument();
    fireEvent.click(menuButton);
    expect(onToggleMobile).toHaveBeenCalledOnce();

    rerender(<ChapterNavigation {...initialProps} mobileOpen />);
    expect(screen.getByRole('button', { name: /Close/ })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: chapters[0]?.name })).toHaveAttribute(
      'aria-current',
      'location',
    );
    expect(screen.getByRole('link', { name: chapters[1]?.name })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('routes filtering, chapter selection, and bulk fold actions', () => {
    const onCloseAll = vi.fn();
    const onOpenAll = vi.fn();
    const onSelectChapter = vi.fn();
    const onTogglePlanAhead = vi.fn();
    const onToggleVerified = vi.fn();
    render(
      <ChapterNavigation
        {...props({
          onCloseAll,
          onOpenAll,
          onSelectChapter,
          onTogglePlanAhead,
          onToggleVerified,
        })}
        mobileOpen
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Show only dated and book-ahead activities' }));
    fireEvent.click(screen.getByRole('button', { name: 'Show only tried and liked activities' }));
    fireEvent.click(screen.getByRole('link', { name: chapters[1]?.name }));
    fireEvent.click(screen.getByRole('button', { name: 'Open everything' }));
    fireEvent.click(screen.getByRole('button', { name: 'Fold all' }));

    expect(onTogglePlanAhead).toHaveBeenCalledOnce();
    expect(onToggleVerified).toHaveBeenCalledOnce();
    expect(onSelectChapter).toHaveBeenCalledWith('quiet');
    expect(onOpenAll).toHaveBeenCalledOnce();
    expect(onCloseAll).toHaveBeenCalledOnce();
  });

  it('announces the active firsthand filter as a reversible mode', () => {
    render(<ChapterNavigation {...props({ verifiedOnly: true })} />);

    const filter = screen.getByRole('button', { name: 'Show all activities' });
    expect(filter).toHaveAttribute('aria-pressed', 'true');
    expect(filter).toHaveTextContent('Tried & liked');
    expect(filter.querySelector('.cross-icon')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders the desktop navigation with section relationships', () => {
    const onSelectChapter = vi.fn();
    render(<ChapterSidebar {...props({ onSelectChapter })} />);

    const current = screen.getByRole('link', { name: chapters[0]?.name });
    expect(current).toHaveAttribute('aria-current', 'location');
    expect(current).toHaveAttribute('aria-controls', 'loud');
    expect(current).toHaveAttribute('aria-expanded', 'true');
    expect(current).toHaveAttribute('href', '#loud');
    fireEvent.click(screen.getByRole('link', { name: chapters[1]?.name }));
    expect(onSelectChapter).toHaveBeenCalledWith('quiet');
  });

  it('leaves modified and non-primary chapter link clicks to the browser', () => {
    const onSelectChapter = vi.fn();
    render(<ChapterSidebar {...props({ onSelectChapter })} />);
    const link = screen.getByRole('link', { name: chapters[1]?.name });

    expect(fireEvent.click(link, { ctrlKey: true })).toBe(true);
    expect(fireEvent.click(link, { metaKey: true })).toBe(true);
    expect(fireEvent.click(link, { shiftKey: true })).toBe(true);
    expect(fireEvent.click(link, { button: 1 })).toBe(true);
    expect(onSelectChapter).not.toHaveBeenCalled();
  });
});
