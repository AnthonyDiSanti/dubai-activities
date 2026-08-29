import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDeepLink } from './useDeepLink';

const chapterKeys = new Set(['loud', 'animals']);
const activityIds = new Set(['honeycomb', 'rasalkhor']);

function renderDeepLink(onDeepLinkChange = vi.fn()) {
  return renderHook(() => useDeepLink(chapterKeys, activityIds, onDeepLinkChange));
}

beforeEach(() => {
  window.history.replaceState(null, '', '/guide/?ref=message');
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('useDeepLink', () => {
  it('reads a direct chapter or activity fragment synchronously', () => {
    window.history.replaceState(null, '', '/guide/?ref=message#activity-rasalkhor');
    const { result } = renderDeepLink();

    expect(result.current.deepLink).toEqual({
      type: 'activity',
      activityId: 'rasalkhor',
    });
  });

  it('pushes and closes the global credits route through browser history', () => {
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => undefined);
    const { result } = renderDeepLink();

    act(() => { result.current.navigateToCredits(); });
    expect(window.location.href).toBe('http://localhost:3000/guide/?ref=message#credits');
    expect(result.current.deepLink).toEqual({ type: 'credits' });

    act(() => { result.current.closeCredits(); });
    expect(back).toHaveBeenCalledOnce();
    expect(result.current.deepLink).toBeNull();
  });

  it('closes a direct credits link without navigating away from the document', () => {
    window.history.replaceState(null, '', '/guide/?ref=message#credits');
    const back = vi.spyOn(window.history, 'back');
    const { result } = renderDeepLink();

    act(() => { result.current.closeCredits(); });

    expect(back).not.toHaveBeenCalled();
    expect(window.location.href).toBe('http://localhost:3000/guide/?ref=message');
    expect(result.current.deepLink).toBeNull();
  });

  it('pushes and closes the archive through browser history', () => {
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => undefined);
    const { result } = renderDeepLink();

    act(() => { result.current.navigateToArchive(); });
    expect(window.location.href).toBe('http://localhost:3000/guide/?ref=message#archive');
    expect(result.current.deepLink).toEqual({ type: 'archive' });

    act(() => { result.current.closeArchive(); });
    expect(back).toHaveBeenCalledOnce();
    expect(result.current.deepLink).toBeNull();
  });

  it('replaces the archive route when selecting a summary group and still closes once', () => {
    window.history.replaceState({ foreign: 'kept' }, '', '/guide/?ref=message');
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => undefined);
    const replaceState = vi.spyOn(window.history, 'replaceState');
    const { result } = renderDeepLink();

    act(() => { result.current.navigateToArchive(); });
    act(() => { result.current.navigateToArchiveStatus('tried'); });

    expect(replaceState).toHaveBeenLastCalledWith(
      expect.objectContaining({ foreign: 'kept' }),
      '',
      '/guide/?ref=message#archive-tried',
    );
    expect(result.current.deepLink).toEqual({ type: 'archive', status: 'tried' });

    act(() => { result.current.closeArchive(); });
    expect(back).toHaveBeenCalledOnce();
    expect(result.current.deepLink).toBeNull();
  });

  it('closes a direct archive link without navigating away from the document', () => {
    window.history.replaceState(null, '', '/guide/?ref=message#archive');
    const back = vi.spyOn(window.history, 'back');
    const { result } = renderDeepLink();

    act(() => { result.current.closeArchive(); });

    expect(back).not.toHaveBeenCalled();
    expect(window.location.href).toBe('http://localhost:3000/guide/?ref=message');
    expect(result.current.deepLink).toBeNull();
  });

  it('closes a direct archive group link without navigating away from the document', () => {
    window.history.replaceState(null, '', '/guide/?ref=message#archive-rejected');
    const back = vi.spyOn(window.history, 'back');
    const { result } = renderDeepLink();

    expect(result.current.deepLink).toEqual({ type: 'archive', status: 'rejected' });
    act(() => { result.current.closeArchive(); });

    expect(back).not.toHaveBeenCalled();
    expect(window.location.href).toBe('http://localhost:3000/guide/?ref=message');
    expect(result.current.deepLink).toBeNull();
  });

  it('pushes an activity URL while preserving the current path and query', () => {
    const { result } = renderDeepLink();

    act(() => { result.current.navigateToActivity('rasalkhor'); });

    expect(window.location.href).toBe('http://localhost:3000/guide/?ref=message#activity-rasalkhor');
    expect(result.current.deepLink).toEqual({
      type: 'activity',
      activityId: 'rasalkhor',
    });
  });

  it('uses Back to close an activity opened inside the guide', () => {
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => undefined);
    const { result } = renderDeepLink();

    act(() => { result.current.navigateToActivity('rasalkhor'); });
    act(() => {
      result.current.closeActivity('rasalkhor', { type: 'chapter', chapterKey: 'animals' });
    });

    expect(back).toHaveBeenCalledOnce();
    expect(result.current.deepLink).toBeNull();
  });

  it('closes a direct activity link onto its owning chapter instead of leaving the site', () => {
    window.history.replaceState(null, '', '/guide/?ref=message#activity-rasalkhor');
    const back = vi.spyOn(window.history, 'back');
    const { result } = renderDeepLink();

    act(() => {
      result.current.closeActivity('rasalkhor', { type: 'chapter', chapterKey: 'animals' });
    });

    expect(back).not.toHaveBeenCalled();
    expect(window.location.href).toBe('http://localhost:3000/guide/?ref=message#animals');
    expect(result.current.deepLink).toEqual({ type: 'chapter', chapterKey: 'animals' });
  });

  it('closes a direct archived activity link onto the archive', () => {
    window.history.replaceState(null, '', '/guide/?ref=message#activity-rasalkhor');
    const back = vi.spyOn(window.history, 'back');
    const { result } = renderDeepLink();

    act(() => { result.current.closeActivity('rasalkhor', { type: 'archive' }); });

    expect(back).not.toHaveBeenCalled();
    expect(window.location.href).toBe('http://localhost:3000/guide/?ref=message#archive');
    expect(result.current.deepLink).toEqual({ type: 'archive' });
  });

  it('tracks browser history traversal without treating a favorites list as navigation', () => {
    const { result } = renderDeepLink();

    act(() => {
      window.history.replaceState(null, '', '/guide/#animals');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(result.current.deepLink).toEqual({ type: 'chapter', chapterKey: 'animals' });

    act(() => {
      window.history.replaceState(null, '', '/guide/#everything');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(result.current.deepLink).toEqual({ type: 'everything' });

    act(() => {
      window.history.replaceState(null, '', '/guide/#list=rasalkhor%2Choneycomb');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(result.current.deepLink).toBeNull();
  });

  it('does not create duplicate entries when selecting the current chapter', () => {
    window.history.replaceState(null, '', '/guide/#animals');
    const pushState = vi.spyOn(window.history, 'pushState');
    const replaceState = vi.spyOn(window.history, 'replaceState');
    const { result } = renderDeepLink();

    act(() => { result.current.navigateToChapter('animals'); });

    expect(pushState).not.toHaveBeenCalled();
    expect(replaceState).toHaveBeenCalledOnce();
    expect(result.current.deepLink).toEqual({ type: 'chapter', chapterKey: 'animals' });
  });

  it('pushes the explicit everything view while preserving foreign history state', () => {
    window.history.replaceState(
      { __dubaiGuideDeepLink: { type: 'activity', activityId: 'rasalkhor' }, foreign: 'kept' },
      '',
      '/guide/?ref=message#animals',
    );
    const pushState = vi.spyOn(window.history, 'pushState');
    const replaceState = vi.spyOn(window.history, 'replaceState');
    const onDeepLinkChange = vi.fn();
    const { result } = renderDeepLink(onDeepLinkChange);

    act(() => { result.current.navigateToEverything(); });

    expect(pushState).toHaveBeenCalledWith(
      { foreign: 'kept' },
      '',
      '/guide/?ref=message#everything',
    );
    expect(replaceState).not.toHaveBeenCalled();
    expect(window.location.href).toBe('http://localhost:3000/guide/?ref=message#everything');
    expect(result.current.deepLink).toEqual({ type: 'everything' });
    expect(onDeepLinkChange).toHaveBeenCalledWith({ type: 'everything' });
  });

  it('does not push another entry when the everything view is already current', () => {
    window.history.replaceState(null, '', '/guide/?ref=message#everything');
    const pushState = vi.spyOn(window.history, 'pushState');
    const { result } = renderDeepLink();

    act(() => { result.current.navigateToEverything(); });

    expect(pushState).not.toHaveBeenCalled();
    expect(window.location.href).toBe('http://localhost:3000/guide/?ref=message#everything');
    expect(result.current.deepLink).toEqual({ type: 'everything' });
  });
});
