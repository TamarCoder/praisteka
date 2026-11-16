import type { ReactNode } from "react";

export enum BannerVariant {
  /** 1px err · r8 — ფორმის შეცდომა */
  Error = "error",
}

export interface BannerProps {
  variant?: BannerVariant;
  children: ReactNode;
  /** თუ არის, ჩანს ✕ */
  onClose?: () => void;
  className?: string;
}
