import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { StateIcon } from "../StateIcons/StateIcons";
import styles from "./FileTree.module.scss";
import type { FileTreeProps, TreeFile } from "./FileTree.types";

// ფოლდერები (გაშლადი) და ფოლდერის გარეშე ფაილები
export function FileTree({ label, folders, files, activeId, onSelect, onDelete, deleteLabel, onMove, moveLabel, emptyText, emptyHint }: FileTreeProps) {
  const item = (f: TreeFile) => {
    const active = f.id === activeId;
    return (
      <li key={f.id} className={styles.item}>
        <button
          type="button"
          className={[styles.file, active && styles.active].filter(Boolean).join(" ")}
          aria-current={active || undefined}
          onClick={() => onSelect(f.id)}
        >
          <span className={styles.name}>{f.name}</span>
          <span className={styles.meta}>{f.meta}</span>
        </button>
        {onMove && (
          <button type="button" className={`${styles.delete} ${styles.move}`} aria-label={`${moveLabel}: ${f.name}`} title={moveLabel} onClick={() => onMove(f.id)}>
            📁
          </button>
        )}
        {onDelete && (
          <button type="button" className={styles.delete} aria-label={`${deleteLabel}: ${f.name}`} title={deleteLabel} onClick={() => onDelete(f.id)}>
            🗑
          </button>
        )}
      </li>
    );
  };

  if (!folders.length && !files.length) return <EmptyState icon={StateIcon.folder} title={emptyText} text={emptyHint} className={styles.empty} />;

  return (
    <nav className={styles.tree} aria-label={label}>
      {folders.map((folder) => (
        <details key={folder.id} className={styles.folder} open>
          <summary className={styles.summary}>
            <span className={styles.name}>{folder.name}</span>
            <span className={styles.count}>{folder.files.length}</span>
          </summary>
          <ul className={styles.nested}>{folder.files.map(item)}</ul>
        </details>
      ))}
      {files.length > 0 && <ul className={styles.list}>{files.map(item)}</ul>}
    </nav>
  );
}
