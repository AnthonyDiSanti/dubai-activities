import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useFavorites } from './useFavorites';

const knownIds = new Set(['nest', 'teamlab', 'balloon']);

describe('useFavorites', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState(null, '', '/');
  });

  it('validates a shared list, persists it, and preserves insertion order', () => {
    window.history.replaceState(null, '', '/#list=teamlab,unknown,teamlab,nest');
    const { result } = renderHook(() => useFavorites(knownIds));

    expect(result.current.favorites).toEqual(['teamlab', 'nest']);
    expect(JSON.parse(window.localStorage.getItem('naima.favs.v1') ?? '[]')).toEqual([
      'teamlab',
      'nest',
    ]);

    act(() => result.current.toggleFavorite('balloon'));
    expect(result.current.favorites).toEqual(['teamlab', 'nest', 'balloon']);
  });

  it('recovers from malformed storage and ignores unknown toggle requests', () => {
    window.localStorage.setItem('naima.favs.v1', '{not json');
    const { result } = renderHook(() => useFavorites(knownIds));

    expect(result.current.favorites).toEqual([]);
    act(() => result.current.toggleFavorite('unknown'));
    expect(result.current.favorites).toEqual([]);
  });

  it('keeps local favorites authoritative for a chapter or activity deep link', () => {
    window.localStorage.setItem('naima.favs.v1', JSON.stringify(['teamlab']));
    window.history.replaceState(null, '', '/#activity-nest');

    const { result } = renderHook(() => useFavorites(knownIds));

    expect(result.current.favorites).toEqual(['teamlab']);
  });

  it('synchronizes validated favorites from another tab', () => {
    const { result } = renderHook(() => useFavorites(knownIds));

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'naima.favs.v1',
          newValue: JSON.stringify(['balloon', 'unknown', 'balloon', 'nest']),
        }),
      );
    });

    expect(result.current.favorites).toEqual(['balloon', 'nest']);
  });
});
