import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import { useTracking } from "../state/TrackingContext";
import { ErrorState, LoadingSkeleton } from "./UIStates";
import { formatDateTime, formatNumber } from "../utils/formatting";

import "leaflet/dist/leaflet.css";

// Fix default marker icon paths for CRA builds.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function FitToSelection({ selectedUser, shouldRecenter, onRecenterDone }) {
  const map = useMap();

  // Track selection changes by id so we don't "auto-follow" a moving user
  // (selectedUser object/position changes frequently in the simulation).
  const selectedUserId = selectedUser?.id || null;

  useEffect(() => {
    if (!selectedUserId) return;
    if (!selectedUser?.position) return;

    const { lat, lng } = selectedUser.position;
    map.flyTo([lat, lng], Math.max(map.getZoom(), 13), { duration: 0.9 });
    // Intentionally NOT depending on selectedUser.position to avoid re-flyTo on every tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, selectedUserId]);

  useEffect(() => {
    if (!shouldRecenter || !selectedUserId) return;
    if (!selectedUser?.position) return;

    const { lat, lng } = selectedUser.position;
    map.flyTo([lat, lng], Math.max(map.getZoom(), 13), { duration: 0.6 });
    onRecenterDone?.();
  }, [map, shouldRecenter, selectedUserId, selectedUser, onRecenterDone]);

  return null;
}

function makeDotIcon(color) {
  return L.divIcon({
    className: "userDotIcon",
    html: `<span class="userDotIcon__dot" style="background:${color}"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

// Simple error boundary local to the map panel.
class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const MemoizedLeafletMap = React.memo(function MemoizedLeafletMap({
  center,
  zoom,
  users,
  selectedUser,
  shouldRecenter,
  onRecenterDone,
}) {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom className="mapRoot">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitToSelection selectedUser={selectedUser} shouldRecenter={shouldRecenter} onRecenterDone={onRecenterDone} />

      {users.map((u) => (
        <React.Fragment key={u.id}>
          <Polyline
            positions={u.route}
            pathOptions={{
              color: u.color,
              weight: u.id === selectedUser?.id ? 4 : 3,
              opacity: u.id === selectedUser?.id ? 0.9 : 0.55,
            }}
          />
          <Marker position={[u.position.lat, u.position.lng]} icon={makeDotIcon(u.color)}>
            <Tooltip direction="top" offset={[0, -6]} opacity={1} permanent={false}>
              <div className="mapTooltip">
                <div className="mapTooltip__name">{u.name}</div>
                <div className="mapTooltip__meta">
                  {`${formatNumber(u.progress)}% complete`}
                  {" · "}
                  <span title="Timestamp shown in Asia/Kolkata by default">
                    Updated {formatDateTime(u.lastUpdatedAt, { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            </Tooltip>
          </Marker>
        </React.Fragment>
      ))}
    </MapContainer>
  );
});

// PUBLIC_INTERFACE
export default function MapView() {
  /** Main map area visualizing multiple users' current locations and paths. */
  const { users, selectedUser } = useTracking();

  // Default view (when there is no user/selection available).
  // If later overridden via config/env wiring, those overrides should replace these defaults.
  const DEFAULT_CENTER = useMemo(() => [20.5937, 78.9629], []);
  const DEFAULT_ZOOM = 5;

  const [shouldRecenter, setShouldRecenter] = useState(false);

  const center = useMemo(() => {
    const u = selectedUser || users[0];
    if (!u) return DEFAULT_CENTER;
    return [u.position.lat, u.position.lng];
  }, [users, selectedUser, DEFAULT_CENTER]);

  const zoom = useMemo(() => {
    // When focusing on a specific user we rely on flyTo() (FitToSelection) to adjust zoom,
    // but the initial map zoom should be India-friendly when no selection exists.
    const u = selectedUser || users[0];
    if (!u) return DEFAULT_ZOOM;
    return 12;
  }, [users, selectedUser]);

  const isLoading = false; // reserved for future real-data wiring
  const isEmpty = users.length === 0;

  const onRecenter = useCallback(() => {
    if (!selectedUser) return;
    setShouldRecenter(true);
  }, [selectedUser]);

  const onRecenterDone = useCallback(() => setShouldRecenter(false), []);

  return (
    <section className="mapCard" aria-label="Live map">
      <div className="mapHeader">
        <div className="panelHeader__text">
          <div className="mapHeader__title">Live Map</div>
          <div className="mapHeader__subtitle">
            Showing {users.length} user{users.length === 1 ? "" : "s"} · routes + current positions
          </div>
        </div>

        <div className="panelHeader__actions">
          <button
            type="button"
            className={`button ${selectedUser ? "buttonPrimary" : ""}`}
            onClick={onRecenter}
            disabled={!selectedUser}
            aria-label="Recenter map on selected user"
            title={selectedUser ? "Recenter on selected user" : "Select a user to enable recenter"}
          >
            Recenter
          </button>
        </div>
      </div>

      <div className="mapShell" role="region" aria-label="Map region" tabIndex={0}>
        <MapErrorBoundary
          fallback={<ErrorState title="Map error" message="The map failed to render. Reload to try again." />}
        >
          {isLoading ? (
            <LoadingSkeleton lines={10} />
          ) : isEmpty ? (
            <ErrorState title="No users" message="There are no users to show on the map." />
          ) : (
            <MemoizedLeafletMap
              center={center}
              zoom={zoom}
              users={users}
              selectedUser={selectedUser}
              shouldRecenter={shouldRecenter}
              onRecenterDone={onRecenterDone}
            />
          )}
        </MapErrorBoundary>
      </div>
    </section>
  );
}
