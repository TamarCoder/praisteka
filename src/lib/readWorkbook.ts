import { read, utils } from "xlsx";

export type CellValue = string | number;

export interface SheetData {
  name: string;
  /** rows[0] — სვეტების სათაურები */
  rows: CellValue[][];
  /** სვეტების სიგანე px-ში Excel-იდან; ძველ ატვირთვებს არ აქვს */
  widths?: number[];
}

interface ColInfo {
  wpx?: number;
  wch?: number;
  width?: number;
}

// Excel-ის სიგანე → px (wch/width სიმბოლოებშია, ~7px თითო)
const toPx = (c?: ColInfo) => {
  const px = c?.wpx ?? (c?.wch ?? c?.width ? (c.wch ?? c.width)! * 7 + 5 : undefined);
  return px ? Math.max(Math.round(px), 48) : undefined;
};

const toCell = (v: unknown): CellValue => (typeof v === "number" ? v : String(v ?? ""));

export async function readWorkbook(file: File): Promise<SheetData[]> {
  // cellStyles — ამის გარეშე !cols (სიგანეები) არ იკითხება
  const book = read(await file.arrayBuffer(), { cellStyles: true });
  return book.SheetNames.map((name) => {
    const sheet = book.Sheets[name];
    const cols = (sheet["!cols"] ?? []) as (ColInfo | undefined)[];
    const rows = utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "" }).map((row) => row.map(toCell));
    const width = Math.max(0, ...rows.map((r) => r.length));
    const widths = Array.from({ length: width }, (_, i) => toPx(cols[i]) ?? 0);
    return { name, rows, widths: widths.some(Boolean) ? widths : undefined };
  });
}
