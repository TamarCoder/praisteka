import type { SelectOption } from "@/components/ui/Select/Select.types";
import type { Dictionary } from "@/i18n/dictionaries/ka";

export interface MoveModalProps {
  /** გადასატანი ფაილის სახელი; null — დახურულია */
  name: string | null;
  /** ახლანდელი ფოლდერი ("" — ფოლდერის გარეშე) */
  current: string;
  /** პირველი ვარიანტი — „ფოლდერის გარეშე“ (value "") */
  folders: SelectOption[];
  onClose: () => void;
  onConfirm: (folderId: string) => Promise<void>;
  t: Dictionary["dashboard"];
}
