import type { SelectOption } from "../Select/Select.types";

export interface DropdownProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  /** ეკრანის წამკითხველისთვის */
  label: string;
  className?: string;
}
