import styles from "./Select.module.scss";
import { SelectSize, type SelectProps } from "./Select.types";

export function Select({ options, size = SelectSize.Md, invalid = false, className, ...rest }: SelectProps) {
  const cls = [styles.select, styles[size], invalid && styles.invalid, className].filter(Boolean).join(" ");

  return (
    <select className={cls} aria-invalid={invalid || undefined} {...rest}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
