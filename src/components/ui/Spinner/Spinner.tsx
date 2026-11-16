import type { CSSProperties } from "react";
import styles from "./Spinner.module.scss";
import { SpinnerTone, type SpinnerProps } from "./Spinner.types";

export function Spinner({ tone = SpinnerTone.Mute, size = 14, label = "იტვირთება", className }: SpinnerProps) {
  const style = { "--spinner-size": `${size}px` } as CSSProperties;
  const cls = [styles.spinner, styles[tone], className].filter(Boolean).join(" ");

  return <span role="status" aria-label={label} className={cls} style={style} />;
}
