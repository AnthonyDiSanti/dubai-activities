const PATHS = {
  check: 'M3 8.6 C4.6 8.6 5.6 11.6 6.8 11.6 C8.4 11.6 10 5.2 13 4.6',
  menu: 'M3 4.5 H13 M3 8 H13 M3 11.5 H9.5',
  'arrow-right': 'M3 8 H12.5 M9.2 4.6 L12.8 8 L9.2 11.4',
  chevron: 'M3.5 12.5 V9.6 C3.5 8.3 4.2 7.4 5 6.8 L8 4.2 L11 6.8 C11.8 7.4 12.5 8.3 12.5 9.6 V12.5 Z',
} as const;

export function UiIcon({ name }: { readonly name: keyof typeof PATHS }) {
  // The arch chevron is a filled silhouette; the other controls share CrossIcon's stroke weight.
  return (
    <svg aria-hidden="true" className={`ui-icon ui-icon--${name}`} focusable="false" viewBox="0 0 16 16">
      <path d={PATHS[name]} />
    </svg>
  );
}
