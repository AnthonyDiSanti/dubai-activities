import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { Activity, ActivityTreatment } from '../domain/activity';
import { ActivityCard } from './ActivityCard';

const item: Activity = {
  id: 'sample',
  ch: 'loud',
  name: 'Sample activity',
  blurb: 'A concise description of the activity.',
  when: 'Tonight',
  where: 'Dubai',
  dated: { d: '24', m: 'OCT', w: 'SAT', on: '2026-10-24' },
  ahead: 'Small capacity',
  eyebrow: 'Worth knowing',
  cta: 'Book it',
  book: 'https://booking.example',
  site: 'https://site.example',
  ig: 'https://instagram.com/example',
  photos: 2,
};

afterEach(cleanup);

describe('ActivityCard', () => {
  const treatments: readonly (readonly [ActivityTreatment, string])[] = [
    ['bleed', '.card--bleed'],
    ['letter', '.card--letter'],
    ['top', '.card--top'],
    ['slab', '.card--slab'],
    ['columns', '.card--columns'],
    ['bite', '.card--bite'],
    ['dated', '.card--dated'],
    ['ahead', '.card--ahead'],
    ['type', '.card--type'],
  ];

  it.each(treatments)('renders the %s treatment with its legacy semantic class', (treatment, selector) => {
    const { container } = render(
      <ActivityCard
        isFavorite={false}
        isVerified={false}
        item={item}
        onOpen={vi.fn()}
        onToggleFavorite={vi.fn()}
        treatment={treatment}
      />,
    );

    expect(container.querySelector(selector)).toBeInTheDocument();
  });

  it('exposes its durable activity ID as a namespaced anchor target', () => {
    const { container } = render(
      <ActivityCard
        isFavorite={false}
        isVerified={false}
        item={item}
        onOpen={vi.fn()}
        onToggleFavorite={vi.fn()}
        treatment="bleed"
      />,
    );

    expect(container.querySelector('.activity-card')).toHaveAttribute(
      'id',
      `activity-${item.id}`,
    );
  });

  it('opens from the passive card surface and from an explicit keyboard-accessible control', () => {
    const onOpen = vi.fn();
    const { container } = render(
      <ActivityCard
        isFavorite={false}
        isVerified={false}
        item={item}
        onOpen={onOpen}
        onToggleFavorite={vi.fn()}
        treatment="bleed"
      />,
    );

    const passiveSurface = container.querySelector('.card--bleed__shade');
    expect(passiveSurface).not.toBeNull();
    if (!passiveSurface) throw new Error('Expected the bleed-card surface to render');
    fireEvent.click(passiveSurface);
    const detailLink = screen.getByRole('link', { name: `Open details for ${item.name}` });
    expect(detailLink).toHaveAttribute('href', `#activity-${item.id}`);
    fireEvent.click(detailLink);

    expect(onOpen).toHaveBeenNthCalledWith(1, item.id);
    expect(onOpen).toHaveBeenNthCalledWith(2, item.id);
  });

  it('leaves modified detail-link clicks to the browser', () => {
    const onOpen = vi.fn();
    render(
      <ActivityCard
        isFavorite={false}
        isVerified={false}
        item={item}
        onOpen={onOpen}
        onToggleFavorite={vi.fn()}
        treatment="bleed"
      />,
    );

    fireEvent.click(screen.getByRole('link', { name: `Open details for ${item.name}` }), {
      ctrlKey: true,
    });

    expect(onOpen).not.toHaveBeenCalled();
  });

  it('isolates favorite and external-link actions from the card surface', () => {
    const onOpen = vi.fn();
    const onToggleFavorite = vi.fn();
    render(
      <ActivityCard
        isFavorite
        isVerified={false}
        item={item}
        onOpen={onOpen}
        onToggleFavorite={onToggleFavorite}
        treatment="letter"
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: `Remove ${item.name} from favorites` }));
    const primaryAction = screen.getByRole('link', { name: item.cta });
    primaryAction.addEventListener('click', (event) => event.preventDefault(), { once: true });
    fireEvent.click(primaryAction);

    expect(onToggleFavorite).toHaveBeenCalledOnce();
    expect(onToggleFavorite).toHaveBeenCalledWith(item.id);
    expect(onOpen).not.toHaveBeenCalled();
    expect(primaryAction).toHaveAttribute('rel', 'noopener');
  });

  it('marks an activity that has earned a firsthand recommendation', () => {
    const { container } = render(
      <ActivityCard
        isFavorite={false}
        isVerified
        item={item}
        onOpen={vi.fn()}
        onToggleFavorite={vi.fn()}
        treatment="top"
      />,
    );

    const stamp = screen.getByRole('img', { name: 'Tried and liked' });
    expect(stamp).toHaveClass('verified-stamp');
    // Keeping the stamp inside the treatment prevents it from consuming card-grid space.
    expect(container.querySelector('.card--top')).toContainElement(stamp);
  });
});
