import type { Dictionary } from "@/i18n/dictionaries/ka";

export interface FolderModalProps {
  open: boolean;
  onClose: () => void;
  t: Dictionary["dashboard"];
  /** აბრუნებს შეცდომის ტექსტს, ან undefined წარმატებისას */
  onSubmit: (name: string) => Promise<string | undefined>;
}
