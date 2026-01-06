/**
 * Centralized runtime configuration.
 * Uses env variables when present, and safe defaults otherwise.
 */

// PUBLIC_INTERFACE
export function getAppConfig() {
  /** Return env-based configuration with safe defaults. */
  const apiBase = process.env.REACT_APP_API_BASE || "";
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "";
  const wsUrl = process.env.REACT_APP_WS_URL || "";

  // Allow feature flags via REACT_APP_FEATURE_FLAGS JSON or comma-separated list.
  // Example JSON: {"useRealData": true}
  // Example CSV: useRealData
  let featureFlags = {};
  const rawFlags = process.env.REACT_APP_FEATURE_FLAGS || "";
  if (rawFlags) {
    try {
      featureFlags = JSON.parse(rawFlags);
    } catch {
      featureFlags = rawFlags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .reduce((acc, k) => ({ ...acc, [k]: true }), {});
    }
  }

  const useRealData = Boolean(featureFlags.useRealData);

  return {
    apiBase,
    backendUrl,
    wsUrl,
    useRealData,
    appName: "OceanTrack Dashboard",
  };
}

export const THEME = {
  colors: {
    primary: "#2563EB",
    secondary: "#F59E0B",
    success: "#F59E0B",
    error: "#EF4444",
    background: "#f9fafb",
    surface: "#ffffff",
    text: "#111827",
    border: "#E5E7EB",
    mutedText: "#6B7280",
  },
  gradient: "linear-gradient(135deg, rgba(37,99,235,0.10), #f9fafb 55%)",
};
