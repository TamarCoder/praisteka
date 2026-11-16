import styles from "./Panel.module.scss";
import { PanelPadding, PanelVariant, type PanelProps } from "./Panel.types";

export function Panel({ variant = PanelVariant.Paper, padding = PanelPadding.Lg, className, children, ...rest }: PanelProps) {
  const cls = [styles.panel, styles[variant], styles[`pad-${padding}`], className].filter(Boolean).join(" ");

  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  );
}
