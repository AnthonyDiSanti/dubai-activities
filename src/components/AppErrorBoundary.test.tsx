import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AppErrorBoundary } from './AppErrorBoundary';

function BrokenChild(): never {
  throw new Error('Expected render failure');
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('AppErrorBoundary', () => {
  it('replaces a failed application tree with a recoverable static message', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <AppErrorBoundary>
        <BrokenChild />
      </AppErrorBoundary>,
    );

    expect(screen.getByRole('heading', { name: 'This page could not finish loading.' }))
      .toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reload the guide' })).toBeInTheDocument();
  });
});

