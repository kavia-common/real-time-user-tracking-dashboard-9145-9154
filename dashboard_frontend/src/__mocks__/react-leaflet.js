const React = require("react");

/**
 * JSDOM-safe mocks for react-leaflet components/hooks used by the app.
 * These mocks are intentionally minimal and render basic DOM placeholders so
 * React Testing Library can still query the UI around the map container.
 */

function createPassthroughComponent(displayName) {
  const Comp = ({ children, ...props }) => (
    <div data-testid={displayName} {...props}>
      {children}
    </div>
  );
  Comp.displayName = displayName;
  return Comp;
}

const MapContainer = createPassthroughComponent("MapContainer");
const Marker = createPassthroughComponent("Marker");
const Polyline = createPassthroughComponent("Polyline");
const Tooltip = createPassthroughComponent("Tooltip");
const TileLayer = createPassthroughComponent("TileLayer");

/**
 * Hook mock: provide only the methods the code calls.
 * - flyTo
 * - getZoom
 */
function useMap() {
  return {
    flyTo: jest.fn(),
    getZoom: jest.fn(() => 12),
  };
}

module.exports = {
  MapContainer,
  Marker,
  Polyline,
  Tooltip,
  TileLayer,
  useMap,
};
