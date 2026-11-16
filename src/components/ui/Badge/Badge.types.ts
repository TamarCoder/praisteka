import type { ReactNode } from "react";

export enum BadgeVariant {
  Accent = "accent",
}

export interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}
