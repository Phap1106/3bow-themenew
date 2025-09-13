"use client";
import * as React from "react";

export default function Pagination({
  page, total, limit, loading, onPageChange,
}: {
  page: number; total: number; limit: number; loading?: boolean;
  onPageChange: (p: number) => void;
}) {
  const pages = Math.max(1, Math.ceil((total || 0) / (limit || 1)));
  const curr = Math.min(Math.max(1, page || 1), pages);

  const pageList = React.useMemo(() => {
    const out: (number | string)[] = [];
    const add = (a: number, b: number) => { for (let i = a; i <= b; i++) out.push(i); };
    if (pages <= 7) add(1, pages);
    else if (curr <= 4) { add(1, 5); out.push("…", pages); }
    else if (curr >= pages - 3) { out.push(1, "…"); add(pages - 4, pages); }
    else { out.push(1, "…", curr - 1, curr, curr + 1, "…", pages); }
    return out;
  }, [curr, pages]);

  return (
    <div className="flex items-center justify-center gap-1">
      <button className="px-3 border rounded h-9 disabled:opacity-50"
              disabled={curr <= 1 || loading}
              onClick={() => onPageChange(curr - 1)}>← Trước</button>

      {pageList.map((p, i) =>
        typeof p === "number" ? (
          <button key={i}
                  className={`h-9 px-3 border rounded ${p === curr ? "bg-black text-white" : "hover:bg-zinc-50"}`}
                  disabled={loading}
                  onClick={() => onPageChange(p)}>{p}</button>
        ) : (
          <span key={i} className="px-2 text-zinc-500">…</span>
        )
      )}

      <button className="px-3 border rounded h-9 disabled:opacity-50"
              disabled={curr >= pages || loading}
              onClick={() => onPageChange(curr + 1)}>Sau →</button>
    </div>
  );
}


