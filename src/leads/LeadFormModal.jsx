import React from "react";
import { useApp } from "../store/AppContext.jsx";

export default function LeadFormModal({ onClose, initial }) {
  const { state, dispatch } = useApp();
  const [form, setForm] = React.useState(() => initial || { status: "New" });

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function submit(e) {
    e.preventDefault();
    if (!form.name || !form.name.trim()) {
      alert("Name is required");
      return;
    }
    if (initial) {
      dispatch({ type: "UPDATE_LEAD", payload: { id: initial.id, patch: form } });
    } else {
      dispatch({ type: "ADD_LEAD", payload: form });
    }
    onClose();
  }

  const p = state.settings.picklists;
  const users = state.settings.users.filter((u) => u.active);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{initial ? "Edit Lead" : "Add Lead"}</h3>
        </div>

        <form onSubmit={submit} className="grid two">
          <Input label="Name" value={form.name || ""} onChange={(v) => set("name", v)} required />
          <Input label="Phone" value={form.phone || ""} onChange={(v) => set("phone", v)} />
          <Input label="Alt. Phone" value={form.altPhone || ""} onChange={(v) => set("altPhone", v)} />
          <Input label="Email" value={form.email || ""} onChange={(v) => set("email", v)} />
          <Input label="Alt. Email" value={form.altEmail || ""} onChange={(v) => set("altEmail", v)} />

          <Select label="Status" value={form.status || "New"} onChange={(v) => set("status", v)} options={p.statuses} />
          <Select label="Qualification" value={form.qualification || ""} onChange={(v) => set("qualification", v)} options={p.qualifications} allowEmpty />
          <Select label="Interest Field" value={form.interestField || ""} onChange={(v) => set("interestField", v)} options={p.interestFields} allowEmpty />
          <Select label="Source" value={form.source || ""} onChange={(v) => set("source", v)} options={p.sources} allowEmpty />
          <Select label="Assigned To" value={form.assignedTo || ""} onChange={(v) => set("assignedTo", v)} options={users.map((u) => u.name)} allowEmpty />

          <Input label="City" value={form.city || ""} onChange={(v) => set("city", v)} />
          <Input label="State" value={form.state || ""} onChange={(v) => set("state", v)} />
          <Input label="Passout Year" type="number" value={form.passoutYear || ""} onChange={(v) => set("passoutYear", v)} />
          <Input label="Heard From" value={form.heardFrom || ""} onChange={(v) => set("heardFrom", v)} />
          <Input label="Notes" textarea value={form.notes || ""} onChange={(v) => set("notes", v)} />

          <div className="modal-actions">
            <button type="button" className="secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="primary" type="submit">
              {initial ? "Save" : "Add Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, required, type = "text", textarea }) {
  return (
    <label className="field">
      <span>
        {label}
        {required && " *"}
      </span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} type={type} />
      )}
    </label>
  );
}

function Select({ label, value, onChange, options, allowEmpty }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {allowEmpty && <option value="">-</option>}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}
