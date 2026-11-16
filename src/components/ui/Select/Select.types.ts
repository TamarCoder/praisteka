import type { Ref, SelectHTMLAttributes } from "react";

export enum SelectSize {
  /** h38 */
  Md = "md",
  /** h28 · 12px — ფილტრი */
  Sm = "sm",
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size" | "children"> {
  options: SelectOption[];
  size?: SelectSize;
  invalid?: boolean;
  ref?: Ref<HTMLSelectElement>;
}
