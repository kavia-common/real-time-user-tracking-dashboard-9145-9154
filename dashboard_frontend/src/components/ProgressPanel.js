import React from "react";
import { useTracking } from "../state/TrackingContext";

// PUBLIC_INTERFACE
export default function ProgressPanel() {
  /** Right-side panel showing route completion progress for each user. */
  const { users } = useTracking();

  return (
    <aside className="progressPanel" aria-label="Progress summary">
      <div className="panelHeader">
        <div>
          <div className="panelTitle">Route Progress</div>
          <div className="panelHint">Completion percentage per user</div>
        </div>
      </div>

      <div className="progressList">
        {users.map((u) => (
          <div className="progressRow" key={u.id}>
            <div className="progressRow__top">
              <div className="progressRow__name">{u.name}</div>
              <div className="progressRow__pct">{u.progress}%</div>
            </div>
            <div className="progressBar" role="progressbar" aria-valuenow={u.progress} aria-valuemin={0} aria-valuemax={100}>
              <div
                className="progressBar__fill"
                style={{
                  width: `${u.progress}%`,
                  background: u.color,
                }}
              />
            </div>
            <div className="progressRow__meta">
              <span className="mono">
                {u.position.lat.toFixed(4)}, {u.position.lng.toFixed(4)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
