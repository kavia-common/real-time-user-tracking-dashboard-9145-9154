import React, { useMemo } from "react";
import { useTracking } from "../state/TrackingContext";

function Pill({ children }) {
  return <span className="pill">{children}</span>;
}

// PUBLIC_INTERFACE
export default function TopNav({ onToggleSidebar, isSidebarOpen }) {
  /** Top navigation bar showing app title, connection mode, and optional environment badge. */
  const { config } = useTracking();

  const envLabel = useMemo(() => {
    const v = (config.environmentLabel || "").toLowerCase();
    if (!v) return "";
    if (v === "production") return "PROD";
    if (v === "development") return "DEV";
    if (v === "test") return "TEST";
    return v.toUpperCase();
  }, [config.environmentLabel]);

  return (
    <header className="topNav" role="banner" aria-label="Top navigation">
      <div className="topNav__left">
        <div className="brandMark" aria-hidden="true" />
        <div className="brandText">
          <div className="brandTitle">OceanTrack</div>
          <div className="brandSubtitle">Real-time User Tracking Dashboard</div>
        </div>

        {envLabel ? <span className="badge badge--env" aria-label={`Environment ${envLabel}`}>{envLabel}</span> : null}
      </div>

      <div className="topNav__right">
        <button
          type="button"
          className="iconButton iconButton--ghost"
          aria-label={isSidebarOpen ? "Close user list" : "Open user list"}
          aria-pressed={isSidebarOpen ? "true" : "false"}
          onClick={onToggleSidebar}
        >
          ☰
        </button>

        <Pill>
          Mode:{" "}
          <strong style={{ color: config.useRealData ? "var(--color-success)" : "var(--color-primary)" }}>
            {config.useRealData ? "Live" : "Mock"}
          </strong>
        </Pill>
        <Pill>
          API: <span className="mono">{config.apiBase || "—"}</span>
        </Pill>
        <Pill>
          WS: <span className="mono">{config.wsUrl || "—"}</span>
        </Pill>

        <button type="button" className="iconButton iconButton--ghost" aria-label="Open settings menu (placeholder)">
          ⚙
        </button>
      </div>
    </header>
  );
}
