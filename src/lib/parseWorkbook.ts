import { maxLength, trimSheet, type CellValue, type SheetData } from "./sheetData";

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

/** Excel → ფურცლები. მძიმეა: იძახება Web Worker-იდან (readWorkbook.worker.ts), რომ გვერდი არ გაიყინოს */
export async function parseWorkbook(data: ArrayBuffer): Promise<SheetData[]> {
  const { read, utils } = await import("xlsx");
  // cellStyles — ამის გარეშე !cols (სიგანეები) არ იკითხება
  const book = read(data, { cellStyles: true });
  return book.SheetNames.map((name) => {
    const sheet = book.Sheets[name];
    const cols = (sheet["!cols"] ?? []) as (ColInfo | undefined)[];
    const raw = utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "", blankrows: false }).map((row) => row.map(toCell));
    const widths = Array.from({ length: maxLength(raw) }, (_, i) => toPx(cols[i]) ?? 0);
    return trimSheet({ name, rows: raw, widths });
  });
}

