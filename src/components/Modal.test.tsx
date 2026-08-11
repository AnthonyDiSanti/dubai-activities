import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Modal } from './Modal';

afterEach(() => {
  cleanup();
  document.documentElement.style.overflow = '';
});

describe('Modal', () => {
  it('uses native modal semantics, locks scroll, and restores focus on unmount', () => {
    const opener = document.createElement('button');
    document.body.append(opener);
    opener.focus();

    const { unmount } = render(
      <Modal
        backdropLabel="Dismiss example"
        backdropClassName="modal__backdrop--details"
        className="modal--details"
        labelId="example-title"
        onClose={vi.fn()}
      >
        <section data-dialog-panel tabIndex={-1}>
          <h2 id="example-title">Example dialog</h2>
        </section>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Example dialog' });
    const panel = dialog.querySelector<HTMLElement>('[data-dialog-panel]');
    if (!panel) throw new Error('Expected a focusable dialog panel');
    expect(dialog).toHaveAttribute('open');
    expect(document.documentElement).toHaveStyle({ overflow: 'hidden' });
    expect(panel).toHaveFocus();

    unmount();

    expect(document.documentElement.style.overflow).toBe('');
    expect(opener).toHaveFocus();
    opener.remove();
  });

  it('routes both native cancellation and the visual backdrop through onClose', () => {
    const onClose = vi.fn();
    render(
      <Modal
        backdropLabel="Dismiss example"
        backdropClassName="modal__backdrop--details"
        className="modal--details"
        labelId="example-title"
        onClose={onClose}
      >
        <section data-dialog-panel tabIndex={-1}>
          <h2 id="example-title">Example dialog</h2>
        </section>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Example dialog' });
    const cancelEvent = new Event('cancel', { bubbles: false, cancelable: true });
    fireEvent(dialog, cancelEvent);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss example' }));

    expect(cancelEvent.defaultPrevented).toBe(true);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('uses a connected fallback when a direct link had no interactive opener', () => {
    const fallback = document.createElement('button');
    fallback.id = 'fallback-control';
    document.body.append(fallback);
    document.body.focus();

    const { unmount } = render(
      <Modal
        backdropLabel="Dismiss example"
        backdropClassName="modal__backdrop--details"
        className="modal--details"
        fallbackFocusId={fallback.id}
        labelId="example-title"
        onClose={vi.fn()}
      >
        <section data-dialog-panel tabIndex={-1}>
          <h2 id="example-title">Example dialog</h2>
        </section>
      </Modal>,
    );

    unmount();

    expect(fallback).toHaveFocus();
    fallback.remove();
  });
});
