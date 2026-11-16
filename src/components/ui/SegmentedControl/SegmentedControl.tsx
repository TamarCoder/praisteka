import type { CSSProperties } from "react";
import styles from "./SegmentedControl.module.scss";
import { SegmentedSize, type SegmentedControlProps } from "./SegmentedControl.types";

export function SegmentedControl<T extends string>({
  items,
  value,
  onChange,
  size = SegmentedSize.Md,
  disabled = false,
  label,
  className,
}: SegmentedControlProps<T>) {
  const cls = [styles.control, styles[size], disabled && styles.disabled, className].filter(Boolean).join(" ");
  const style = { "--segment-count": items.length } as CSSProperties;

  return (
    <div role="radiogroup" aria-label={label} className={cls} style={style}>
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={item.ariaLabel}
            disabled={disabled}
            className={[styles.item, active && styles.active].filter(Boolean).join(" ")}
            onClick={() => onChange(item.value)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
