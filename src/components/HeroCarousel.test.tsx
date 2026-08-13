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
});

function progressFill(container: HTMLElement): HTMLElement {
  const fill = container.querySelector<HTMLElement>('.hero__progress-fill');
  if (!fill) throw new Error('Expected a hero progress fill');
  return fill;
}

function finishProgress(fill: HTMLElement) {
  // React selects the WebKit animation event in jsdom's dual-prefix style environment.
  fireEvent(fill, new window.Event('webkitAnimationEnd', { bubbles: true }));
}

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

  it('keeps selection controlled, stops autoplay, and resets progress for a new slide', () => {
    const onActiveIndexChange = vi.fn();
    const initialProps = props({ onActiveIndexChange });
    const { container, rerender } = render(<HeroCarousel {...initialProps} />);
    const firstProgress = progressFill(container);

    fireEvent.click(screen.getByRole('button', { name: firstItem.name }));
    expect(onActiveIndexChange).toHaveBeenCalledWith(0);
    expect(firstProgress).toHaveStyle({ animationPlayState: 'paused' });
    expect(screen.getByRole('navigation', { name: 'Choose featured activity' })).toHaveAccessibleDescription(
      'Choosing a featured activity stops automatic rotation.',
    );

    onActiveIndexChange.mockClear();
    finishProgress(firstProgress);
    expect(onActiveIndexChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: secondItem.name }));
    expect(onActiveIndexChange).toHaveBeenCalledWith(1);
    expect(screen.getByRole('heading', { name: firstItem.name })).toBeInTheDocument();

    rerender(<HeroCarousel {...initialProps} activeIndex={1} />);
    expect(screen.getByRole('heading', { name: secondItem.name })).toBeInTheDocument();
    expect(progressFill(container)).not.toBe(firstProgress);
    expect(progressFill(container)).toHaveStyle({ animationPlayState: 'paused' });
    onActiveIndexChange.mockClear();
    finishProgress(progressFill(container));
    expect(onActiveIndexChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: /slideshow/i })).not.toBeInTheDocument();
  });

  it('uses the completed progress animation as its rotation clock', () => {
    const onActiveIndexChange = vi.fn();
    const { container } = render(<HeroCarousel {...props({ onActiveIndexChange })} />);
    const fill = progressFill(container);

    expect(fill.parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(fill).toHaveStyle({
      animationDuration: '1000ms',
      animationPlayState: 'running',
    });

    finishProgress(fill);

    expect(onActiveIndexChange).toHaveBeenCalledOnce();
    expect(onActiveIndexChange).toHaveBeenCalledWith(1);
  });

  it('freezes the same progress cycle while the pointer remains inside', () => {
    const onActiveIndexChange = vi.fn();
    const { container } = render(<HeroCarousel {...props({ onActiveIndexChange })} />);
    const carousel = screen.getByRole('region', { name: 'Featured activities' });
    const fill = progressFill(container);

    fireEvent.mouseEnter(carousel);
    expect(fill).toHaveStyle({ animationPlayState: 'paused' });
    finishProgress(fill);
    expect(onActiveIndexChange).not.toHaveBeenCalled();

    fireEvent.mouseLeave(carousel);
    expect(fill).toHaveStyle({ animationPlayState: 'running' });
    finishProgress(fill);
    expect(onActiveIndexChange).toHaveBeenCalledWith(1);
  });

  it('pauses while keyboard focus remains inside the carousel', () => {
    const onActiveIndexChange = vi.fn();
    const { container } = render(<HeroCarousel {...props({ onActiveIndexChange })} />);
    const firstSelector = screen.getByRole('button', { name: firstItem.name });
    const fill = progressFill(container);

    fireEvent.focus(firstSelector);
    expect(fill).toHaveStyle({ animationPlayState: 'paused' });
    finishProgress(fill);
    expect(onActiveIndexChange).not.toHaveBeenCalled();

    fireEvent.blur(firstSelector, { relatedTarget: null });
    expect(fill).toHaveStyle({ animationPlayState: 'running' });
    finishProgress(fill);
    expect(onActiveIndexChange).toHaveBeenCalledWith(1);
  });

  it('freezes progress while an external surface disables autoplay', () => {
    const onActiveIndexChange = vi.fn();
    const { container, rerender } = render(
      <HeroCarousel {...props({ autoRotate: false, onActiveIndexChange })} />,
    );
    const fill = progressFill(container);

    expect(fill).toHaveStyle({ animationPlayState: 'paused' });
    finishProgress(fill);
    expect(onActiveIndexChange).not.toHaveBeenCalled();

    rerender(<HeroCarousel {...props({ autoRotate: true, onActiveIndexChange })} />);
    expect(fill).toHaveStyle({ animationPlayState: 'running' });
    finishProgress(fill);
    expect(onActiveIndexChange).toHaveBeenCalledWith(1);
  });

  it('disables autoplay and omits an advancing bar for reduced motion', () => {
    const onActiveIndexChange = vi.fn();
    const { container } = render(
      <HeroCarousel {...props({ onActiveIndexChange, reducedMotion: true })} />,
    );

    expect(onActiveIndexChange).not.toHaveBeenCalled();
    expect(container.querySelector('.hero__progress')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /slideshow/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: firstItem.name })).toBeEnabled();
    expect(screen.getByRole('button', { name: secondItem.name })).toBeEnabled();
  });

  it('opens the active activity from passive image and text surfaces', () => {
    const onOpen = vi.fn();
    render(<HeroCarousel {...props({ onOpen })} />);
    const slide = screen.getByRole('group', { name: '1 of 2' });
    const image = slide.querySelector('img');
    if (!image) throw new Error('Expected the active hero image');

    fireEvent.click(image);
    fireEvent.click(screen.getByRole('heading', { name: firstItem.name }));
    fireEvent.click(screen.getByText(firstItem.blurb));

    expect(onOpen).toHaveBeenCalledTimes(3);
    expect(onOpen).toHaveBeenNthCalledWith(1, firstItem.id);
  });

  it('isolates hero controls from the passive slide action', () => {
    const onOpen = vi.fn();
    const onToggleFavorite = vi.fn();
    render(<HeroCarousel {...props({ isFavorite: () => true, onOpen, onToggleFavorite })} />);

    const primaryLink = screen.getByRole('link', { name: firstItem.cta });
    const moreLink = screen.getByRole('link', { name: 'More' });
    const favoriteButton = screen.getByRole('button', {
      name: `Remove ${firstItem.name} from favorites`,
    });
    expect(primaryLink).toHaveAttribute('href', `#activity-${firstItem.id}`);
    expect(moreLink).toHaveAttribute('href', `#activity-${firstItem.id}`);

    fireEvent.click(favoriteButton);
    expect(onToggleFavorite).toHaveBeenCalledWith(firstItem.id);
    expect(onOpen).not.toHaveBeenCalled();

    fireEvent.click(primaryLink);
    fireEvent.click(moreLink);
    expect(onOpen).toHaveBeenCalledTimes(2);

    fireEvent.click(primaryLink, { metaKey: true });
    fireEvent.click(moreLink, { button: 1 });
    expect(onOpen).toHaveBeenCalledTimes(2);
  });

  it('omits autoplay progress when only one slide exists', () => {
    const onActiveIndexChange = vi.fn();
    const { container } = render(
      <HeroCarousel {...props({ items: [firstItem], onActiveIndexChange })} />,
    );

    expect(container.querySelector('.hero__progress')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /slideshow/i })).not.toBeInTheDocument();
    expect(onActiveIndexChange).not.toHaveBeenCalled();
  });
});
