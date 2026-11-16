import type { InputHTMLAttributes, Ref } from "react";

export enum InputVariant {
  /** h38 · 1px line · bg paper */
  Default = "default",
  /** h36 · 1.5px ink · გამჭვირვალე — ძებნა */
  Search = "search",
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  /** შეცდომის ჩარჩო (err) */
  invalid?: boolean;
  ref?: Ref<HTMLInputElement>;
}
