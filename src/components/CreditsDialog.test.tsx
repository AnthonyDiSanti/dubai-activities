import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { PhotoAttributionCatalog } from '../domain/photoAttribution';
import { CreditsDialog } from './CreditsDialog';

const catalog: PhotoAttributionCatalog = {
  schemaVersion: 1,
  assets: [
    {
      filename: 'rasalkhor-01.jpg',
      activityId: 'rasalkhor',
      activityName: 'Ras Al Khor Wildlife Sanctuary',
      chapterName: 'Fur, feathers and scales',
      slot: 1,
      workTitle: 'Ras Al Khor Wildlife Sanctuary',
      creator: { name: 'Florian Kriechbaumer', type: 'person', url: 'https://example.com/creator' },
      source: { name: 'Wikimedia Commons', url: 'https://example.com/source' },
      license: { name: 'CC BY-SA 4.0', url: 'https://creativecommons.org/licenses/by-sa/4.0/' },
      creditBasis: 'creative_commons',
      modifications: 'Resized for web display.',
      creditText: 'Ras Al Khor Wildlife Sanctuary by Florian Kriechbaumer.',
    },
  ],
};

afterEach(() => {
  cleanup();
  document.documentElement.style.overflow = '';
});

describe('CreditsDialog', () => {
  it('renders a flat, linked credit grouped by chapter and activity', () => {
    render(
      <CreditsDialog catalog={catalog} onClose={vi.fn()} onRetry={vi.fn()} status="ready" />,
    );

    const dialog = screen.getByRole('dialog', { name: 'Photo credits' });
    expect(within(dialog).getByRole('heading', { name: 'Fur, feathers and scales' }))
      .toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: 'Ras Al Khor Wildlife Sanctuary' }))
      .toBeInTheDocument();
    expect(within(dialog).getByText('Photo 1')).toBeInTheDocument();
    expect(within(dialog).getByRole('link', { name: 'Florian Kriechbaumer' }))
      .toHaveAttribute('target', '_blank');
    expect(within(dialog).getByRole('link', { name: 'CC BY-SA 4.0' }))
      .toHaveAttribute('href', 'https://creativecommons.org/licenses/by-sa/4.0/');
  });

  it('routes close and retry actions through its owner', () => {
    const onClose = vi.fn();
    const onRetry = vi.fn();
    const { rerender } = render(
      <CreditsDialog catalog={null} onClose={onClose} onRetry={onRetry} status="loading" />,
    );
    expect(screen.getByText('Loading credits…')).toBeInTheDocument();

    rerender(<CreditsDialog catalog={null} onClose={onClose} onRetry={onRetry} status="error" />);
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    const closeButton = screen.getByRole('button', { name: 'Close photo credits' });
    expect(closeButton.querySelector('.cross-icon')).toBeInTheDocument();
    expect(closeButton).not.toHaveTextContent('×');
    fireEvent.click(closeButton);

    expect(onRetry).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });
});
