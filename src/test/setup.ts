import '@testing-library/jest-dom/vitest';

const storedValues = new Map<string, string>();
const localStorageStub: Storage = {
  clear: () => storedValues.clear(),
  getItem: (key) => storedValues.get(key) ?? null,
  get length() {
    return storedValues.size;
  },
  key: (index) => [...storedValues.keys()][index] ?? null,
  removeItem: (key) => storedValues.delete(key),
  setItem: (key, value) => storedValues.set(key, value),
};

// Node 26 exposes a disabled global localStorage that otherwise shadows jsdom's implementation.
Object.defineProperty(window, 'localStorage', {
  configurable: true,
  value: localStorageStub,
});

Object.defineProperty(window, 'matchMedia', {
  configurable: true,
  value: (query: string): MediaQueryList => ({
    addEventListener: () => undefined,
    addListener: () => undefined,
    dispatchEvent: () => false,
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: () => undefined,
    removeListener: () => undefined,
  }),
});

if (typeof Reflect.get(Element.prototype, 'scrollIntoView') !== 'function') {
  Object.defineProperty(Element.prototype, 'scrollIntoView', {
    configurable: true,
    // jsdom has no layout engine; interaction tests assert the call rather than coordinates.
    value: () => undefined,
  });
}

if (typeof Reflect.get(HTMLDialogElement.prototype, 'showModal') !== 'function') {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    value: function showModal(this: HTMLDialogElement) {
      // jsdom lacks the dialog state machine; this mirrors the observable open state.
      this.setAttribute('open', '');
    },
  });
}

if (typeof Reflect.get(HTMLDialogElement.prototype, 'close') !== 'function') {
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    value: function close(this: HTMLDialogElement) {
      this.removeAttribute('open');
    },
  });
}
