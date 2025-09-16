import React from "react";
import { useApp } from "../store/AppContext.jsx";
import LeadFormModal from "./LeadFormModal.jsx";
import FiltersPanel from "./FiltersPanel.jsx";
import { formatDateTime, textIncludes, sortByKey } from "../lib/utils.js";

export default function LeadsPage() {
  const { state, dispatch } = useApp();

  const [showFilters, setShowFilters] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState({ key: "updatedAt", dir: "desc" });
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editLead, setEditLead] = React.useState(null);

  // 👇 NEW: simple filters state
  const [filters, setFilters] = React.useState({
    status: "",
    qualification: "",
    interestField: "",
    source: "",
    assignedTo: "",
    updatedAtRange: "any",
  });

  const filtered = React.useMemo(() => {
    let list = [...state.leads];

    // search
    if (query.trim()) {
      list = list.filter((l) =>
        [l.name, l.email, l.altEmail, l.phone, l.altPhone].some((v) =>
          textIncludes(v, query)
        )
      );
    }

    // 👇 apply simple filters
    list = list.filter((l) => {
      if (filters.status && l.status !== filters.status) return false;
      if (filters.qualification && l.qualification !== filters.qualification) return false;
      if (filters.interestField && l.interestField !== filters.interestField) return false;
      if (filters.source && l.source !== filters.source) return false;
      if (filters.assignedTo && l.assignedTo !== filters.assignedTo) return false;

      if (filters.updatedAtRange && filters.updatedAtRange !== "any") {
        const d = new Date(l.updatedAt);
        const [from, to] = rangeToDates(filters.updatedAtRange);
        if (from && d < from) return false;
        if (to && d > to) return false;
      }
      return true;
    });

    // sort
    list.sort((a, b) => sortByKey(a, b, sort.key, sort.dir));
    return list;
  }, [state.leads, query, sort, filters]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const current = filtered.slice(start, start + pageSize);

  React.useEffect(() => setPage(1), [query, filters, pageSize]);

  return (
    <section className="page">
      <div className="page-header">
        <h1>Leads</h1>
        <div className="actions">
          <button className="secondary" onClick={() => setShowFilters((v) => !v)}>
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          <button
            className="primary"
            onClick={() => {
              setEditLead(null);
              setModalOpen(true);
            }}
          >
            Add Lead
          </button>
        </div>
      </div>

      <input
        className="search"
        placeholder="Search by name, email or phone..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {showFilters && (
        <FiltersPanel value={filters} onChange={setFilters} settings={state.settings} />
      )}

      {/* table + pagination + modal unchanged */}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              {th("name", "Name", sort, setSort)}
              {th("phone", "Contact", sort, setSort)}
              {th("status", "Status", sort, setSort)}
              {th("qualification", "Qualification", sort, setSort)}
              {th("interestField", "Interest", sort, setSort)}
              {th("source", "Source", sort, setSort)}
              {th("assignedTo", "Assigned To", sort, setSort)}
              {th("updatedAt", "Updated At", sort, setSort)}
              <th />
            </tr>
          </thead>
          <tbody>
            {current.map((l) => (
              <tr key={l.id}>
                <td className="link">{l.name}</td>
                <td>{l.phone || "-"}</td>
                <td><StatusBadge status={l.status} /></td>
                <td>{l.qualification || "-"}</td>
                <td>{l.interestField || "-"}</td>
                <td>{l.source || "-"}</td>
                <td>{l.assignedTo || "-"}</td>
                <td>{formatDateTime(l.updatedAt)}</td>
                <td className="actions-cell">
  <button
    className="secondary"
    onClick={() => {
      setEditLead(l);
      setModalOpen(true);
    }}
  >
    Edit
  </button>
  <button
    className="danger"
    onClick={() => {
      if (confirm("Delete this lead?")) {
        dispatch({ type: "DELETE_LEAD", payload: l.id });
      }
    }}
  >
    Delete
  </button>
</td>

              </tr>
            ))}
            {current.length === 0 && (
              <tr><td colSpan="9" className="empty">No leads match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        setPage={setPage}
        pageCount={pageCount}
        pageSize={pageSize}
        setPageSize={setPageSize}
        total={total}
      />

      {modalOpen && (
        <LeadFormModal onClose={() => setModalOpen(false)} initial={editLead} />
      )}
    </section>
  );
}

// helpers (unchanged)
function th(key, label, sort, setSort) {
  const is = sort.key === key;
  const arrow = is ? (sort.dir === "asc" ? "↑" : "↓") : "";
  return (
    <th>
      <button
        className="th"
        onClick={() =>
          setSort(is ? { key, dir: sort.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" })
        }
      >
        {label} {arrow}
      </button>
    </th>
  );
}
function StatusBadge({ status }) {
  return <span className={`badge badge-${(status || "new").toLowerCase().replace(/[^a-z]/g, "")}`}>{status}</span>;
}
function Pagination({ page, setPage, pageCount, pageSize, setPageSize, total }) {
  return (
    <div className="pagination">
      <div>{total} results</div>
      <div className="pager">
        <button onClick={() => setPage(1)} disabled={page === 1}>«</button>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
        <span>Page {page} / {pageCount}</span>
        <button onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page === pageCount}>Next</button>
        <button onClick={() => setPage(pageCount)} disabled={page === pageCount}>»</button>
      </div>
      <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
      </select>
    </div>
  );
}

// NEW: map range key -> [from, to]
function rangeToDates(key) {
  const now = new Date();
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const endOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

  switch (key) {
    case "today": {
      const s = startOfDay(now);
      const e = endOfDay(now);
      return [s, e];
    }
    case "7d": {
      const s = new Date(now);
      s.setDate(s.getDate() - 6);
      return [startOfDay(s), endOfDay(now)];
    }
    case "30d": {
      const s = new Date(now);
      s.setDate(s.getDate() - 29);
      return [startOfDay(s), endOfDay(now)];
    }
    case "thisMonth": {
      const s = new Date(now.getFullYear(), now.getMonth(), 1);
      const e = endOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0));
      return [s, e];
    }
    case "thisYear": {
      const s = new Date(now.getFullYear(), 0, 1);
      const e = endOfDay(new Date(now.getFullYear(), 11, 31));
      return [s, e];
    }
    default:
      return [null, null]; // "any"
  }
}
