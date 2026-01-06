/**
 * Formatting utilities for locale/timezone-aware UI output.
 *
 * Defaults:
 * - Locales: ["en-IN", "hi-IN"] (with runtime fallback to browser / "en")
 * - Timezone: "Asia/Kolkata" (with fallback to runtime default if unsupported)
 *
 * Why this exists:
 * - Keep Intl usage consistent across the UI.
 * - Provide graceful fallback for environments without full ICU / TZ data.
 */

const DEFAULT_LOCALES = ["en-IN", "hi-IN"];
const DEFAULT_TIME_ZONE = "Asia/Kolkata";

/**
 * Some runtimes (notably certain Node/JSDOM builds) may not support all timezones/locales.
 * We attempt to construct Intl formatters, and if that fails we drop down to safer options.
 */
function safeIntl(localeOrLocales, factory) {
  try {
    return factory(localeOrLocales);
  } catch {
    // Fallback chain: try browser/default locale resolution, then "en".
    try {
      return factory(undefined);
    } catch {
      return factory("en");
    }
  }
}

function safeTimeZoneOptions(options = {}) {
  // Try with default TZ first; if unsupported, drop the timeZone option.
  try {
    // This construction will throw RangeError for an unknown/unsupported timeZone in some runtimes.
    // We don't need the instance; just validating options.
    // eslint-disable-next-line no-new
    new Intl.DateTimeFormat(DEFAULT_LOCALES, { ...options, timeZone: DEFAULT_TIME_ZONE });
    return { ...options, timeZone: DEFAULT_TIME_ZONE };
  } catch {
    return { ...options };
  }
}

// PUBLIC_INTERFACE
export function getDefaultLocales(config = {}) {
  /** Return the locales used for formatting, allowing optional overrides via existing config. */
  const cfgLocales = config?.formatting?.locales;
  if (Array.isArray(cfgLocales) && cfgLocales.length) return cfgLocales;
  if (typeof cfgLocales === "string" && cfgLocales.trim()) return [cfgLocales.trim()];
  return DEFAULT_LOCALES;
}

// PUBLIC_INTERFACE
export function getDefaultTimeZone(config = {}) {
  /** Return the timezone used for formatting, allowing optional overrides via existing config. */
  const tz = config?.formatting?.timeZone;
  if (typeof tz === "string" && tz.trim()) return tz.trim();
  return DEFAULT_TIME_ZONE;
}

// PUBLIC_INTERFACE
export function formatNumber(value, options = {}, config = {}) {
  /** Format a number with Indian-default locales. */
  const locales = getDefaultLocales(config);
  const formatter = safeIntl(locales, (loc) => new Intl.NumberFormat(loc, options));
  return formatter.format(Number(value));
}

// PUBLIC_INTERFACE
export function formatPercent(value, options = {}, config = {}) {
  /** Format a 0..1 number as percentage using Indian-default locales. */
  const locales = getDefaultLocales(config);
  const formatter = safeIntl(locales, (loc) =>
    new Intl.NumberFormat(loc, { style: "percent", maximumFractionDigits: 0, ...options })
  );
  return formatter.format(Number(value));
}

// PUBLIC_INTERFACE
export function formatCoordinates(lat, lng, fractionDigits = 4, config = {}) {
  /** Format lat/lng as "12.3456, 78.9012" using Indian-default locales. */
  const opts = { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits };
  return `${formatNumber(lat, opts, config)}, ${formatNumber(lng, opts, config)}`;
}

// PUBLIC_INTERFACE
export function formatDateTime(value, options = {}, config = {}) {
  /**
   * Format a date/time in Asia/Kolkata by default.
   * `value` can be Date | number | string (anything Date can parse).
   */
  const date = value instanceof Date ? value : new Date(value);
  const locales = getDefaultLocales(config);

  const baseOptions = safeTimeZoneOptions(options);
  // If config overrides timezone, try that first; otherwise use default.
  const tz = getDefaultTimeZone(config);

  const finalOptions = (() => {
    if (!tz || tz === DEFAULT_TIME_ZONE) return baseOptions;
    try {
      // validate override TZ
      // eslint-disable-next-line no-new
      new Intl.DateTimeFormat(locales, { ...options, timeZone: tz });
      return { ...options, timeZone: tz };
    } catch {
      return baseOptions;
    }
  })();

  const formatter = safeIntl(locales, (loc) => new Intl.DateTimeFormat(loc, finalOptions));
  return formatter.format(date);
}

// PUBLIC_INTERFACE
export function formatRelativeTimeShort(ts, nowMs = Date.now()) {
  /**
   * Small, test-friendly relative time formatter ("just now", "12s ago", "3m ago").
   * This intentionally avoids Intl.RelativeTimeFormat to stay robust across limited ICU.
   */
  const delta = nowMs - ts;
  const s = Math.floor(delta / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  return `${m}m ago`;
}
