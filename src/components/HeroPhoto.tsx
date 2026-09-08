import { useEffect, useRef, useState } from 'react';

import { SiteLoader } from './SiteLoader';

export function HeroPhoto({ src }: { readonly src: string }) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;
    let active = true;

    const finish = () => {
      if (active) setPending(false);
    };
    const loaded = () => {
      // Decode is local to this photo; a failed decode ends the cue just like a failed request.
      if (typeof image.decode === 'function') void image.decode().then(finish, finish);
      else finish();
    };
    image.addEventListener('load', loaded);
    image.addEventListener('error', finish);
    // Cached images can complete before the effect subscribes, including cached failures.
    if (image.complete) {
      if (image.naturalWidth > 0) loaded();
      else finish();
    }
    return () => {
      active = false;
      image.removeEventListener('load', loaded);
      image.removeEventListener('error', finish);
    };
  }, [src]);

  return (
    <>
      <div className="media-placeholder">
        {pending && (
          <div className="hero__photo-loading" role="status">
            <SiteLoader />
            <span>Loading photo…</span>
          </div>
        )}
      </div>
      <img alt="" className={`media-fill${pending ? ' hero__photo--pending' : ''}`} decoding="async" fetchPriority="high" ref={imageRef} src={src} />
    </>
  );
}
