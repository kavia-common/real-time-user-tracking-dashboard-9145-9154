/* eslint-disable no-undef */
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

/**
 * Jest module mocks:
 * - react-leaflet/leaflet are ESM and rely on browser APIs not present in JSDOM.
 *   We provide lightweight mocks under src/__mocks__/ to keep tests stable.
 * - leaflet CSS import is mocked to a no-op so Jest doesn't try to parse CSS.
 */
jest.mock("react-leaflet");
jest.mock("leaflet");
jest.mock("leaflet/dist/leaflet.css", () => ({}));

/**
 * Some components use window.matchMedia for responsive behavior.
 * JSDOM doesn't implement it, so we provide a minimal shim.
 */
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

/**
 * Ensure timers don't leak between tests (TrackingContext/ToastProvider use intervals/timeouts).
 * CRA uses fake timers in some environments; we defensively clear and restore.
 */
afterEach(() => {
  // Only attempt to advance timers if this test enabled fake timers.
  // jest.isMockFunction(setTimeout) is a reliable signal that Jest has replaced the timers API.
  const usingFakeTimers = typeof setTimeout === "function" && jest.isMockFunction(setTimeout);

  if (usingFakeTimers) {
    try {
      jest.runOnlyPendingTimers();
    } catch {
      // ignore
    }
  }

  try {
    jest.clearAllTimers();
  } catch {
    // ignore if real timers are active
  }

  try {
    jest.useRealTimers();
  } catch {
    // ignore in environments where it's not supported
  }
});
