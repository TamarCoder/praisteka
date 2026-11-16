import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { StateIcon } from "@/components/StateIcons/StateIcons";
import { fill } from "@/i18n/fill";
import styles from "./ChangeReport.module.scss";
import type { ChangeReportProps } from "./ChangeReport.types";

/** დიდ ფაილში ცხრილი არ გაიჭედოს */
const MAX_ROWS = 300;

export function ChangeReport({ diff, t }: ChangeReportProps) {
  if (!diff) return <EmptyState icon={StateIcon.first} title={t.first.title} text={t.first.text} className={styles.state} />;

  const empty = !diff.cells.length && !diff.widths && !diff.added.length && !diff.removed.length;
  if (empty) return <EmptyState icon={StateIcon.same} title={t.noChanges.title} text={t.noChanges.text} className={styles.state} />;

  const shown = diff.cells.slice(0, MAX_ROWS);
  return (
    <div className={styles.report}>
      <p className={styles.summary}>{fill(t.summary, { cells: diff.cells.length, widths: diff.widths })}</p>
      {diff.added.map((name) => (
        <p key={`a-${name}`} className={styles.line}>{fill(t.added, { name })}</p>
      ))}
      {diff.removed.map((name) => (
        <p key={`r-${name}`} className={styles.line}>{fill(t.removed, { name })}</p>
      ))}
      {shown.length > 0 && (
        <div className={styles.scroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t.sheet}</th>
                <th>{t.cell}</th>
                <th>{t.before}</th>
                <th>{t.after}</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((c) => (
                <tr key={`${c.sheet}-${c.address}`}>
                  <td>{c.sheet}</td>
                  <td className={styles.mono}>{c.address}</td>
                  <td className={styles.before}>{String(c.before)}</td>
                  <td className={styles.after}>{String(c.after)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {diff.cells.length > MAX_ROWS && <p className={styles.muted}>{fill(t.more, { n: diff.cells.length - MAX_ROWS })}</p>}
    </div>
  );
}
