export function HeartIcon({ filled = false }: { readonly filled?: boolean }) {
  return (
    <svg aria-hidden="true" className="heart-icon" focusable="false" viewBox="0 0 24 24">
      {filled ? (
        <path fill="currentColor" d="M12 20.4 C10.6 19.1 3 13.9 3 8.9 C3 5.9 5.2 3.8 7.9 3.8 C9.6 3.8 11.1 4.7 12 6.1 C12.9 4.7 14.4 3.8 16.1 3.8 C18.8 3.8 21 5.9 21 8.9 C21 13.9 13.4 19.1 12 20.4 Z" />
      ) : (
        <path fill="currentColor" fillRule="evenodd" d="M12 20.4 C10.6 19.1 3 13.9 3 8.9 C3 5.9 5.2 3.8 7.9 3.8 C9.6 3.8 11.1 4.7 12 6.1 C12.9 4.7 14.4 3.8 16.1 3.8 C18.8 3.8 21 5.9 21 8.9 C21 13.9 13.4 19.1 12 20.4 Z M12 17.65 C11.08 16.79 6.06 13.36 6.06 10.06 C6.06 8.08 7.51 6.69 9.29 6.69 C10.42 6.69 11.41 7.28 12 8.21 C12.59 7.28 13.58 6.69 14.71 6.69 C16.49 6.69 17.94 8.08 17.94 10.06 C17.94 13.36 12.92 16.79 12 17.65 Z" />
      )}
    </svg>
  );
}
