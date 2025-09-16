import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import LeadsPage from "./leads/LeadsPage.jsx";
import SettingsPage from "./settings/SettingsPage.jsx";
import AnalyticsPage from "./analytics/AnalyticsPage.jsx"; // ✅ make sure this path/file exists
import { AppProvider } from "./store/AppContext.jsx";

export default function App() {
  return (
    <AppProvider>
      <div className="app">
        <Sidebar />
        <main className="main">
          <Routes>
            <Route path="/leads" element={<LeadsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} /> {/* ✅ new */}
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/leads" replace />} />
          </Routes>
        </main>
      </div>
    </AppProvider>
  );
}

function Sidebar() {
  const loc = useLocation();
  return (
    <aside className="sidebar">
      <div className="brand">LeadCRM</div>
      <nav>
        <Link className={loc.pathname.startsWith("/leads") ? "active" : ""} to="/leads">Leads</Link>
        <Link className={loc.pathname.startsWith("/analytics") ? "active" : ""} to="/analytics">Analytics</Link>
        <Link className={loc.pathname.startsWith("/settings") ? "active" : ""} to="/settings">Settings</Link>
      </nav>
    </aside>
  );
}
