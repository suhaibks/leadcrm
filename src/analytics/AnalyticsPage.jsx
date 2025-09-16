import React from "react";
import { useApp } from "../store/AppContext.jsx";

export default function AnalyticsPage() {
  const { state } = useApp();
  const leads = state.leads || [];

  // simple counts
  const by = (key) =>
    leads.reduce((m, l) => {
      const k = (l[key] || "Unknown").toString();
      m[k] = (m[k] || 0) + 1;
      return m;
    }, {});

  const byStatus = by("status");
  const bySource = by("source");
  const byOwner  = by("assignedTo");

  return (
    <section className="page">
      <div className="page-header">
        <h1>Analytics</h1>
      </div>

      <div className="kpi-grid">
        <KPI label="Total Leads" value={leads.length} />
        <KPI label="Converted" value={byStatus["Converted"] || 0} />
        <KPI label="Qualified" value={byStatus["Qualified"] || 0} />
        <KPI label="Owners" value={Object.keys(byOwner).length} />
      </div>

      <div className="card">
        <h3 style={{marginTop:0}}>Leads by Status</h3>
        <Bars data={byStatus} />
      </div>

      <div className="card">
        <h3 style={{marginTop:0}}>Leads by Source</h3>
        <Bars data={bySource} />
      </div>

      <div className="card">
        <h3 style={{marginTop:0}}>Leads by Owner</h3>
        <Bars data={byOwner} />
      </div>
    </section>
  );
}

function KPI({ label, value }) {
  return (
    <div className="kpi">
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
    </div>
  );
}

function Bars({ data }) {
  const entries = Object.entries(data).sort((a,b)=>b[1]-a[1]);
  const max = Math.max(1, ...entries.map(([,v])=>v));
  return (
    <div className="bars">
      {entries.map(([label, v]) => (
        <div className="bar-row" key={label}>
          <div className="bar-label" title={label}>{label}</div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${(v/max)*100}%` }} />
          </div>
          <div className="bar-value">{v}</div>
        </div>
      ))}
      {entries.length === 0 && <div className="muted">No data.</div>}
    </div>
  );
}
