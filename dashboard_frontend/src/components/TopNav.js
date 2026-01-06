import React from "react";
import { useTracking } from "../state/TrackingContext";
import { THEME } from "../config";

function Pill({ children }) {
  return <span className="pill">{children}</span>;
}

// PUBLIC_INTERFACE
export default function TopNav() {
  /** Top navigation bar showing app title and connection mode. */
  const { config } = useTracking();

  return (
    <header className="topNav" role="banner" aria-label="Top navigation">
      <div className="topNav__left">
        <div className="brandMark" aria-hidden="true" />
        <div className="brandText">
          <div className="brandTitle">OceanTrack</div>
          <div className="brandSubtitle">Real-time User Tracking Dashboard</div>
        </div>
      </div>

      <div className="topNav__right">
        <Pill>
          Mode:{" "}
          <strong style={{ color: config.useRealData ? THEME.colors.success : THEME.colors.primary }}>
            {config.useRealData ? "Live" : "Mock"}
          </strong>
        </Pill>
        <Pill>
          API: <span className="mono">{config.apiBase || "—"}</span>
        </Pill>
        <Pill>
          WS: <span className="mono">{config.wsUrl || "—"}</span>
        </Pill>
      </div>
    </header>
  );
}
