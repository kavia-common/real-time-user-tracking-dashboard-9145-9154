import React, { useCallback, useMemo, useRef } from "react";
import { FixedSizeList as VirtualList } from "react-window";
import { useTracking } from "../state/TrackingContext";
import { EmptyState } from "./UIStates";

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
      return { label: "Active", dotClass: "dot dot--active", badgeClass: "statusBadge statusBadge--active" };
    case "idle":
      return { label: "Idle", dotClass: "dot dot--idle", badgeClass: "statusBadge statusBadge--idle" };
    case "offline":
    default:
      return { label: "Offline", dotClass: "dot dot--offline", badgeClass: "statusBadge statusBadge--offline" };
  }
}

function initials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function clampIndex(i, len) {
  if (len <= 0) return -1;
  return Math.max(0, Math.min(i, len - 1));
}

// PUBLIC_INTERFACE
export default function SidebarUserList({ isOverlayOpen, onRequestCloseOverlay }) {
  /** Left sidebar listing users with statuses and keyboard-friendly selection. */
  const { users, selectedUserId, setSelectedUserId } = useTracking();
  const listRef = useRef(null);

  const counts = useMemo(() => {
    const c = { active: 0, idle: 0, offline: 0 };
    users.forEach((u) => {
      c[u.status] = (c[u.status] || 0) + 1;
    });
    return c;
  }, [users]);

  const selectedIndex = useMemo(
    () => users.findIndex((u) => u.id === selectedUserId),
    [users, selectedUserId]
  );

  const focusAndSelectIndex = useCallback(
    (idx) => {
      const next = clampIndex(idx, users.length);
      if (next < 0) return;
      setSelectedUserId(users[next].id);
      if (listRef.current) listRef.current.scrollToItem(next, "smart");
    },
    [users, setSelectedUserId]
  );

  const onListKeyDown = useCallback(
    (e) => {
      if (!users.length) return;

      const current = selectedIndex >= 0 ? selectedIndex : 0;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          focusAndSelectIndex(current + 1);
          break;
        case "ArrowUp":
          e.preventDefault();
          focusAndSelectIndex(current - 1);
          break;
        case "Home":
          e.preventDefault();
          focusAndSelectIndex(0);
          break;
        case "End":
          e.preventDefault();
          focusAndSelectIndex(users.length - 1);
          break;
        case "Enter":
        case " ":
          // Space/Enter: re-affirm selection and (on mobile) close overlay.
          e.preventDefault();
          focusAndSelectIndex(current);
          if (isOverlayOpen) onRequestCloseOverlay?.();
          break;
        case "Escape":
          if (isOverlayOpen) {
            e.preventDefault();
            onRequestCloseOverlay?.();
          }
          break;
        default:
          break;
      }
    },
    [users, selectedIndex, focusAndSelectIndex, isOverlayOpen, onRequestCloseOverlay]
  );

  const Row = useCallback(
    ({ index, style }) => {
      const u = users[index];
      const meta = statusMeta(u.status);
      const selected = u.id === selectedUserId;

      return (
        <div style={style}>
          <button
            type="button"
            className={`userRow ${selected ? "userRow--selected" : ""}`}
            onClick={() => {
              setSelectedUserId(u.id);
              if (isOverlayOpen) onRequestCloseOverlay?.();
            }}
            role="option"
            aria-selected={selected ? "true" : "false"}
            aria-label={`Select ${u.name}`}
            title={u.name}
          >
            <div className="userRow__avatar" aria-hidden="true" style={{ borderColor: u.color }}>
              {initials(u.name)}
            </div>

            <div className="userRow__main">
              <div className="userRow__top">
                <div className="userRow__name">{u.name}</div>
                <div className="userRow__pct">{u.progress}%</div>
              </div>
              <div className="userRow__bottom">
                <span className={meta.dotClass} aria-hidden="true" />
                <span className={meta.badgeClass}>{meta.label}</span>
                <span className="userRow__time" aria-label={`Updated ${formatRelativeTime(u.lastUpdatedAt)}`}>
                  {formatRelativeTime(u.lastUpdatedAt)}
                </span>
              </div>
            </div>
          </button>
        </div>
      );
    },
    [users, selectedUserId, setSelectedUserId, isOverlayOpen, onRequestCloseOverlay]
  );

  return (
    <aside className="sidebar" aria-label="User list sidebar">
      <div className="panelHeader">
        <div className="panelHeader__text">
          <div className="panelTitle">Users</div>
          <div className="panelHint">
            Active {counts.active} · Idle {counts.idle} · Offline {counts.offline}
          </div>
        </div>

        <div className="panelHeader__actions">
          {isOverlayOpen ? (
            <button type="button" className="iconButton" aria-label="Close user list" onClick={onRequestCloseOverlay}>
              ✕
            </button>
          ) : null}
        </div>
      </div>

      {!users.length ? (
        <EmptyState title="No users" message="Mock simulation has no users to display." />
      ) : (
        <div
          className="sidebarList"
          role="listbox"
          aria-label="Users"
          aria-activedescendant={selectedUserId ? `user-option-${selectedUserId}` : undefined}
          tabIndex={0}
          onKeyDown={onListKeyDown}
        >
          <div className="sidebarList__virtual">
            <VirtualList
              ref={listRef}
              height={Math.min(users.length * 72, 520)}
              width="100%"
              itemCount={users.length}
              itemSize={72}
              overscanCount={6}
            >
              {({ index, style }) => {
                const u = users[index];
                // Wrap Row to attach stable id for aria-activedescendant
                return (
                  <div style={style} id={`user-option-${u.id}`}>
                    <Row index={index} style={{}} />
                  </div>
                );
              }}
            </VirtualList>
          </div>
        </div>
      )}

      <div className="sidebarFooter">
        <div className="sidebarFooter__note">Tip: select a user to focus their route on the map.</div>
      </div>
    </aside>
  );
}
