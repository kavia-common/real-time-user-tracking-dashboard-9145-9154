import React from "react";
import "./App.css";
import TopNav from "./components/TopNav";
import SidebarUserList from "./components/SidebarUserList";
import MapView from "./components/MapView";
import ProgressPanel from "./components/ProgressPanel";
import { TrackingProvider } from "./state/TrackingContext";

// PUBLIC_INTERFACE
function App() {
  /** Dashboard root app: top nav, left user list, central map, right progress panel. */
  return (
    <TrackingProvider>
      <div className="appRoot">
        <TopNav />
        <div className="contentGrid">
          <SidebarUserList />
          <main className="mainArea" aria-label="Dashboard main content">
            <MapView />
          </main>
          <ProgressPanel />
        </div>
      </div>
    </TrackingProvider>
  );
}

export default App;
