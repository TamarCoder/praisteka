import styles from "./Tabs.module.scss";
import { TabsVariant, type TabsProps } from "./Tabs.types";

export function Tabs<T extends string>({ items, value, onChange, variant = TabsVariant.Sheet, label, className }: TabsProps<T>) {
  const cls = [styles.tabs, styles[variant], className].filter(Boolean).join(" ");

  return (
    <div role="tablist" aria-label={label} className={cls}>
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            className={[styles.tab, active && styles.active].filter(Boolean).join(" ")}
            onClick={() => onChange(item.value)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
