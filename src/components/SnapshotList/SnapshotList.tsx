import { Badge } from "@/components/ui/Badge/Badge";
import styles from "./SnapshotList.module.scss";
import type { SnapshotListProps } from "./SnapshotList.types";

export function SnapshotList({ label, items, activeId, onSelect, latestLabel, empty }: SnapshotListProps) {
  if (!items.length) return <>{empty}</>;

  return (
    <ul className={styles.list} aria-label={label}>
      {items.map((s) => {
        const active = s.id === activeId;
        return (
          <li key={s.id}>
            <button
              type="button"
              className={[styles.item, active && styles.active].filter(Boolean).join(" ")}
              aria-current={active || undefined}
              onClick={() => onSelect(s.id)}
            >
              <span className={styles.row}>
                <span className={styles.title}>{s.title}</span>
                {s.latest && <Badge>{latestLabel}</Badge>}
              </span>
              <span className={styles.meta}>{s.meta}</span>
              {s.note && <span className={styles.note}>{s.note}</span>}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
