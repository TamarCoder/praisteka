import { fill } from "@/i18n/fill";
import styles from "./SearchResults.module.scss";
import type { SearchResultsProps } from "./SearchResults.types";

// ყველა ფაილში ძებნა: შეჯამება + ფაილები, თითო სტრიქონში მხოლოდ ნაპოვნი უჯრა
export function SearchResults({
  groups,
  query,
  missing,
  picked,
  onTogglePick,
  onOpen,
  t,
}: SearchResultsProps) {
  const files = [...new Set(groups.map((g) => g.fileName))];
  return (
    <div className={styles.results}>
      <p className={styles.summary}>
        {fill(t.summary, { q: query.trim(), n: files.length })}
      </p>
      {/* ბლოკები ბადედ: სიგანის მიხედვით 1–4 სვეტი */}
      <div className={styles.cards}>
        {groups.map((g) => (
          <section
            key={`${g.fileId}:${g.sheetIndex}`}
            className={`${styles.group} ${styles.found}`}
          >
            <header className={styles.head}>
              <button
                type="button"
                className={styles.file}
                onClick={() => onOpen(g)}
                title={t.open}
              >
                {g.fileName}
              </button>
              <span className={styles.sheet}>{g.sheetName}</span>
              <span className={styles.count}>
                {fill(t.rows, { n: g.total })}
              </span>
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
                  <button
                    type="button"
                    className={styles.cells}
                    onClick={() => onOpen(g)}
                  >
                    <span className={styles.n}>{hit.n}</span>
                    <span className={styles.cell} title={hit.match}>
                      {hit.match}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {g.total > g.hits.length && (
              <p className={styles.more}>
                {fill(t.more, { n: g.hits.length, total: g.total })}
              </p>
            )}
          </section>
        ))}
        {missing.map((m) => (
          <section
            key={m.fileId}
            className={`${styles.group} ${styles.missing}`}
          >
            <header className={styles.head}>
              <span className={styles.file}>{m.fileName}</span>
              <span className={styles.count}>{t.notFound}</span>
            </header>
          </section>
        ))}
      </div>
    </div>
  );
}
