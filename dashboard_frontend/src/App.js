import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import TopNav from "./components/TopNav";
import SidebarUserList from "./components/SidebarUserList";
import MapView from "./components/MapView";
import ProgressPanel from "./components/ProgressPanel";
import { TrackingProvider } from "./state/TrackingContext";
import { ToastProvider } from "./components/ToastProvider";

// PUBLIC_INTERFACE
function App() {
  /** Dashboard root app: top nav, left user list, central map, right progress panel. */
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isMobileQuery = useMemo(() => window.matchMedia?.("(max-width: 820px)"), []);

  useEffect(() => {
    if (!isMobileQuery) return undefined;

    const onChange = () => {
      // If we leave mobile, ensure sidebar isn't stuck in overlay state.
      if (!isMobileQuery.matches) setIsSidebarOpen(false);
    };

    try {
      isMobileQuery.addEventListener("change", onChange);
      return () => isMobileQuery.removeEventListener("change", onChange);
    } catch {
      // Safari fallback
      isMobileQuery.addListener(onChange);
      return () => isMobileQuery.removeListener(onChange);
    }
  }, [isMobileQuery]);

  const toggleSidebar = useCallback(() => setIsSidebarOpen((v) => !v), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  return (
    <TrackingProvider>
      <ToastProvider>
        <a className="skipLink" href="#main">
          Skip to main content
        </a>

        <div className="appRoot">
          <TopNav onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

          <div className="contentGrid" data-sidebar-open={isSidebarOpen ? "true" : "false"}>
            <nav className="sidebarShell" aria-label="Primary">
              <SidebarUserList
                isOverlayOpen={isSidebarOpen}
                onRequestCloseOverlay={closeSidebar}
              />
            </nav>

            <main id="main" className="mainArea" aria-label="Dashboard main content" tabIndex={-1}>
              <MapView />
            </main>

            <aside className="progressShell" aria-label="Secondary">
              <ProgressPanel />
            </aside>
          </div>

          <footer className="appFooter" aria-label="Footer">
            <span className="appFooter__text">
              OceanTrack · Mock real-time simulation · Keyboard: use ↑/↓ in user list, Enter to select
            </span>
          </footer>
        </div>
      </ToastProvider>
    </TrackingProvider>
  );
}

export default App;
