import type { SelectOption } from "@/components/ui/Select/Select.types";
import type { DateRangePickerProps } from "@/components/ui/DateRangePicker/DateRangePicker.types";
import type { Dictionary } from "@/i18n/dictionaries/ka";

export interface UploadSubmit {
  company: string;
  effectiveFrom: string;
  /** "" — ფოლდერის გარეშე */
  folder: string;
  file: File;
}

export interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  t: Dictionary["dashboard"];
  /** კალენდრის ტექსტები (ისტორიის გვერდის იგივე კალენდარი) */
  calendar: DateRangePickerProps["labels"];
  /** არსებული კომპანიები — მინიშნებისთვის */
  companyNames: string[];
  defaultCompany?: string;
  /** პირველი ვარიანტი — „ფოლდერის გარეშე“ (value "") */
  folders: SelectOption[];
  defaultFolder?: string;
  /** აბრუნებს შეცდომის ტექსტს, ან undefined წარმატებისას */
  onSubmit: (values: UploadSubmit) => Promise<string | undefined>;
}
