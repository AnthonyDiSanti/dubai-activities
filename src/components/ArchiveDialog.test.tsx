import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ARCHIVE_ENTRIES } from '../data/archive';
import { ArchiveDialog } from './ArchiveDialog';

afterEach(() => {
  cleanup();
  document.documentElement.style.overflow = '';
});

describe('ArchiveDialog', () => {
  it('separates tried-and-liked activities from deliberate rejections', () => {
    render(<ArchiveDialog entries={ARCHIVE_ENTRIES} onClose={vi.fn()} />);

    const dialog = screen.getByRole('dialog', { name: 'Tried & decided' });
    const verified = within(dialog).getByRole('heading', { name: 'Tried & liked' })
      .closest('section');
    const rejected = within(dialog).getByRole('heading', { name: 'Rejected' })
      .closest('section');
    expect(verified).toHaveTextContent('Boulder Zone');
    expect(verified).not.toHaveTextContent('The Wall');
    expect(rejected).toHaveTextContent('The Wall');
    expect(rejected).not.toHaveTextContent('Boulder Zone');
    expect(within(dialog).getAllByText(/22 Aug 2026/)).toHaveLength(2);
  });

  it('routes both close treatments through its owner', () => {
    const onClose = vi.fn();
    render(<ArchiveDialog entries={ARCHIVE_ENTRIES} onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'Close tried and decided' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
