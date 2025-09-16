import React from "react";
import { seedState, migrateIfNeeded } from "./seed.js";

const KEY = "leadcrm:v1";
const AppContext = React.createContext(null);

function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seedState();
    return migrateIfNeeded(JSON.parse(raw));
  } catch {
    return seedState();
  }
}
function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

const initial = loadState();

function reducer(state, action) {
  switch (action.type) {
    case "ADD_LEAD": {
      const now = new Date().toISOString();
      const lead = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };
      const next = { ...state, leads: [lead, ...state.leads] };
      saveState(next);
      return next;
    }
    case "UPDATE_LEAD": {
      const { id, patch } = action.payload;
      const leads = state.leads.map((l) =>
        l.id === id ? { ...l, ...patch, updatedAt: new Date().toISOString() } : l
      );
      const next = { ...state, leads };
      saveState(next);
      return next;
    }
    case "DELETE_LEAD": {
      const next = { ...state, leads: state.leads.filter((l) => l.id !== action.payload) };
      saveState(next);
      return next;
    }
    case "SET_SETTINGS": {
      const next = { ...state, settings: action.payload };
      saveState(next);
      return next;
    }
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = React.useReducer(reducer, initial);
  const value = React.useMemo(() => ({ state, dispatch }), [state]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = React.useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
