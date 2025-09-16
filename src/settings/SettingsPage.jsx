import React from "react";
import { useApp } from "../store/AppContext.jsx";

export default function SettingsPage() {
  const { state, dispatch } = useApp();
  const [settings, setSettings] = React.useState(state.settings);

  function save() {
    dispatch({ type: "SET_SETTINGS", payload: settings });
    alert("Settings saved");
  }

  function addUser() {
    const name = prompt("User name?");
    if (!name) return;
    setSettings((s) => ({
      ...s,
      users: [...s.users, { id: crypto.randomUUID(), name, active: true }],
    }));
  }

  return (
    <section className="page page--fluid">
      <div className="page-header">
        <h1>Settings</h1>
        <button className="primary" onClick={save}>Save</button>
      </div>

      {/* Full-width vertical stack */}
      <div className="stack">
        {/* USERS */}
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Enrollment Advisor</h3>
          <div style={{ marginBottom: 12 }}>
            <button className="secondary" onClick={addUser}>Add User</button>
          </div>
          <ul className="list" style={{ marginTop: 8 }}>
            {settings.users.map((u) => (
              <li key={u.id}>
                <span>{u.name}</span>
                <label>
                  <input
                    type="checkbox"
                    checked={u.active}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        users: s.users.map((x) =>
                          x.id === u.id ? { ...x, active: e.target.checked } : x
                        ),
                      }))
                    }
                  />{" "}
                  Active
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* PICKLISTS */}
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Picklists</h3>

          {Object.entries(settings.picklists).map(([key, arr]) => (
            <div key={key} className="picklist-block">
              <div className="picklist-header">
                <div>{key}</div>
              </div>

              {/* Aligned, responsive grid */}
              <ul className="pick-grid">
  {arr.map((val, idx) => (
    <li key={idx} className="pick-item">
      <input
        value={val}
        onChange={(e) =>
          setSettings((s) => ({
            ...s,
            picklists: {
              ...s.picklists,
              [key]: s.picklists[key].map((x, i) =>
                i === idx ? e.target.value : x
              ),
            },
          }))
        }
      />
      <button
        className="remove-btn"
        title="Remove"
        onClick={() =>
          setSettings((s) => ({
            ...s,
            picklists: {
              ...s.picklists,
              [key]: s.picklists[key].filter((_, i) => i !== idx),
            },
          }))
        }
      >
        ×
      </button>
    </li>
  ))}

  {/* Add button inside grid */}
  <li key="add" className="pick-add"
      onClick={() =>
        setSettings((s) => ({
          ...s,
          picklists: {
            ...s.picklists,
            [key]: [...s.picklists[key], "New Value"],
          },
        }))
      }
  >
    + Add
  </li>
</ul>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
