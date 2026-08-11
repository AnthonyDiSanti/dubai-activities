import { useEffect, useState } from 'react';

import type { Chapter } from '../domain/activity';

export function useCurrentChapter(chapters: readonly Chapter[]): string {
  const [currentChapter, setCurrentChapter] = useState(chapters[0]?.name ?? '');

  useEffect(() => {
    let frameId = 0;

    const updateCurrentChapter = () => {
      frameId = 0;
      let current = chapters[0]?.name ?? '';

      // The last chapter crossing the sticky header line owns navigation state.
      document.querySelectorAll<HTMLElement>('section[data-screen-label]').forEach((section) => {
        if (section.getBoundingClientRect().top <= 120) {
          current = section.dataset.screenLabel ?? current;
        }
      });
      setCurrentChapter((previous) => (previous === current ? previous : current));
    };

    const scheduleUpdate = () => {
      if (frameId === 0) frameId = window.requestAnimationFrame(updateCurrentChapter);
    };

    updateCurrentChapter();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (frameId !== 0) window.cancelAnimationFrame(frameId);
    };
  }, [chapters]);

  return currentChapter;
}
