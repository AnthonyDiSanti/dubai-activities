import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDeepLink } from './useDeepLink';

const chapterKeys = new Set(['loud', 'animals']);
const activityIds = new Set(['honeycomb', 'rasalkhor']);

function renderDeepLink(onDeepLinkChange = vi.fn()) {
  return renderHook(() => useDeepLink(chapterKeys, activityIds, onDeepLinkChange));
}

beforeEach(() => {
  window.history.replaceState(null, '', '/guide/?ref=naima');
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('useDeepLink', () => {
  it('reads a direct chapter or activity fragment synchronously', () => {
    window.history.replaceState(null, '', '/guide/?ref=naima#activity-rasalkhor');
    const { result } = renderDeepLink();

    expect(result.current.deepLink).toEqual({
      type: 'activity',
      activityId: 'rasalkhor',
    });
  });

  it('pushes an activity URL while preserving the current path and query', () => {
    const { result } = renderDeepLink();

    act(() => { result.current.navigateToActivity('rasalkhor'); });

    expect(window.location.href).toBe('http://localhost:3000/guide/?ref=naima#activity-rasalkhor');
    expect(result.current.deepLink).toEqual({
      type: 'activity',
      activityId: 'rasalkhor',
    });
  });

  it('uses Back to close an activity opened inside the guide', () => {
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => undefined);
    const { result } = renderDeepLink();

    act(() => { result.current.navigateToActivity('rasalkhor'); });
    act(() => { result.current.closeActivity('rasalkhor', 'animals'); });

    expect(back).toHaveBeenCalledOnce();
    expect(result.current.deepLink).toBeNull();
  });

  it('closes a direct activity link onto its owning chapter instead of leaving the site', () => {
    window.history.replaceState(null, '', '/guide/?ref=naima#activity-rasalkhor');
    const back = vi.spyOn(window.history, 'back');
    const { result } = renderDeepLink();

    act(() => { result.current.closeActivity('rasalkhor', 'animals'); });

    expect(back).not.toHaveBeenCalled();
    expect(window.location.href).toBe('http://localhost:3000/guide/?ref=naima#animals');
    expect(result.current.deepLink).toEqual({ type: 'chapter', chapterKey: 'animals' });
  });

  it('tracks browser history traversal without treating a favorites list as navigation', () => {
    const { result } = renderDeepLink();

    act(() => {
      window.history.replaceState(null, '', '/guide/#animals');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(result.current.deepLink).toEqual({ type: 'chapter', chapterKey: 'animals' });

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
});
