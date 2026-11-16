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
    // უჯრაში ის უნდა იყოს, რაც Excel-ში ჩანს: 60% (არა 0.6), თარიღი (არა 45901), 1,200 ₾ …
    // უბრალო რიცხვი (230) რიცხვად რჩება — დალაგება და რედაქტირება არ იცვლება
    for (const [address, cell] of Object.entries(sheet)) {
      if (address.startsWith("!") || !cell || (cell.t !== "n" && cell.t !== "d")) continue;
      // „General“ ფორმატი: გრძელ რიცხვს SheetJS 1.2E+11-ად წერს — ასეთი რიცხვი უცვლელად რჩება
      if (cell.t === "n" && (!cell.z || cell.z === "General")) continue;
      const shown = typeof cell.w === "string" ? cell.w.trim() : "";
      if (shown && shown !== String(cell.v)) {
        cell.v = shown;
        cell.t = "s";
      }
    }
    const raw = utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "", blankrows: false }).map((row) => row.map(toCell));
    const widths = Array.from({ length: maxLength(raw) }, (_, i) => toPx(cols[i]) ?? 0);
    return trimSheet({ name, rows: raw, widths });
  });
}

