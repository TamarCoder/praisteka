import styles from "./Input.module.scss";
import { InputVariant, type InputProps } from "./Input.types";

export function Input({ variant = InputVariant.Default, invalid = false, className, ...rest }: InputProps) {
  const isSearch = variant === InputVariant.Search;
  const cls = [styles.input, styles[variant], invalid && styles.invalid, !isSearch && className].filter(Boolean).join(" ");
  const input = <input className={cls} aria-invalid={invalid || undefined} {...rest} />;

  if (!isSearch) return input;

  // ძებნა — ლუპის ხატულა ველის შიგნით, მარცხნივ
  return (
    <span className={[styles.wrap, className].filter(Boolean).join(" ")}>
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </svg>
      {input}
    </span>
  );
}
