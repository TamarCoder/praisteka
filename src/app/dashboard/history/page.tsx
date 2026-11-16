"use client";

import { useState } from "react";
import { ChangeReport } from "@/components/ChangeReport/ChangeReport";
import { StateIcon } from "@/components/StateIcons/StateIcons";
import { SnapshotList } from "@/components/SnapshotList/SnapshotList";
import { Button } from "@/components/ui/Button/Button";
import { ButtonVariant } from "@/components/ui/Button/Button.types";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { EmptyStateVariant } from "@/components/ui/EmptyState/EmptyState.types";
import { DateRangePicker } from "@/components/ui/DateRangePicker/DateRangePicker";
import { Dropdown } from "@/components/ui/Dropdown/Dropdown";
import { SheetGrid } from "@/components/ui/SheetGrid/SheetGrid";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { Toast } from "@/components/ui/Toast/Toast";
import { useFilesHydration } from "@/hooks/useFilesHydration";
import { useSheetView } from "@/hooks/useSheetView";
import { useSnapshotDiff } from "@/hooks/useSnapshotDiff";
import { dictionaries } from "@/i18n/dictionaries";
import { fill } from "@/i18n/fill";
import { saveSheets, saveSnapshot } from "@/lib/demoFiles";
import { formatDateTime, localDay } from "@/lib/formatDate";
import { useFilesStore } from "@/stores/files.store";
import { usePreferencesStore } from "@/stores/preferences.store";
import styles from "./page.module.scss";

export default function HistoryPage() {
  const { locale } = usePreferencesStore();
  const { history: t, dashboard: d } = dictionaries[locale];
  const ready = useFilesHydration();
  const { versions, snapshots, addSnapshot } = useFilesStore();

  const [fileId, setFileId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [activeId, setActiveId] = useState<string>();
  const [sheetIndex, setSheetIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const fileName = (id: string) => versions.find((v) => v.id === id)?.fileName ?? "";
  const latestN = (id: string) => Math.max(0, ...snapshots.filter((s) => s.fileId === id).map((s) => s.n));

  const all = snapshots.filter((s) => versions.some((v) => v.id === s.fileId));
  const list = all
    .filter((s) => !fileId || s.fileId === fileId)
    .filter((s) => (!from || localDay(s.savedAt) >= from) && (!to || localDay(s.savedAt) <= to))
    .sort((a, b) => b.savedAt - a.savedAt);

  const active = list.find((s) => s.id === activeId);
  // წინა ვერსია იმავე ფაილის, ფილტრის მიუხედავად
  const previous = active
    ? snapshots.filter((s) => s.fileId === active.fileId && s.n < active.n).sort((a, b) => b.n - a.n)[0]
    : undefined;
  const loaded = useSnapshotDiff(active?.id, previous?.id);
  const sheet = loaded?.sheets[sheetIndex] ?? loaded?.sheets[0];
  const view = useSheetView(sheet, locale, `${active?.id}:${sheetIndex}`);

  const clearFilter = () => {
    setFileId("");
    setFrom("");
    setTo("");
  };

  const noVersions = (
    <EmptyState
      icon={StateIcon.history}
      title={t.empty.title}
      text={t.empty.text}
      className={styles.state}
      action={<Button href="/dashboard">{t.empty.action}</Button>}
    />
  );

  const emptyList = (
    <EmptyState
      icon={StateIcon.filter}
      title={t.noMatch.title}
      text={t.noMatch.text}
      className={styles.state}
      action={
        <Button variant={ButtonVariant.Secondary} onClick={clearFilter}>
          {t.noMatch.action}
        </Button>
      }
    />
  );

  const select = (id: string) => {
    setActiveId(id);
    setSheetIndex(0);
  };

  const restore = async () => {
    if (!active || !loaded) return;
    try {
      await saveSheets(active.fileId, loaded.sheets);
      const snapshot = addSnapshot(active.fileId, fill(t.restoreNote, { n: active.n }));
      await saveSnapshot(snapshot.id, loaded.sheets);
      setToast(fill(t.restored, { n: active.n }));
    } catch {
      setToast(d.errors.save);
    }
  };

  // სანამ შენახული მონაცემები არ წაიკითხება — ცარიელი ბარათის ჩარჩო (ციმციმის გარეშე)
  if (!ready) return <main className={styles.card} aria-hidden />;

  return (
    <main className={styles.card}>
      <header className={styles.header}>
        <div className={styles.start}>
          <div className={styles.filters}>
            <Button variant={ButtonVariant.Secondary} href="/dashboard" aria-label={t.back} title={t.back} className={styles.back}>
              ←
            </Button>
            <Dropdown
              label={t.file}
              value={fileId}
              onChange={setFileId}
              options={[{ value: "", label: t.allFiles }, ...versions.map((v) => ({ value: v.id, label: v.fileName }))]}
            />
            <DateRangePicker
              label={t.period}
              labels={t.calendar}
              value={{ from, to }}
              onChange={(r) => {
                setFrom(r.from);
                setTo(r.to);
              }}
            />
          </div>
        </div>
      </header>

      {!all.length ? (
        noVersions
      ) : (
      <div className={styles.body}>
        <aside className={styles.list}>
          <SnapshotList
            label={t.title}
            activeId={active?.id}
            onSelect={select}
            latestLabel={t.latest}
            empty={emptyList}
            items={list.map((s) => ({
              id: s.id,
              title: `${fileName(s.fileId)} · ${fill(t.version, { n: s.n })}`,
              meta: formatDateTime(s.savedAt),
              note: s.note,
              latest: s.n === latestN(s.fileId),
            }))}
          />
        </aside>

        <section className={styles.detail}>
          {!active ? (
            <EmptyState icon={StateIcon.pick} title={t.pick.title} text={t.pick.text} className={styles.state} />
          ) : !loaded ? (
            <Skeleton className={styles.loading} />
          ) : loaded.error ? (
            <EmptyState variant={EmptyStateVariant.Error} icon={StateIcon.error} title={t.loadError.title} text={t.loadError.text} className={styles.state} />
          ) : (
            <>
              <div className={styles.detailHead}>
                <div>
                  <h2 className={styles.subtitle}>{`${fileName(active.fileId)} · ${fill(t.version, { n: active.n })}`}</h2>
                  <p className={styles.muted}>{[formatDateTime(active.savedAt), active.note].filter(Boolean).join(" · ")}</p>
                </div>
                {active.n !== latestN(active.fileId) && (
                  <Button variant={ButtonVariant.Secondary} onClick={restore}>
                    {t.restore}
                  </Button>
                )}
              </div>
              <ChangeReport diff={loaded.diff} t={t} />
              <div className={styles.previewHead}>
                <h3 className={styles.label}>{t.preview}</h3>
                {loaded.sheets.length > 1 && (
                  <Dropdown
                    label={t.sheet}
                    value={String(sheetIndex)}
                    onChange={(v) => setSheetIndex(Number(v))}
                    options={loaded.sheets.map((s, i) => ({ value: String(i), label: s.name }))}
                  />
                )}
              </div>
              <div className={styles.preview}>
                <SheetGrid
                  columns={view.columns}
                  widths={view.widths}
                  rows={view.rows}
                  selected={view.selected}
                  onSelect={view.setSelected}
                  sort={view.sort}
                  onSort={view.toggleSort}
                  empty={d.emptySheet}
                  label={sheet?.name ?? t.preview}
                />
              </div>
            </>
          )}
        </section>
      </div>
      )}
      <Toast message={toast} onClose={() => setToast(null)} className={styles.toast} />
    </main>
  );
}
