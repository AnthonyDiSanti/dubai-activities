import { useCallback, useEffect, useState } from 'react';

import {
  parsePhotoAttributionCatalog,
  type PhotoAttributionCatalog,
} from '../domain/photoAttribution';

export type PhotoAttributionState =
  | { readonly status: 'idle' | 'loading'; readonly catalog: null }
  | { readonly status: 'ready'; readonly catalog: PhotoAttributionCatalog }
  | { readonly status: 'error'; readonly catalog: null };

/** Load the static catalog only when the visitor asks to see the credits. */
export function usePhotoAttributions(enabled: boolean): PhotoAttributionState & {
  readonly retry: () => void;
} {
  const [attempt, setAttempt] = useState(0);
  const [catalog, setCatalog] = useState<PhotoAttributionCatalog | null>(null);
  const [failed, setFailed] = useState(false);
  const retry = useCallback(() => {
    setFailed(false);
    setAttempt((current) => current + 1);
  }, []);

  useEffect(() => {
    if (!enabled || catalog || failed) return;
    const controller = new AbortController();

    const load = async () => {
      try {
        const url = new URL(
          `${import.meta.env.BASE_URL}photo-attributions.json`,
          window.location.href,
        );
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`Attribution request failed with ${String(response.status)}`);
        setCatalog(parsePhotoAttributionCatalog(await response.json()));
      } catch {
        if (controller.signal.aborted) return;
        setFailed(true);
      }
    };

    void load();
    return () => controller.abort();
  }, [attempt, catalog, enabled, failed]);

  if (catalog) return { status: 'ready', catalog, retry };
  if (failed) return { status: 'error', catalog: null, retry };
  return { status: enabled ? 'loading' : 'idle', catalog: null, retry };
}
