import type { Dictionary } from "@/i18n/dictionaries/ka";

export interface SaveVersionModalProps {
  open: boolean;
  onClose: () => void;
  t: Dictionary["dashboard"];
  onSubmit: (note: string) => Promise<void>;
}
