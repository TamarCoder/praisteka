import styles from "./Badge.module.scss";
import { BadgeVariant, type BadgeProps } from "./Badge.types";

export function Badge({ variant = BadgeVariant.Accent, children, className }: BadgeProps) {
  const cls = [styles.badge, styles[variant], className].filter(Boolean).join(" ");

  return <span className={cls}>{children}</span>;
}
