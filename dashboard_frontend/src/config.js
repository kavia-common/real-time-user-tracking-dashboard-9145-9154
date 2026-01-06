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

  // Optional environment badge (requested). Do not introduce new env vars.
  const environmentLabel = (process.env.REACT_APP_NODE_ENV || "").trim();

  return {
    apiBase,
    backendUrl,
    wsUrl,
    useRealData,
    environmentLabel,
    appName: "OceanTrack Dashboard",
  };
}
