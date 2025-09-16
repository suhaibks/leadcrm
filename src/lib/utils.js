export function formatDateTime(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return "-";
    }
  }
  
  export function sortByKey(a, b, key, dir = "asc") {
    const va = normalizeForSort(a[key]);
    const vb = normalizeForSort(b[key]);
    if (va < vb) return dir === "asc" ? -1 : 1;
    if (va > vb) return dir === "asc" ? 1 : -1;
    return 0;
  }
  
  function normalizeForSort(v) {
    if (v == null) return "";
    // date-like string
    if (typeof v === "string" && /\d{4}-\d{2}-\d{2}T/.test(v)) return new Date(v).getTime();
    if (typeof v === "string") return v.toLowerCase();
    return v;
  }
  
  export function textIncludes(value, q) {
    if (!value) return false;
    return value.toString().toLowerCase().includes(q.toLowerCase());
  }
  