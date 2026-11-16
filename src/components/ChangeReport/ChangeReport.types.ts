import type { Dictionary } from "@/i18n/dictionaries/ka";
import type { SheetsDiff } from "@/lib/diffSheets";

export interface ChangeReportProps {
  /** null — პირველი ვერსია, შესადარებელი არაფერია */
  diff: SheetsDiff | null;
  t: Dictionary["history"];
}
