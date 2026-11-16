// ფურცლის ტიპები და გაწმენდა — xlsx-ის და Worker-ის გარეშე (ყველგან უსაფრთხოდ იმპორტდება)
export type CellValue = string | number;

export interface SheetData {
  name: string;
  /** rows[0] — სვეტების სათაურები */
  rows: CellValue[][];
  /** სვეტების სიგანე px-ში Excel-იდან; ძველ ატვირთვებს არ აქვს */
  widths?: number[];
}

// უხილავი სიმბოლოები (zero-width, BOM, soft hyphen) და ყველა სახის სივრცე — ცარიელად ითვლება
const INVISIBLE = /[\s\p{Z}\p{Cf}\p{Cc}]/gu;
/** რიგების მაქსიმალური სიგრძე; Math.max(...rows) დიდ ფაილზე stack-ს ავსებს */
export const maxLength = (rows: CellValue[][]) => rows.reduce((m, r) => (r.length > m ? r.length : m), 0);
const isFilled = (v: CellValue | undefined) => v !== undefined && String(v).replace(INVISIBLE, "") !== "";

/** მხოლოდ შევსებული სტრიქონები და სვეტები; სიგანეები მიჰყვება დარჩენილ სვეტებს. ძველ ატვირთვებზეც (ჩატვირთვისას) */
export function trimSheet(sheet: SheetData): SheetData {
  const rows = sheet.rows.filter((row) => row.some(isFilled));
  const width = maxLength(rows);
  const keep = Array.from({ length: width }, (_, i) => i).filter((i) => rows.some((r) => isFilled(r[i])));
  const widths = sheet.widths && keep.map((i) => sheet.widths?.[i] ?? 0);
  return { ...sheet, rows: rows.map((r) => keep.map((i) => r[i] ?? "")), widths: widths?.some(Boolean) ? widths : undefined };
}

