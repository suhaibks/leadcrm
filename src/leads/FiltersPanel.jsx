import React from "react";

/**
 * Simple standard filters:
 * - status, qualification, interestField, source, assignedTo (dropdowns)
 * - updatedAtRange: Any time | Today | Last 7 days | Last 30 days | This month | This year
 *
 * Props:
 *  value: {
 *    status: string|'',
 *    qualification: string|'',
 *    interestField: string|'',
 *    source: string|'',
 *    assignedTo: string|'',
 *    updatedAtRange: 'any'|'today'|'7d'|'30d'|'thisMonth'|'thisYear'
 *  }
 *  onChange: (next) => void
 *  settings: { picklists, users }
 */
export default function FiltersPanel({ value, onChange, settings }) {
  const p = settings.picklists;
  const users = settings.users.filter(u => u.active).map(u => u.name);

  function setField(key, v) {
    onChange({ ...value, [key]: v });
  }

  return (
    <div className="card filters">
      <div className="filters-head" style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 600 }}>Advanced Filters</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="secondary"
            onClick={() =>
              onChange({
                status: "",
                qualification: "",
                interestField: "",
                source: "",
                assignedTo: "",
                updatedAtRange: "any",
              })
            }
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid two">
        <Field
          label="Status"
          value={value.status || ""}
          onChange={(v) => setField("status", v)}
          options={["", ...p.statuses]}
        />
        <Field
          label="Qualification"
          value={value.qualification || ""}
          onChange={(v) => setField("qualification", v)}
          options={["", ...p.qualifications]}
        />
        <Field
          label="Interest"
          value={value.interestField || ""}
          onChange={(v) => setField("interestField", v)}
          options={["", ...p.interestFields]}
        />
        <Field
          label="Source"
          value={value.source || ""}
          onChange={(v) => setField("source", v)}
          options={["", ...p.sources]}
        />
        <Field
          label="Assigned To"
          value={value.assignedTo || ""}
          onChange={(v) => setField("assignedTo", v)}
          options={["", ...users]}
        />
        <Field
          label="Updated At"
          value={value.updatedAtRange || "any"}
          onChange={(v) => setField("updatedAtRange", v)}
          options={[
            ["any", "Any time"],
            ["today", "Today"],
            ["7d", "Last 7 days"],
            ["30d", "Last 30 days"],
            ["thisMonth", "This month"],
            ["thisYear", "This year"],
          ]}
        />
      </div>
      <p className="muted" style={{ marginTop: 8 }}>
        Choose values to filter. Leave a field blank to ignore it.
      </p>
    </div>
  );
}

function Field({ label, value, onChange, options }) {
  // options can be array of strings or [value,label] tuples
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => {
          const [val, lab] = Array.isArray(opt) ? opt : [opt, opt || "—"];
          return (
            <option key={val ?? "blank"} value={val}>
              {lab === "" ? "—" : lab}
            </option>
          );
        })}
      </select>
    </label>
  );
}
