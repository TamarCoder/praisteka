import type { Dictionary } from "@/i18n/dictionaries/ka";

export interface AddRowModalProps {
  open: boolean;
  /** Excel-ის 1-ლი სტრიქონი — თითო სვეტზე ერთი ველი */
  columns: string[];
  onClose: () => void;
  t: Dictionary["dashboard"];
  /** ველების მნიშვნელობები სვეტების რიგით */
  onSubmit: (values: string[]) => Promise<void>;
}
