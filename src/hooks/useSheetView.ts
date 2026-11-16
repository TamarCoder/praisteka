"use client";

import { useMemo, useState } from "react";
import { SortDir, type CellPosition, type SheetGridRow, type SheetSort } from "@/components/ui/SheetGrid/SheetGrid.types";
import type { SheetData } from "@/lib/readWorkbook";

/** ძებნა, სორტირება და მონიშვნა ერთი ფურცლისთვის */
/** resetKey — იცვლება ფაილის/ფურცლის შეცვლისას; რედაქტირება ძებნას და მონიშვნას არ აქრობს */
/** seedQuery — ძებნა, რომლითაც ახალი ფაილი/ფურცელი იხსნება (ყველა ფაილში ძებნიდან) */
export function useSheetView(sheet: SheetData | undefined, locale: string, resetKey: string, seedQuery = "") {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SheetSort | null>(null);
  const [selected, setSelected] = useState<CellPosition | null>(null);

  // ფურცლის შეცვლისას ყველაფერი თავიდან (1 App:262)
  const [current, setCurrent] = useState(resetKey);
  if (current !== resetKey) {
    setCurrent(resetKey);
    setQuery(seedQuery);
    setSort(null);
    setSelected(null);
  }

  const { columns, allRows } = useMemo(() => {
    const [head = [], ...body] = sheet?.rows ?? [];
    const width = Math.max(head.length, ...body.map((r) => r.length), 0);
    return {
      columns: Array.from({ length: width }, (_, i) => String(head[i] ?? "")),
      allRows: body.map((cells, i): SheetGridRow => ({ n: i + 2, cells })),
    };
  }, [sheet]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = q
      ? allRows.filter((r) => r.cells.some((v) => String(v ?? "").toLowerCase().includes(q)))
      : allRows;
    if (sort) {
      const k = sort.dir === SortDir.Asc ? 1 : -1;
      result = [...result].sort((a, b) => {
        const x = a.cells[sort.col] ?? "";
        const y = b.cells[sort.col] ?? "";
        return (typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y), locale)) * k;
      });
    }
    return result;
  }, [allRows, query, sort, locale]);

  const toggleSort = (col: number) =>
    setSort((s) => ({ col, dir: s?.col === col && s.dir === SortDir.Asc ? SortDir.Desc : SortDir.Asc }));

  const changeQuery = (value: string) => {
    setQuery(value);
    setSelected(null);
  };

  return {
    columns,
    widths: sheet?.widths,
    rows,
    total: allRows.length,
    query,
    setQuery: changeQuery,
    sort,
    toggleSort,
    selected,
    setSelected,
  };
}
