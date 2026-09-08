import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { StrictMode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { HeroPhoto } from './HeroPhoto';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function photo(container: HTMLElement): HTMLImageElement {
  const image = container.querySelector('img');
  if (!image) throw new Error('Expected hero image');
  return image;
}

function deferredDecode() {
  // Manually settle decode to exercise the race with a subsequent slide.
  let resolve!: () => void;
  let reject!: () => void;
  const promise = new Promise<void>((onResolve, onReject) => {
    resolve = onResolve;
    reject = () => onReject(new Error('Decode failed'));
  });
  return { promise, resolve, reject };
}

describe('HeroPhoto readiness', () => {
  it('shows the cue until load, without gating the rest of the guide', () => {
    const { container } = render(<HeroPhoto src="photos/pending.jpg" />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading photo…');
    expect(photo(container)).toHaveClass('hero__photo--pending');
    fireEvent.load(photo(container));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(photo(container)).not.toHaveClass('hero__photo--pending');
  });

  it('ends the cue on a failed request', () => {
    const { container } = render(<HeroPhoto src="photos/failure.jpg" />);
    fireEvent.error(photo(container));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it.each([0, 640])('handles a cached complete image with natural width %s', async (width) => {
    vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(true);
    vi.spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get').mockReturnValue(width);
    render(<StrictMode><HeroPhoto src="photos/cached.jpg" /></StrictMode>);
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
  });

  it.each(['resolve', 'reject'] as const)('ends the pending cue when decode promises %s', async (result) => {
    const { container } = render(<HeroPhoto src="photos/decoding.jpg" />);
    const deferred = deferredDecode();
    photo(container).decode = () => deferred.promise;
    fireEvent.load(photo(container));
    expect(screen.getByRole('status')).toBeInTheDocument();
    await act(async () => { deferred[result](); await deferred.promise.catch(() => undefined); });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('does not let a stale decode dismiss the next slide cue', async () => {
    const { container, rerender } = render(<HeroPhoto key="first" src="photos/first.jpg" />);
    const deferred = deferredDecode();
    photo(container).decode = () => deferred.promise;
    fireEvent.load(photo(container));
    rerender(<HeroPhoto key="second" src="photos/second.jpg" />);
    await act(async () => { deferred.resolve(); await deferred.promise; });
    expect(screen.getByRole('status')).toBeInTheDocument();
    fireEvent.load(photo(container));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
