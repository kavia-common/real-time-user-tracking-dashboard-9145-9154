import React, { useEffect, useMemo } from "react";
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import { useTracking } from "../state/TrackingContext";

import "leaflet/dist/leaflet.css";

// Fix default marker icon paths for CRA builds.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function FitToSelection({ selectedUser }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedUser) return;
    const { lat, lng } = selectedUser.position;
    map.flyTo([lat, lng], Math.max(map.getZoom(), 13), { duration: 0.9 });
  }, [map, selectedUser]);

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

// PUBLIC_INTERFACE
export default function MapView() {
  /** Main map area visualizing multiple users' current locations and paths. */
  const { users, selectedUser } = useTracking();

  const center = useMemo(() => {
    const u = selectedUser || users[0];
    if (!u) return [37.7749, -122.4194];
    return [u.position.lat, u.position.lng];
  }, [users, selectedUser]);

  return (
    <section className="mapCard" aria-label="Live map">
      <div className="mapHeader">
        <div className="mapHeader__title">Live Map</div>
        <div className="mapHeader__subtitle">
          Showing {users.length} user{users.length === 1 ? "" : "s"} · routes + current positions
        </div>
      </div>

      <div className="mapShell" role="region" aria-label="Map region">
        <MapContainer center={center} zoom={12} scrollWheelZoom className="mapRoot">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FitToSelection selectedUser={selectedUser} />

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
                    <div className="mapTooltip__meta">{u.progress}% complete</div>
                  </div>
                </Tooltip>
              </Marker>
            </React.Fragment>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}
