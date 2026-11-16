import type { ReactNode } from "react";
import type { CellValue } from "@/lib/readWorkbook";

export enum SortDir {
  Asc = "asc",
  Desc = "desc",
}

export interface SheetGridRow {
  /** Excel-ის სტრიქონის ნომერი */
  n: number;
  cells: CellValue[];
}

/** row — rows მასივის ინდექსი */
export interface CellPosition {
  row: number;
  col: number;
}

export interface SheetSort {
  col: number;
  dir: SortDir;
}

export interface SheetGridProps {
  /** სათაურის სტრიქონი (Excel-ის 1-ლი სტრიქონი) */
  columns: string[];
  /** სვეტების სიგანე px-ში; 0 ან არარსებული — DEFAULT_COL_WIDTH */
  widths?: number[];
  rows: SheetGridRow[];
  selected: CellPosition | null;
  onSelect: (cell: CellPosition) => void;
  sort?: SheetSort | null;
  onSort?: (col: number) => void;
  /** სვეტის საზღვრის გადაწევა ან ორმაგი დაწკაპუნება */
  onResize?: (col: number, width: number) => void;
  /** უჯრის რედაქტირება; row — rows მასივის ინდექსი */
  onEdit?: (row: number, col: number, value: string) => void;
  /** Ctrl/⌘+C მონიშნულ უჯრაზე */
  onCopy?: (value: CellValue) => void;
  /** როცა rows ცარიელია — ტექსტი ან კომპონენტი */
  empty: ReactNode;
  label?: string;
  /** მონიშნული სტრიქონები (row.n) — ჩეკბოქსი ნომრის გვერდით; არ არის — ჩეკბოქსი არ ჩანს */
  checked?: number[];
  onCheck?: (n: number) => void;
  /** ჩეკბოქსის წარწერა ეკრანის წამკითხველისთვის, {n} — სტრიქონის ნომერი */
  checkLabel?: string;
  className?: string;
}
