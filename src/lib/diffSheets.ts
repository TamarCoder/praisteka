import { columnLetter } from "@/components/ui/SheetGrid/columnLetter";
import type { CellValue, SheetData } from "./readWorkbook";

interface CellChange {
  sheet: string;
  /** მაგ. "B14" */
  address: string;
  before: CellValue;
  after: CellValue;
}

export interface SheetsDiff {
  cells: CellChange[];
  /** რამდენ სვეტს შეეცვალა სიგანე */
  widths: number;
  added: string[];
  removed: string[];
}

// უჯრა-უჯრა, მისამართით: სტრიქონის ჩამატება ჯერ არ არსებობს, ამიტომ ზუსტია
export function diffSheets(prev: SheetData[], next: SheetData[]): SheetsDiff {
  const result: SheetsDiff = { cells: [], widths: 0, added: [], removed: [] };
  const byName = new Map(prev.map((s) => [s.name, s]));

  for (const sheet of next) {
    const old = byName.get(sheet.name);
    if (!old) {
      result.added.push(sheet.name);
      continue;
    }
    byName.delete(sheet.name);
    const rowCount = Math.max(old.rows.length, sheet.rows.length);
    for (let r = 0; r < rowCount; r++) {
      const a = old.rows[r] ?? [];
      const b = sheet.rows[r] ?? [];
      for (let c = 0; c < Math.max(a.length, b.length); c++) {
        const before = a[c] ?? "";
        const after = b[c] ?? "";
        if (before !== after) result.cells.push({ sheet: sheet.name, address: `${columnLetter(c)}${r + 1}`, before, after });
      }
    }
    const colCount = Math.max(old.widths?.length ?? 0, sheet.widths?.length ?? 0);
    for (let c = 0; c < colCount; c++) {
      if ((old.widths?.[c] ?? 0) !== (sheet.widths?.[c] ?? 0)) result.widths++;
    }
  }
  result.removed = [...byName.keys()];
  return result;
}
