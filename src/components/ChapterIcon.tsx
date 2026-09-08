import { useId } from 'react';

import type { ChapterKey } from '../domain/activity';

function ChapterArtwork({ chapter, maskId }: { readonly chapter: ChapterKey; readonly maskId: string }) {
  // Geometry is transcribed from the supplied artwork; keep mask cutouts and accent layers intact.
  switch (chapter) {
    case 'adrenaline':
      return (
        <>
          <defs>
            <mask id={`${maskId}-m-gauge`} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
              <rect width="24" height="24" fill="#fff" />
              <path d="M8.75 9.87 L7 6.84 M12 9 V5.5 M15.25 9.87 L17 6.84" fill="none" stroke="#000" style={{ strokeWidth: ".9" }} />
            </mask>
          </defs>
          <path d="M2 15.5 A10 10 0 0 1 22 15.5 H18.5 A6.5 6.5 0 0 0 5.5 15.5 Z" fill="currentColor" mask={`url(#${maskId}-m-gauge)`} />
          <path d="M22 15.5 A10 10 0 0 0 20.66 10.5 L17.63 12.25 A6.5 6.5 0 0 1 18.5 15.5 Z" fill="var(--ac,transparent)" style={{ filter: "var(--acg,none)" }} />
          <path d="M12 15.5 L17.6 13.7" fill="none" stroke="var(--ac,currentColor)" style={{ strokeWidth: "1.9", strokeLinecap: "round", filter: "var(--acg,none)" }} />
          <circle cx="12" cy="15.5" r="1.9" fill="currentColor" />
          <rect x="5" y="18.8" width="14" height="1.7" rx=".85" fill="currentColor" />
        </>
      );
    case 'animals':
      return (
        <>
          <defs>
            <mask id={`${maskId}-m-d5`} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
              <rect width="24" height="24" fill="#fff" />
              <path d="M8.4 12 Q9.7 10.3 11 12 M13 12 Q14.3 10.3 15.6 12" fill="none" stroke="#000" style={{ strokeWidth: "1.3", strokeLinecap: "round" }} />
              <path d="M9.2 14.3 Q12 15.3 14.8 14.3 A2.8 2.8 0 0 1 9.2 14.3 Z" fill="#000" />
              <path d="M6.08 8.5 L6.05 5.92 L7.94 6.7 Z M17.92 8.5 L17.95 5.92 L16.06 6.7 Z" fill="#000" />
            </mask>
          </defs>
          <path fill="currentColor" mask={`url(#${maskId}-m-d5)`} d="M5.47 9.96 L5.4 4.8 L9.19 6.37 A7.2 7.2 0 0 1 14.81 6.37 L18.6 4.8 L18.53 9.96 A7.2 7.2 0 1 1 5.47 9.96 Z" />
          <path d="M9.2 14.3 Q12 15.3 14.8 14.3 A2.8 2.8 0 0 1 9.2 14.3 Z M6.08 8.5 L6.05 5.92 L7.94 6.7 Z M17.92 8.5 L17.95 5.92 L16.06 6.7 Z" fill="var(--ac,transparent)" style={{ filter: "var(--acg,none)" }} />
        </>
      );
    case 'cooking':
      return (
        <>
          <path d="M5 9.4 H19 V16 A2.4 2.4 0 0 1 16.6 18.4 H7.4 A2.4 2.4 0 0 1 5 16 Z" fill="currentColor" />
          <rect x="4" y="8" width="16" height="1.6" rx=".8" fill="currentColor" />
          <rect x="1.5" y="10.2" width="3.5" height="1.6" rx=".8" fill="currentColor" />
          <rect x="19" y="10.2" width="3.5" height="1.6" rx=".8" fill="currentColor" />
          <g fill="var(--ac2,currentColor)" style={{ filter: "var(--acg2,none)" }}>
            <path d="M8 19.4 C9 20.5 9.5 21.2 9.5 21.9 A1.5 1.5 0 0 1 6.5 21.9 C6.5 21.2 7 20.5 8 19.4 Z" />
            <path d="M12 19.4 C13 20.5 13.5 21.2 13.5 21.9 A1.5 1.5 0 0 1 10.5 21.9 C10.5 21.2 11 20.5 12 19.4 Z" />
            <path d="M16 19.4 C17 20.5 17.5 21.2 17.5 21.9 A1.5 1.5 0 0 1 14.5 21.9 C14.5 21.2 15 20.5 16 19.4 Z" />
          </g>
          <path d="M9 6.4 C8 5 10 4 9 2.4 M12 6.8 C11 5.4 13 4.4 12 2.8 M15 6.4 C14 5 16 4 15 2.4" fill="none" stroke="var(--ac,currentColor)" style={{ strokeWidth: "1.5", strokeLinecap: "round", filter: "var(--acg,none)" }} />
        </>
      );
    case 'dinners':
      return (
        <>
          <defs>
            <mask id={`${maskId}-m10-tab`} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
              <rect width="24" height="24" fill="#fff" />
              <path d="M3 10.5 L12 15 L21 10.5" fill="none" stroke="#000" style={{ strokeWidth: ".7" }} />
              <rect x="10.7" y="3.4" width="2.6" height="5.2" rx=".6" fill="#000" />
              <ellipse cx="9.2" cy="11.9" rx="1.9" ry=".95" fill="#000" />
              <ellipse cx="14.8" cy="11.9" rx="1.9" ry=".95" fill="#000" />
            </mask>
          </defs>
          <g fill="currentColor" mask={`url(#${maskId}-m10-tab)`}>
            <path d="M12 6 L21 10.5 L12 15 L3 10.5 Z" />
            <path d="M3 10.5 L12 15 L21 10.5 V12.6 L12 17.1 L3 12.6 Z" />
          </g>
          <g fill="currentColor">
            <rect x="2.4" y="12.4" width="1.2" height="5.2" />
            <rect x="11.4" y="16.9" width="1.2" height="5.4" />
            <rect x="20.4" y="12.4" width="1.2" height="5.2" />
            <ellipse cx="9.2" cy="11.9" rx="1.2" ry=".6" />
            <ellipse cx="14.8" cy="11.9" rx="1.2" ry=".6" />
            <rect x="11.3" y="4" width="1.4" height="4" rx=".3" />
          </g>
          <path d="M12 1.2 C12.9 2.4 13.3 3.1 13.3 3.8 A1.3 1.3 0 0 1 10.7 3.8 C10.7 3.1 11.1 2.4 12 1.2 Z" fill="var(--ac,currentColor)" style={{ filter: "var(--acg,none)" }} />
        </>
      );
    case 'elsewhere':
      return (
        <>
          <defs>
            <mask id={`${maskId}-m8-car`} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
              <rect width="24" height="24" fill="#fff" />
              <path d="M8 10.4 L9.7 7.2 H11.7 V10.4 Z M12.9 10.4 V7.2 H14.9 L16.7 10.4 Z" fill="#000" />
              <circle cx="6.5" cy="17" r="3.1" fill="#000" />
              <circle cx="17.5" cy="17" r="3.1" fill="#000" />
            </mask>
            <mask id={`${maskId}-m8-wheel`} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
              <rect width="24" height="24" fill="#fff" />
              <circle cx="6.5" cy="17" r=".9" fill="#000" />
              <circle cx="17.5" cy="17" r=".9" fill="#000" />
            </mask>
          </defs>
          <g fill="currentColor" mask={`url(#${maskId}-m8-car)`}>
            <rect x="1.5" y="11" width="21" height="6.2" rx="1.8" />
            <path d="M6 11 L8.6 6.4 C8.9 5.9 9.4 5.6 10 5.6 H15 C15.6 5.6 16.1 5.9 16.4 6.4 L19 11 Z" />
          </g>
          <g fill="currentColor" mask={`url(#${maskId}-m8-wheel)`}>
            <circle cx="6.5" cy="17" r="2.3" />
            <circle cx="17.5" cy="17" r="2.3" />
          </g>
          <path d="M8 10.4 L9.7 7.2 H11.7 V10.4 Z M12.9 10.4 V7.2 H14.9 L16.7 10.4 Z" fill="var(--ac,transparent)" style={{ filter: "var(--acg,none)" }} />
        </>
      );
    case 'getgood':
      return (
        <>
          <defs>
            <mask id={`${maskId}-m9-cap-d`} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
              <rect width="24" height="24" fill="#fff" />
              <path d="M12 4.6 L19.6 8 L12 11.4 L4.4 8 Z" fill="none" stroke="#000" style={{ strokeWidth: ".8" }} />
            </mask>
          </defs>
          <path d="M12 3 L22.5 8 L12 13 L1.5 8 Z" fill="currentColor" mask={`url(#${maskId}-m9-cap-d)`} />
          <path d="M6 10.6 V15 A6 2.3 0 0 0 18 15 V10.6 L12 13.5 Z" fill="currentColor" />
          <path d="M12 4.6 L19.6 8 L12 11.4 L4.4 8 Z" fill="none" stroke="var(--ac,transparent)" style={{ strokeWidth: ".9", strokeLinejoin: "round", filter: "var(--acg,none)" }} />
          <path d="M21.6 8.6 V14.4" fill="none" stroke="currentColor" style={{ strokeWidth: "1.2", strokeLinecap: "round" }} />
          <g fill="var(--ac2,currentColor)" style={{ filter: "var(--acg2,none)" }}>
            <path d="M19.6 .6 L20.4 2.4 L22.2 3.2 L20.4 4 L19.6 5.8 L18.8 4 L17 3.2 L18.8 2.4 Z" />
            <circle cx="15.8" cy="1.6" r=".7" />
            <circle cx="23.2" cy="6" r=".65" />
          </g>
          <circle cx="21.6" cy="15.9" r="1.4" fill="var(--ac3,var(--ac2,currentColor))" style={{ filter: "var(--acg3,var(--acg2,none))" }} />
        </>
      );
    case 'loud':
      return (
        <>
          <path fill="currentColor" style={{ fillRule: "evenodd" }} d="M5.6 3 H12.4 A1.6 1.6 0 0 1 14 4.6 V19.4 A1.6 1.6 0 0 1 12.4 21 H5.6 A1.6 1.6 0 0 1 4 19.4 V4.6 A1.6 1.6 0 0 1 5.6 3 Z M9 11.7 A3.3 3.3 0 1 0 9 18.3 A3.3 3.3 0 1 0 9 11.7 Z M9 5.8 A1.5 1.5 0 1 0 9 8.8 A1.5 1.5 0 1 0 9 5.8 Z" />
          <path d="M17 9.2 A4.3 4.3 0 0 1 17 14.8 M19.6 6.4 A8 8 0 0 1 19.6 17.6" fill="none" stroke="var(--ac,currentColor)" style={{ strokeWidth: "1.8", strokeLinecap: "round", filter: "var(--acg,none)" }} />
        </>
      );
    case 'quiet':
      return (
        <>
          <path d="M1.5 21 V16.4 C6 13 10 12.6 13 15.2 C16 17.8 19 18.6 22.5 18.6 V21 Z" fill="currentColor" opacity=".5" />
          <path d="M1.5 21 C6 17.6 10 13 15 13.6 C18 14 20 16.2 22.5 16.4 V21 Z" fill="currentColor" />
          <path d="M6 3.2 L6.8 5.4 L9 6.2 L6.8 7 L6 9.2 L5.2 7 L3 6.2 L5.2 5.4 Z" fill="var(--ac,currentColor)" style={{ filter: "var(--acg,none)" }} />
          <circle cx="16" cy="5.6" r=".85" fill="currentColor" />
          <circle cx="19.6" cy="9" r=".65" fill="currentColor" />
        </>
      );
    case 'rides':
      return (
        <>
          <circle cx="12" cy="10" r="7.5" fill="none" stroke="currentColor" style={{ strokeWidth: "1.8" }} />
          <path d="M12 10 L19.5 10 M12 10 L15.75 16.5 M12 10 L8.25 16.5 M12 10 L4.5 10 M12 10 L8.25 3.5 M12 10 L15.75 3.5" fill="none" stroke="currentColor" style={{ strokeWidth: "1.2" }} />
          <circle cx="12" cy="10" r="1.5" fill="currentColor" />
          <path d="M12 10 L6.5 22.5 M12 10 L17.5 22.5" fill="none" stroke="currentColor" style={{ strokeWidth: "1.6", strokeLinecap: "round" }} />
          <g fill="var(--ac,currentColor)" style={{ filter: "var(--acg,none)" }}>
            <rect x="18.4" y="10.4" width="2.2" height="2" rx=".5" />
            <rect x="14.65" y="16.9" width="2.2" height="2" rx=".5" />
            <rect x="7.15" y="16.9" width="2.2" height="2" rx=".5" />
            <rect x="3.4" y="10.4" width="2.2" height="2" rx=".5" />
            <rect x="7.15" y="3.9" width="2.2" height="2" rx=".5" />
            <rect x="14.65" y="3.9" width="2.2" height="2" rx=".5" />
          </g>
        </>
      );
    case 'strange':
      return (
        <>
          <defs>
            <mask id={`${maskId}-m8-eye`} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
              <rect width="24" height="24" fill="#fff" />
              <circle cx="12" cy="12" r="4.3" fill="#000" />
            </mask>
          </defs>
          <path d="M1.5 12 C5 5.5 19 5.5 22.5 12 C19 18.5 5 18.5 1.5 12 Z" fill="currentColor" mask={`url(#${maskId}-m8-eye)`} />
          <circle cx="12" cy="12" r="4.3" fill="var(--ac,transparent)" style={{ filter: "var(--acg,none)" }} />
          <circle cx="12" cy="12" r="2.1" fill="currentColor" />
        </>
      );
    case 'takehome':
      return (
        <>
          <defs>
            <mask id={`${maskId}-m-gem`} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
              <rect width="24" height="24" fill="#fff" />
              <rect x="11.55" y="9.9" width=".9" height="11" fill="#000" />
              <path d="M8.5 3.5 L12 9 M15.5 3.5 L12 9" fill="none" stroke="#000" style={{ strokeWidth: ".9" }} />
            </mask>
          </defs>
          <path fill="currentColor" mask={`url(#${maskId}-m-gem)`} d="M5 9.9 H19 L12 21 Z" />
          <path d="M5 9 L8.5 3.5 H15.5 L19 9 Z" fill="var(--ac,currentColor)" mask={`url(#${maskId}-m-gem)`} style={{ filter: "var(--acg,none)" }} />
        </>
      );
    case 'wandering':
      return (
        <>
          <defs>
            <mask id={`${maskId}-m9-bag-a`} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
              <rect width="24" height="24" fill="#fff" />
              <path d="M13.5 11.2 L14.5 13.6 L16.9 14.6 L14.5 15.6 L13.5 18 L12.5 15.6 L10.1 14.6 L12.5 13.6 Z M8.2 10.7 L8.6 11.6 L9.5 12 L8.6 12.4 L8.2 13.3 L7.8 12.4 L6.9 12 L7.8 11.6 Z M17.2 16.9 L17.6 17.8 L18.5 18.2 L17.6 18.6 L17.2 19.5 L16.8 18.6 L15.9 18.2 L16.8 17.8 Z" fill="#000" />
            </mask>
          </defs>
          <path d="M4 8.5 H20 L21.2 21.5 H2.8 Z" fill="currentColor" mask={`url(#${maskId}-m9-bag-a)`} />
          <path d="M8.5 8.5 V6.6 A3.5 3.5 0 0 1 15.5 6.6 V8.5" fill="none" stroke="var(--ac,currentColor)" style={{ strokeWidth: "1.6", filter: "var(--acg,none)" }} />
          <path d="M13.5 11.2 L14.5 13.6 L16.9 14.6 L14.5 15.6 L13.5 18 L12.5 15.6 L10.1 14.6 L12.5 13.6 Z M8.2 10.7 L8.6 11.6 L9.5 12 L8.6 12.4 L8.2 13.3 L7.8 12.4 L6.9 12 L7.8 11.6 Z M17.2 16.9 L17.6 17.8 L18.5 18.2 L17.6 18.6 L17.2 19.5 L16.8 18.6 L15.9 18.2 L16.8 17.8 Z" fill="var(--ac,transparent)" style={{ filter: "var(--acg,none)" }} />
        </>
      );
  }
}

export function ChapterIcon({ chapter, lit = false }: { readonly chapter: ChapterKey; readonly lit?: boolean }) {
  // A chapter appears in multiple surfaces at once, so each instance needs private mask IDs.
  const maskId = useId();
  return (
        <svg aria-hidden="true" className="chapter-icon" data-chapter={chapter} data-lit={lit || undefined} focusable="false" viewBox="0 0 24 24">
          <ChapterArtwork chapter={chapter} maskId={maskId} />
        </svg>
  );
}
