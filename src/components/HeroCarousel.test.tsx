import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { Activity, Chapter } from '../domain/activity';
import { HeroCarousel, type HeroCarouselProps } from './HeroCarousel';

const chapters: readonly Chapter[] = [
  { key: 'quiet', name: 'Quiet and dark' },
  { key: 'strange', name: 'Genuinely strange' },
];

const firstItem: Activity = {
  id: 'nest',
  ch: 'quiet',
  name: 'The Nest by Nara with its complete name',
  blurb: 'A private glass-roofed pod in the desert.',
  when: 'Overnight',
  where: 'Al Marmoom Reserve',
  cta: 'Book a glass-roofed pod',
  photos: 5,
};

const secondItem: Activity = {
  id: 'teamlab',
  ch: 'strange',
  name: 'teamLab Phenomena Abu Dhabi',
  blurb: 'A building full of responsive environments.',
  when: 'Daily',
  where: 'Saadiyat',
  cta: 'Step inside',
  photos: 6,
};

const items: readonly Activity[] = [firstItem, secondItem];

function props(overrides: Partial<HeroCarouselProps> = {}): HeroCarouselProps {
  return {
    activeIndex: 0,
    autoRotate: true,
    chapters,
    isFavorite: () => false,
    items,
    onActiveIndexChange: vi.fn(),
    onOpen: vi.fn(),
    onToggleFavorite: vi.fn(),
    reducedMotion: false,
    rotationIntervalMs: 1_000,
    ...overrides,
  };
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('HeroCarousel', () => {
  it('labels the carousel and exposes complete activity names as controls', () => {
    render(<HeroCarousel {...props()} />);

    expect(screen.getByRole('region', { name: 'Featured activities' })).toHaveAttribute(
      'aria-roledescription',
      'carousel',
    );
    expect(screen.getByRole('group', { name: '1 of 2' })).toHaveAttribute(
      'aria-roledescription',
      'slide',
    );
    expect(screen.getByRole('heading', { level: 2, name: firstItem.name })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: firstItem.name })).toHaveTextContent(firstItem.name);
    expect(screen.getByRole('button', { name: secondItem.name })).toHaveTextContent(secondItem.name);
    expect(screen.getByText('Quiet and dark')).toBeInTheDocument();
  });

  it('keeps selection controlled by the parent', () => {
    const onActiveIndexChange = vi.fn();
    const initialProps = props({ onActiveIndexChange });
    const { rerender } = render(<HeroCarousel {...initialProps} />);

    fireEvent.click(screen.getByRole('button', { name: secondItem.name }));
    expect(onActiveIndexChange).toHaveBeenCalledWith(1);
    expect(screen.getByRole('heading', { name: firstItem.name })).toBeInTheDocument();

    rerender(<HeroCarousel {...initialProps} activeIndex={1} />);
    expect(screen.getByRole('heading', { name: secondItem.name })).toBeInTheDocument();
  });

  it('rotates on schedule and pauses explicitly or while the pointer is inside', () => {
    vi.useFakeTimers();
    const onActiveIndexChange = vi.fn();
    render(<HeroCarousel {...props({ onActiveIndexChange })} />);
    const carousel = screen.getByRole('region', { name: 'Featured activities' });

    fireEvent.mouseEnter(carousel);
    vi.advanceTimersByTime(1_000);
    expect(onActiveIndexChange).not.toHaveBeenCalled();

    fireEvent.mouseLeave(carousel);
    vi.advanceTimersByTime(1_000);
    expect(onActiveIndexChange).toHaveBeenCalledWith(1);

    onActiveIndexChange.mockClear();
    fireEvent.click(screen.getByRole('button', { name: 'Pause slideshow' }));
    vi.advanceTimersByTime(1_000);
    expect(onActiveIndexChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Resume slideshow' }));
    vi.advanceTimersByTime(1_000);
    expect(onActiveIndexChange).toHaveBeenCalledWith(1);
  });

  it('pauses while keyboard focus remains inside the carousel', () => {
    vi.useFakeTimers();
    const onActiveIndexChange = vi.fn();
    render(<HeroCarousel {...props({ onActiveIndexChange })} />);
    const firstSelector = screen.getByRole('button', { name: firstItem.name });

    fireEvent.focus(firstSelector);
    vi.advanceTimersByTime(1_000);
    expect(onActiveIndexChange).not.toHaveBeenCalled();

    fireEvent.blur(firstSelector, { relatedTarget: null });
    vi.advanceTimersByTime(1_000);
    expect(onActiveIndexChange).toHaveBeenCalledWith(1);
  });

  it('disables autoplay when reduced motion is requested', () => {
    vi.useFakeTimers();
    const onActiveIndexChange = vi.fn();
    render(<HeroCarousel {...props({ onActiveIndexChange, reducedMotion: true })} />);

    vi.advanceTimersByTime(5_000);

    expect(onActiveIndexChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Slideshow paused' })).toBeDisabled();
  });

  it('routes hero actions for the current activity', () => {
    const onOpen = vi.fn();
    const onToggleFavorite = vi.fn();
    render(<HeroCarousel {...props({ isFavorite: () => true, onOpen, onToggleFavorite })} />);

    const activityLink = screen.getByRole('link', { name: firstItem.cta });
    expect(activityLink).toHaveAttribute('href', `#activity-${firstItem.id}`);
    fireEvent.click(activityLink);
    fireEvent.click(screen.getByRole('button', { name: `Remove ${firstItem.name} from favorites` }));

    expect(onOpen).toHaveBeenCalledWith(firstItem.id);
    expect(onToggleFavorite).toHaveBeenCalledWith(firstItem.id);
  });
});
