import React, { useMemo } from "react";
import { useTracking } from "../state/TrackingContext";
import { EmptyState, LoadingSkeleton } from "./UIStates";

// PUBLIC_INTERFACE
export default function ProgressPanel() {
  /** Right-side panel showing route completion progress for each user. */
  const { users } = useTracking();

  // In mock mode we always have users quickly, but reserve a consistent layout.
  const isLoading = false;

  const sorted = useMemo(() => {
    return [...users].sort((a, b) => b.progress - a.progress);
  }, [users]);

  return (
    <aside className="progressPanel" aria-label="Progress summary">
      <div className="panelHeader">
        <div className="panelHeader__text">
          <div className="panelTitle">Route Progress</div>
          <div className="panelHint">Completion percentage per user</div>
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton lines={6} />
      ) : !sorted.length ? (
        <EmptyState title="No progress" message="No users are available to show progress." />
      ) : (
        <div className="progressList">
          {sorted.map((u) => (
            <div className="progressRow" key={u.id}>
              <div className="progressRow__top">
                <div className="progressRow__name" title={u.name}>
                  {u.name}
                </div>
                <div className="progressRow__pct" aria-label={`${u.progress}% complete`}>
                  {u.progress}%
                </div>
              </div>

              <div
                className="progressBar"
                role="progressbar"
                aria-label={`Progress for ${u.name}`}
                aria-valuenow={u.progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
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
      )}
    </aside>
  );
}
