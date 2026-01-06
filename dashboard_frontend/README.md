# Real-time User Tracking Dashboard (Frontend)

This React app renders a dashboard UI with:

- Top navigation bar
- Left sidebar listing users with statuses
- Main map area (Leaflet via `react-leaflet`) showing multiple users (markers) + routes (polylines)
- Right progress panel showing each user's route completion %

## Theme

Ocean Professional (primary `#2563EB`, secondary/amber `#F59E0B`, error `#EF4444`, background `#f9fafb`, surface `#ffffff`, text `#111827`).

Theme tokens (colors/spacing/radius/shadows) are centralized in `src/theme.css` (CSS vars) and `src/theme.js` (JS tokens).

## Accessibility & UX notes

- Landmarks: `header` (banner), `nav` (primary), `main`, `aside`, `footer`.
- Keyboard:
  - Focus the Users list and use **↑/↓**, **Home/End** to change selection.
  - Press **Enter/Space** to confirm selection.
  - On mobile overlay, press **Escape** to close.
- Visible focus rings are enabled via `:focus-visible`.
- Panels reserve space with skeletons (no layout shift).

## Responsive behavior

- Desktop: three-column grid (sidebar / map / progress). Sidebar & progress panels are optionally resizable (CSS `resize`).
- Tablet: progress panel stacks under sidebar.
- Mobile: sidebar becomes an overlay, opened via the ☰ button in the top nav.

## Running

```bash
npm start
```

Runs on port `3000` in the standard CRA dev server.

## Configuration (Environment Variables)

The app reads these optional variables:

- `REACT_APP_API_BASE` – base URL for REST requests (future use)
- `REACT_APP_BACKEND_URL` – backend base URL (future use)
- `REACT_APP_WS_URL` – websocket URL (future use)
- `REACT_APP_FEATURE_FLAGS` – feature flags to toggle behavior
- `REACT_APP_NODE_ENV` – optional environment label badge (e.g., `development`, `production`)

### Toggle mock vs real data

By default, the app runs **mock real-time simulation** (interval updates).
To prepare for real data wiring, set feature flag `useRealData`.

You can set `REACT_APP_FEATURE_FLAGS` as JSON:

```bash
REACT_APP_FEATURE_FLAGS={"useRealData":true}
```

Or as CSV:

```bash
REACT_APP_FEATURE_FLAGS=useRealData
```

If `useRealData` is enabled, the mock simulator stops (you can then wire REST/WS fetching using the URLs above).

## Notes

- Leaflet map tiles are from OpenStreetMap.
- Marker icons are loaded via unpkg CDN to avoid bundler path issues.
