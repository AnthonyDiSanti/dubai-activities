import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { usePhotoAttributions } from './usePhotoAttributions';

const catalog = { schemaVersion: 1, assets: [] } as const;

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('usePhotoAttributions', () => {
  it('loads the static catalog only after credits are opened', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(catalog),
      ok: true,
      status: 200,
    });
    vi.stubGlobal('fetch', fetchMock);
    const { rerender, result } = renderHook(
      ({ enabled }) => usePhotoAttributions(enabled),
      { initialProps: { enabled: false } },
    );

    expect(result.current.status).toBe('idle');
    expect(fetchMock).not.toHaveBeenCalled();

    rerender({ enabled: true });
    expect(result.current.status).toBe('loading');
    await waitFor(() => { expect(result.current.status).toBe('ready'); });
    expect(result.current.catalog).toEqual(catalog);
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain('/photo-attributions.json');
  });

  it('exposes an honest error and retry path', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 503 })
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue(catalog),
        ok: true,
        status: 200,
      });
    vi.stubGlobal('fetch', fetchMock);
    const { result } = renderHook(() => usePhotoAttributions(true));

    await waitFor(() => { expect(result.current.status).toBe('error'); });
    act(() => { result.current.retry(); });
    await waitFor(() => { expect(result.current.status).toBe('ready'); });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
