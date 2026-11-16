import type { CellValue, SheetData } from "./readWorkbook";

export interface SearchSource {
  fileId: string;
  fileName: string;
  sheets: SheetData[];
}

interface SearchHit {
  /** "fileId:sheetIndex:n" — მონიშვნისთვის */
  key: string;
  /** Excel-ის სტრიქონი (1-დან) */
  n: number;
  cells: CellValue[];
}

export interface SearchGroup {
  fileId: string;
  fileName: string;
  sheetIndex: number;
  sheetName: string;
  /** ფურცლის 1-ლი სტრიქონი */
  header: CellValue[];
  hits: SearchHit[];
  /** სულ რამდენი დაემთხვა (hits შეიძლება შეკვეცილი იყოს) */
  total: number;
}

export const MIN_QUERY = 2;
const MAX_PER_GROUP = 100;

/** ტექსტის ნაწილით, ყველა ფაილის ყველა ფურცელში; სათაურის სტრიქონი არ ითვლება */
export function searchFiles(sources: SearchSource[], query: string): SearchGroup[] {
  const q = query.trim().toLowerCase();
  if (q.length < MIN_QUERY) return [];

  const groups: SearchGroup[] = [];
  for (const src of sources) {
    src.sheets.forEach((sheet, sheetIndex) => {
      const [header = [], ...body] = sheet.rows;
      const hits: SearchHit[] = [];
      let total = 0;
      body.forEach((cells, i) => {
        if (!cells.some((v) => String(v).toLowerCase().includes(q))) return;
        total++;
        if (hits.length < MAX_PER_GROUP) hits.push({ key: `${src.fileId}:${sheetIndex}:${i + 2}`, n: i + 2, cells });
      });
      if (total) groups.push({ fileId: src.fileId, fileName: src.fileName, sheetIndex, sheetName: sheet.name, header, hits, total });
    });
  }
  return groups;
}
