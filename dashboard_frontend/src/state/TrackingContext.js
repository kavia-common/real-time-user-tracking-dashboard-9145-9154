import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getAppConfig } from "../config";

/**
 * Data model notes:
 * - A "route" is a polyline array of [lat, lng]
 * - progress is computed against route index for demo (0..100)
 */

const TrackingContext = createContext(null);

const STATUSES = ["active", "idle", "offline"];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function jitter(value, amount) {
  return value + (Math.random() * 2 - 1) * amount;
}

function computeProgress(routeIndex, routeLen) {
  if (routeLen <= 1) return 0;
  return Math.round((routeIndex / (routeLen - 1)) * 100);
}

function buildMockUsers() {
  // Around San Francisco for a pleasant default.
  const base = { lat: 37.7749, lng: -122.4194 };
  const routes = [
    Array.from({ length: 30 }).map((_, i) => [base.lat + 0.015 * (i / 29), base.lng + 0.02 * Math.sin(i / 6)]),
    Array.from({ length: 26 }).map((_, i) => [base.lat - 0.01 * (i / 25), base.lng + 0.018 * (i / 25)]),
    Array.from({ length: 34 }).map((_, i) => [base.lat + 0.012 * Math.cos(i / 7), base.lng - 0.02 * (i / 33)]),
    Array.from({ length: 22 }).map((_, i) => [base.lat - 0.008 * Math.sin(i / 4), base.lng - 0.014 * (i / 21)]),
  ];

  const users = [
    { id: "u-1001", name: "Ava Chen", status: "active", color: "#2563EB", route: routes[0] },
    { id: "u-1002", name: "Noah Patel", status: "active", color: "#F59E0B", route: routes[1] },
    { id: "u-1003", name: "Mia Rivera", status: "idle", color: "#10B981", route: routes[2] },
    { id: "u-1004", name: "Liam Kim", status: "offline", color: "#EF4444", route: routes[3] },
  ].map((u) => {
    const routeIndex = u.status === "offline" ? 0 : Math.floor(Math.random() * 4);
    const [lat, lng] = u.route[routeIndex];
    return {
      ...u,
      routeIndex,
      position: { lat, lng },
      progress: computeProgress(routeIndex, u.route.length),
      lastUpdatedAt: Date.now(),
    };
  });

  return users;
}

function stepUser(user) {
  // offline users don't move
  if (user.status === "offline") return user;

  // idle users move slowly
  const speed = user.status === "idle" ? 0.35 : 0.85;

  // Advance index with probability based on speed
  let nextIndex = user.routeIndex;
  if (Math.random() < speed) nextIndex = Math.min(user.routeIndex + 1, user.route.length - 1);

  // If at end, loop back (demo)
  if (nextIndex >= user.route.length - 1 && Math.random() < 0.35) {
    nextIndex = 0;
  }

  const [targetLat, targetLng] = user.route[nextIndex];
  const lat = lerp(user.position.lat, targetLat, 0.55);
  const lng = lerp(user.position.lng, targetLng, 0.55);

  // subtle GPS noise
  const noisy = { lat: jitter(lat, 0.00035), lng: jitter(lng, 0.00035) };

  return {
    ...user,
    routeIndex: nextIndex,
    position: noisy,
    progress: computeProgress(nextIndex, user.route.length),
    lastUpdatedAt: Date.now(),
  };
}

// PUBLIC_INTERFACE
export function TrackingProvider({ children }) {
  /** Provider for live tracking state (mock simulation by default). */
  const config = useMemo(() => getAppConfig(), []);
  const [users, setUsers] = useState(() => buildMockUsers());
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id || null);

  const intervalRef = useRef(null);

  useEffect(() => {
    // In the future, use config.useRealData + config.wsUrl to connect to WebSocket.
    // For now, we always run a local simulation unless useRealData is enabled.
    if (config.useRealData) return;

    intervalRef.current = window.setInterval(() => {
      setUsers((prev) => {
        // Occasionally change statuses for realism.
        const shouldToggle = Math.random() < 0.08;

        return prev.map((u) => {
          let updated = stepUser(u);
          if (shouldToggle && Math.random() < 0.25) {
            const nextStatus = STATUSES[Math.floor(Math.random() * STATUSES.length)];
            updated = { ...updated, status: nextStatus };
          }
          return updated;
        });
      });
    }, 1100);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [config.useRealData]);

  const selectedUser = useMemo(
    () => users.find((u) => u.id === selectedUserId) || null,
    [users, selectedUserId]
  );

  const value = useMemo(
    () => ({
      config,
      users,
      selectedUserId,
      selectedUser,
      setSelectedUserId,
      setUsers,
    }),
    [config, users, selectedUserId, selectedUser]
  );

  return <TrackingContext.Provider value={value}>{children}</TrackingContext.Provider>;
}

// PUBLIC_INTERFACE
export function useTracking() {
  /** Hook to access the TrackingContext. */
  const ctx = useContext(TrackingContext);
  if (!ctx) throw new Error("useTracking must be used within a TrackingProvider");
  return ctx;
}
