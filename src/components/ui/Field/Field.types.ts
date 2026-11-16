import type { ReactNode } from "react";

export interface FieldProps {
  /** ველის ზემოთ, 12px mute */
  label: ReactNode;
  /** შეცდომა ველის ქვეშ, 12/600 err */
  error?: string;
  /** Input, Select ან სხვა ველი */
  children: ReactNode;
  className?: string;
}
