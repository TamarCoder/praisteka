import type { HTMLAttributes, ReactNode } from "react";

export enum PanelVariant {
  /** bg paper · 1px line · r10 */
  Paper = "paper",
  /** მინა · r18 · blur 10 · ჩრდილი — ლენდინგი */
  Glass = "glass",
  /** მინა, უფრო მკვრივი — ზედა ფირფიტა */
  GlassStrong = "glassStrong",
}

export enum PanelPadding {
  None = "none",
  /** 18px */
  Md = "md",
  /** 24px */
  Lg = "lg",
}

export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: PanelVariant;
  padding?: PanelPadding;
  children: ReactNode;
}
