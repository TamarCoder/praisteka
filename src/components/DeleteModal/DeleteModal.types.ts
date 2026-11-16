import type { Dictionary } from "@/i18n/dictionaries/ka";

export interface DeleteModalProps {
  /** წასაშლელი ფაილის სახელი; null — დახურულია */
  name: string | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  t: Dictionary["dashboard"];
}
