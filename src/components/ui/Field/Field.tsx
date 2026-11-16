import styles from "./Field.module.scss";
import type { FieldProps } from "./Field.types";

export function Field({ label, error, children, className }: FieldProps) {
  const cls = [styles.field, className].filter(Boolean).join(" ");

  return (
    <label className={cls}>
      <span className={styles.label}>{label}</span>
      {children}
      {error && (
        <span role="alert" className={styles.error}>
          {error}
        </span>
      )}
    </label>
  );
}
