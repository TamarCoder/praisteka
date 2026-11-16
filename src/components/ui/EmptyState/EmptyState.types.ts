import type { ReactNode } from "react";

export enum EmptyStateVariant {
  /** ცარიელი: სათაური ink */
  Empty = "empty",
  /** შეცდომა: სათაური err */
  Error = "error",
}

export interface EmptyStateProps {
  variant?: EmptyStateVariant;
  /** ხატულა წრეში, სათაურის ზემოთ */
  icon?: ReactNode;
  title: ReactNode;
  /** ერთი ხაზი, mute */
  text?: ReactNode;
  /** ღილაკ(ებ)ი */
  action?: ReactNode;
  className?: string;
}
