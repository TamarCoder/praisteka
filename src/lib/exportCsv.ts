import type { CellValue } from "./readWorkbook";

const escape = (v: CellValue) => {
  const s = String(v);
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** CSV ჩამოტვირთვა; BOM — რომ Excel-მა ქართული სწორად გახსნას */
export function exportCsv(fileName: string, rows: CellValue[][]) {
  const csv = "﻿" + rows.map((row) => row.map(escape).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
