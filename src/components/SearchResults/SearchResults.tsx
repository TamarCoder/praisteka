import { fill } from "@/i18n/fill";
import styles from "./SearchResults.module.scss";
import type { SearchResultsProps } from "./SearchResults.types";

// ყველა ფაილში ძებნის შედეგები — ფაილისა და ფურცლის მიხედვით
export function SearchResults({ groups, picked, onTogglePick, onOpen, t }: SearchResultsProps) {
  return (
    <div className={styles.results}>
      {groups.map((g) => (
        <section key={`${g.fileId}:${g.sheetIndex}`} className={styles.group}>
          <header className={styles.head}>
            <button type="button" className={styles.file} onClick={() => onOpen(g)} title={t.open}>
              {g.fileName}
            </button>
            <span className={styles.sheet}>{g.sheetName}</span>
            <span className={styles.count}>{fill(t.rows, { n: g.total })}</span>
          </header>
          <ul className={styles.list}>
            {g.hits.map((hit) => (
              <li key={hit.key} className={styles.row}>
                <input
                  type="checkbox"
                  className={styles.pick}
                  checked={picked.includes(hit.key)}
                  onChange={() => onTogglePick(hit.key)}
                  aria-label={`${t.pick}: ${g.fileName} ${hit.n}`}
                />
                <button type="button" className={styles.cells} onClick={() => onOpen(g)}>
                  <span className={styles.n}>{hit.n}</span>
                  {hit.cells.map((v, i) =>
                    v === "" ? null : (
                      <span key={i} className={[styles.cell, typeof v === "number" && styles.number].filter(Boolean).join(" ")}>
                        {String(v)}
                      </span>
                    ),
                  )}
                </button>
              </li>
            ))}
          </ul>
          {g.total > g.hits.length && <p className={styles.more}>{fill(t.more, { n: g.hits.length, total: g.total })}</p>}
        </section>
      ))}
    </div>
  );
}
