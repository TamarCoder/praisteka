import type { CellValue } from "./readWorkbook";

interface SearchHit {
  /** "fileId:sheetIndex:n" — მონიშვნისთვის */
  key: string;
  /** Excel-ის სტრიქონი (1-დან) */
  n: number;
  cells: CellValue[];
  /** უჯრა, რომელშიც ტექსტი მოიძებნა — მოკლე ჩვენებისთვის */
  match: string;
}

/** სერვერის პასუხი: GET /api/files/search */
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
