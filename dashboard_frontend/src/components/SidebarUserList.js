import React, { useMemo } from "react";
import { useTracking } from "../state/TrackingContext";

function formatRelativeTime(ts) {
  const delta = Date.now() - ts;
  const s = Math.floor(delta / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  return `${m}m ago`;
}

function statusMeta(status) {
  switch (status) {
    case "active":
      return { label: "Active", dotClass: "dot dot--active" };
    case "idle":
      return { label: "Idle", dotClass: "dot dot--idle" };
    case "offline":
    default:
      return { label: "Offline", dotClass: "dot dot--offline" };
  }
}

// PUBLIC_INTERFACE
export default function SidebarUserList() {
  /** Left sidebar listing users with statuses and quick stats. */
  const { users, selectedUserId, setSelectedUserId } = useTracking();

  const counts = useMemo(() => {
    const c = { active: 0, idle: 0, offline: 0 };
    users.forEach((u) => {
      c[u.status] = (c[u.status] || 0) + 1;
    });
    return c;
  }, [users]);

  return (
    <aside className="sidebar" aria-label="User list sidebar">
      <div className="panelHeader">
        <div>
          <div className="panelTitle">Users</div>
          <div className="panelHint">
            Active {counts.active} · Idle {counts.idle} · Offline {counts.offline}
          </div>
        </div>
      </div>

      <div className="sidebarList" role="list">
        {users.map((u) => {
          const meta = statusMeta(u.status);
          const selected = u.id === selectedUserId;

          return (
            <button
              key={u.id}
              type="button"
              className={`userRow ${selected ? "userRow--selected" : ""}`}
              onClick={() => setSelectedUserId(u.id)}
              role="listitem"
              aria-current={selected ? "true" : "false"}
            >
              <div className="userRow__avatar" aria-hidden="true" style={{ borderColor: u.color }}>
                {u.name
                  .split(" ")
                  .slice(0, 2)
                  .map((p) => p[0])
                  .join("")
                  .toUpperCase()}
              </div>

              <div className="userRow__main">
                <div className="userRow__top">
                  <div className="userRow__name">{u.name}</div>
                  <div className="userRow__pct">{u.progress}%</div>
                </div>
                <div className="userRow__bottom">
                  <span className={meta.dotClass} aria-hidden="true" />
                  <span className="userRow__status">{meta.label}</span>
                  <span className="userRow__sep" aria-hidden="true">
                    •
                  </span>
                  <span className="userRow__time">{formatRelativeTime(u.lastUpdatedAt)}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="sidebarFooter">
        <div className="sidebarFooter__note">
          Tip: click a user to focus their route on the map.
        </div>
      </div>
    </aside>
  );
}
