import type { Dictionary } from "@/i18n/dictionaries/ka";
import type { CellValue } from "@/lib/readWorkbook";

interface CompareItem {
  key: string;
  /** „ფაილი · ფურცელი · სტრიქონი 12“ */
  title: string;
  header: CellValue[];
  cells: CellValue[];
}

export interface CompareModalProps {
  open: boolean;
  onClose: () => void;
  items: CompareItem[];
  t: Dictionary["dashboard"];
}
