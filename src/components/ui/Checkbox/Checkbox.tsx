import type { InputHTMLAttributes } from "react";
import styles from "./Checkbox.module.scss";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { label: string };

export function Checkbox({ label, className, ...rest }: CheckboxProps) {
  return (
    <label className={[styles.wrap, className].filter(Boolean).join(" ")}>
      <input type="checkbox" className={styles.box} {...rest} />
      <span>{label}</span>
    </label>
  );
}
