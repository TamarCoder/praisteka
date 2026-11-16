"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AppEmpty } from "@/components/AppEmpty/AppEmpty";
import { UserMenu } from "@/components/UserMenu/UserMenu";
import { DeleteModal } from "@/components/DeleteModal/DeleteModal";
import { FileHeader } from "@/components/FileHeader/FileHeader";
import { SheetFooter } from "@/components/SheetFooter/SheetFooter";
import { CompareModal } from "@/components/CompareModal/CompareModal";
import { SearchResults } from "@/components/SearchResults/SearchResults";
import { SaveVersionModal } from "@/components/SaveVersionModal/SaveVersionModal";
import { FolderModal } from "@/components/FolderModal/FolderModal";
import { UploadModal } from "@/components/UploadModal/UploadModal";
import type { UploadSubmit } from "@/components/UploadModal/UploadModal.types";
import { SheetGrid } from "@/components/ui/SheetGrid/SheetGrid";
import { Button } from "@/components/ui/Button/Button";
import { ButtonSize, ButtonVariant } from "@/components/ui/Button/Button.types";
import { Checkbox } from "@/components/ui/Checkbox/Checkbox";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { StateIcon } from "@/components/StateIcons/StateIcons";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { Toast } from "@/components/ui/Toast/Toast";
import { reportError } from "@/api/errors";
import { useFileSearch } from "@/hooks/api/useFileSearch";
import { useCompanies } from "@/hooks/api/useCompanies";
import { useFileMutations } from "@/hooks/api/useFileMutations";
import { useFiles } from "@/hooks/api/useFiles";
import { useFileSheets } from "@/hooks/api/useFileSheets";
import { useFolderMutations } from "@/hooks/api/useFolderMutations";
import { useFolders } from "@/hooks/api/useFolders";
import { useSnapshotMutations } from "@/hooks/api/useSnapshotMutations";
import { useSheetView } from "@/hooks/useSheetView";
import { dictionaries } from "@/i18n/dictionaries";
import { fill } from "@/i18n/fill";
import { exportCsv } from "@/lib/exportCsv";
import { MIN_QUERY, type SearchGroup } from "@/lib/searchFiles";
import { formatDate } from "@/lib/formatDate";
import { readWorkbook } from "@/lib/readWorkbook";
import { ErrorAction } from "@/types/api";
import { usePreferencesStore } from "@/stores/preferences.store";
import styles from "./page.module.scss";

export default function DashboardPage() {
  const { locale } = usePreferencesStore();
  const { dashboard: t } = dictionaries[locale];
  const router = useRouter();
  // ღია ფაილი ბმულშია (?file=) — ზოლიდან არჩევა, გაზიარება, refresh
  const fileParam = useSearchParams().get("file");

  const { data: versions } = useFiles();
  const { data: folders } = useFolders();
  const { data: companies } = useCompanies();
  const ready = !!versions && !!folders && !!companies;
  const { uploadFile } = useFileMutations();
  const { createFolder: addFolder } = useFolderMutations();
  const { saveSnapshot } = useSnapshotMutations();
  /** ფურცელი იმ ფაილისთვის, რომელიც ბოლოს გაიხსნა; სხვა ფაილზე — 0 */
  const [sheetPick, setSheetPick] = useState({ file: "", index: 0 });
  const [uploadOpen, setUploadOpen] = useState(false);
  const [folderOpen, setFolderOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // ატვირთვის რიგით (API: createdAt ASC) — პირველი ზემოთ
  const sorted = versions ?? [];
  // ?file= არ არის — მთავარი: ფაილები ბოქსებად, არცერთი არ არის გახსნილი
  const version = sorted.find((v) => v.id === fileParam);
  const company = companies?.find((c) => c.id === version?.companyId);
  const { sheets, loading, update, flush } = useFileSheets(version?.id);
  const sheetIndex = sheetPick.file === version?.id ? sheetPick.index : 0;
  const activeSheet = sheets?.[sheetIndex] ? sheetIndex : 0;
  const setSheetIndex = (index: number) => setSheetPick({ file: version?.id ?? "", index });
  const sheet = sheets?.[activeSheet];
  // ყველა ფაილში ძებნა
  const [scope, setScope] = useState<"file" | "all">("file");
  const [globalQuery, setGlobalQuery] = useState("");
  const [seedQuery, setSeedQuery] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  // მთავარ ეკრანზე (ფაილი არ არის გახსნილი) ძებნა ყოველთვის ყველა ფაილშია
  const home = !version;
  const searchAll = scope === "all" || home;

  // სხვა ფაილი ზოლიდან — ძებნა თავიდან; ძებნის შედეგიდან გახსნისას (opening) — არა
  const [opening, setOpening] = useState<string | null>(null);
  const [seenFile, setSeenFile] = useState(fileParam);
  if (seenFile !== fileParam) {
    setSeenFile(fileParam);
    if (opening !== fileParam) {
      setSeedQuery("");
      setScope("file");
    }
    setOpening(null);
  }

  const view = useSheetView(sheet, locale, `${version?.id}:${activeSheet}`, seedQuery);
  const search = useFileSearch(globalQuery, searchAll);
  const groups = search.groups;
  // ფაილები, სადაც ჩაწერილი ტექსტი არ მოიძებნა — წითლად
  const missing = groups.length ? (versions ?? []).filter((v) => !groups.some((g) => g.fileId === v.id)).map((v) => ({ fileId: v.id, fileName: v.fileName })) : [];

  const togglePick = (key: string) => setPicked((p) => (p.includes(key) ? p.filter((k) => k !== key) : [...p, key]));

  // ძებნის შედეგიდან — ფაილი იხსნება იმავე ძებნით, რომ სტრიქონი მაშინვე ჩანდეს
  const openResult = (g: SearchGroup) => {
    setSeedQuery(globalQuery);
    setOpening(g.fileId);
    setSheetPick({ file: g.fileId, index: g.sheetIndex });
    setScope("file");
    router.push(`/dashboard?file=${g.fileId}`);
  };

  const compareItems = groups.flatMap((g) =>
    g.hits
      .filter((h) => picked.includes(h.key))
      .map((h) => ({ key: h.key, title: `${g.fileName} · ${g.sheetName} · ${h.n}`, header: g.header, cells: h.cells })),
  );

  const saveSheet = (next: NonNullable<typeof sheet>) =>
    update(activeSheet, next)?.catch(() => setToast(t.errors.save));

  // row — view.rows ინდექსი; row.n — Excel-ის სტრიქონი (1-დან)
  const editCell = (row: number, col: number, raw: string) => {
    const target = view.rows[row];
    if (!sheet || !target) return;
    const value = /^-?\d+(\.\d+)?$/.test(raw.trim()) ? Number(raw) : raw;
    const rows = sheet.rows.map((cells, i) => {
      if (i !== target.n - 1) return cells;
      const copy = [...cells];
      while (copy.length <= col) copy.push("");
      copy[col] = value;
      return copy;
    });
    saveSheet({ ...sheet, rows });
  };

  // სერვისის დამატება: მონიშნული სტრიქონის ქვემოთ, თუ არაფერია მონიშნული — ბოლოში
  const [pendingRow, setPendingRow] = useState<number | null>(null);
  const [rowDeleteOpen, setRowDeleteOpen] = useState(false);
  const selectedRow = view.selected ? view.rows[view.selected.row] : undefined;

  const addRow = () => {
    if (!sheet) return;
    const at = selectedRow ? selectedRow.n : sheet.rows.length; // sheet.rows ინდექსი, სადაც ჩაჯდება
    const width = Math.max(1, sheet.rows[0]?.length ?? 1);
    const rows = [...sheet.rows.slice(0, at), Array.from({ length: width }, () => ""), ...sheet.rows.slice(at)];
    view.setQuery("");
    setPendingRow(at + 1);
    setToast(fill(t.rowAdded, { n: at + 1 }));
    saveSheet({ ...sheet, rows });
  };

  // ახალი სტრიქონი ცხრილში გამოჩნდა — მონიშნე პირველი უჯრა
  if (pendingRow !== null) {
    const index = view.rows.findIndex((r) => r.n === pendingRow);
    if (index >= 0) {
      setPendingRow(null);
      view.setSelected({ row: index, col: 0 });
    }
  }

  const deleteRow = async () => {
    if (!sheet || !selectedRow) return;
    await saveSheet({ ...sheet, rows: sheet.rows.filter((_, i) => i !== selectedRow.n - 1) });
    setRowDeleteOpen(false);
  };

  const resizeColumn = (col: number, width: number) => {
    if (!sheet) return;
    const widths = Array.from({ length: view.columns.length }, (_, i) => sheet.widths?.[i] ?? 0);
    widths[col] = width;
    saveSheet({ ...sheet, widths });
  };

  const selectVersion = (id: string) => router.push(`/dashboard?file=${id}`);

  const upload = async ({ company: name, effectiveFrom, folder, file }: UploadSubmit) => {
    const existing = companies?.find((c) => c.name.toLowerCase() === name.trim().toLowerCase());
    if (existing && versions?.some((v) => v.companyId === existing.id && v.effectiveFrom === effectiveFrom)) {
      return t.errors.duplicate;
    }
    let sheets;
    try {
      sheets = await readWorkbook(file);
    } catch (error) {
      reportError(ErrorAction.Upload, error);
      return t.errors.read;
    }
    try {
      // ატვირთვა = ფაილი + ვერსია 1
      await uploadFile({ companyName: name.trim(), fileName: file.name, effectiveFrom, folderId: folder || undefined, sheets }, t.uploadNote);
      // ატვირთვის შემდეგ ფაილი ავტომატურად არ იხსნება — მომხმარებელი იქვე რჩება
      setToast(fill(t.uploaded, { company: name.trim(), date: formatDate(effectiveFrom) }));
    } catch (error) {
      reportError(ErrorAction.Upload, error);
      return t.errors.upload;
    }
  };

  const saveVersion = async (note: string) => {
    if (!version || !sheets) return;
    try {
      // backend-ი ფაილის ახლანდელ შიგთავსს აკოპირებს — ჯერ დაუსეივებელი ცვლილება
      await flush();
      const snapshot = await saveSnapshot(version.id, note);
      setToast(fill(t.versionSaved, { n: snapshot.n }));
    } catch {
      setToast(t.errors.save);
    }
  };

  const createFolder = async (name: string) => {
    if (folders?.some((f) => f.name.toLowerCase() === name.trim().toLowerCase())) return t.errors.folderDuplicate;
    try {
      await addFolder(name.trim());
      setToast(fill(t.folderCreated, { name: name.trim() }));
    } catch (error) {
      reportError(ErrorAction.CreateFolder, error);
      return t.errors.folderSave;
    }
  };

  const download = () => {
    if (!company || !version || !sheet) return;
    exportCsv(`${company.name} ${formatDate(version.effectiveFrom)} ${sheet.name}`, [view.columns, ...view.rows.map((r) => r.cells)]);
    setToast(t.downloaded);
  };

  // სანამ შენახული მონაცემები არ წაიკითხება — ცარიელი ბარათის ჩარჩო (ციმციმის გარეშე)
  if (!ready) return <main className={styles.card} aria-hidden />;
  const fileCount = versions.length;

  return (
    <main className={styles.card}>
      <section className={styles.file}>
        <FileHeader
          query={searchAll ? globalQuery : view.query}
          onQueryChange={searchAll ? setGlobalQuery : view.setQuery}
          scope={
            fileCount > 1 ? (
              <Checkbox
                label={t.scope.all}
                checked={searchAll}
                disabled={home}
                onChange={(e) => {
                  if (e.target.checked) setGlobalQuery(view.query);
                  setScope(e.target.checked ? "all" : "file");
                }}
              />
            ) : null
          }
          placeholder={t.search}
          searchLabel={t.searchLabel}
          disabled={!sheet && !searchAll}
          user={<UserMenu />}
          actions={
            <>
              <Button size={ButtonSize.Sm} variant={ButtonVariant.Ghost} iconOnly href="/dashboard/history" title={t.historyLink} aria-label={t.historyLink}>
                {StateIcon.history}
              </Button>
              <Button size={ButtonSize.Sm} variant={ButtonVariant.Secondary} iconOnly onClick={() => setFolderOpen(true)} title={t.newFolder} aria-label={t.newFolder}>
                {StateIcon.folderPlus}
              </Button>
              {searchAll && picked.length > 0 && (
                <>
                  <Button size={ButtonSize.Sm} variant={ButtonVariant.Ghost} iconOnly onClick={() => setPicked([])} title={t.globalSearch.clear} aria-label={t.globalSearch.clear}>
                    {StateIcon.clear}
                  </Button>
                  <Button
                    size={ButtonSize.Sm}
                    onClick={() => setCompareOpen(true)}
                    disabled={compareItems.length < 1}
                    title={fill(t.globalSearch.compare, { n: compareItems.length })}
                    aria-label={fill(t.globalSearch.compare, { n: compareItems.length })}
                  >
                    {StateIcon.compare}
                    {compareItems.length}
                  </Button>
                </>
              )}
              {!searchAll && sheet ? (
                <Button size={ButtonSize.Sm} variant={ButtonVariant.Secondary} iconOnly onClick={addRow} title={t.addRow} aria-label={t.addRow}>
                  {StateIcon.addRow}
                </Button>
              ) : null}
              {!searchAll && selectedRow ? (
                <Button size={ButtonSize.Sm} variant={ButtonVariant.Ghost} iconOnly onClick={() => setRowDeleteOpen(true)} title={t.deleteRow} aria-label={t.deleteRow}>
                  {StateIcon.deleteRow}
                </Button>
              ) : null}
              {!searchAll && sheets?.length ? (
                <Button size={ButtonSize.Sm} variant={ButtonVariant.Secondary} iconOnly onClick={() => setSaveOpen(true)} title={t.saveVersion} aria-label={t.saveVersion}>
                  {StateIcon.save}
                </Button>
              ) : null}
              <Button size={ButtonSize.Sm} iconOnly onClick={() => setUploadOpen(true)} title={t.upload} aria-label={t.upload}>
                {StateIcon.upload}
              </Button>
            </>
          }
        />
        {searchAll && !(home && globalQuery.trim().length < MIN_QUERY) ? (
          globalQuery.trim().length < MIN_QUERY ? (
            <EmptyState icon={StateIcon.pick} title={t.globalSearch.hint.title} text={t.globalSearch.hint.text} className={styles.state} />
          ) : search.loading ? (
            <Skeleton className={styles.loading} />
          ) : groups.length ? (
            <SearchResults groups={groups} query={globalQuery} missing={missing} picked={picked} onTogglePick={togglePick} onOpen={openResult} t={t.globalSearch} />
          ) : (
            <EmptyState icon={StateIcon.filter} title={t.globalSearch.none.title} text={t.globalSearch.none.text} className={styles.state} />
          )
        ) : loading ? (
          <Skeleton className={styles.loading} />
        ) : !version && sorted.length ? (
          <ul className={styles.grid} aria-label={t.filesTitle}>
            {sorted.map((v) => (
              <li key={v.id}>
                <button type="button" className={styles.box} onClick={() => selectVersion(v.id)}>
                  <span className={styles.boxIcon}>{StateIcon.upload}</span>
                  <span className={styles.boxName} title={v.fileName}>{v.fileName}</span>
                  <span className={styles.boxMeta}>
                    {companies.find((c) => c.id === v.companyId)?.name} · {formatDate(v.effectiveFrom)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : !version ? (
          <AppEmpty title={t.empty.title} text={t.empty.text} actionLabel={t.upload} onAction={() => setUploadOpen(true)} />
        ) : (
          <>
          <DeleteModal
            name={rowDeleteOpen && selectedRow ? `${selectedRow.n} · ${String(selectedRow.cells.find((c) => String(c).trim()) ?? "")}`.slice(0, 80) : null}
            onClose={() => setRowDeleteOpen(false)}
            onConfirm={deleteRow}
            t={t}
            texts={t.deleteRowModal}
          />
          <SheetGrid
            columns={view.columns}
            widths={view.widths}
            rows={view.rows}
            selected={view.selected}
            onSelect={view.setSelected}
            sort={view.sort}
            onSort={view.toggleSort}
            onResize={resizeColumn}
            onEdit={editCell}
            onCopy={(value) => {
              navigator.clipboard?.writeText(String(value)).catch(() => {});
              setToast(fill(t.copied, { value }));
            }}
            empty={view.total ? t.noResults : t.emptySheet}
            label={sheet?.name ?? t.filesTitle}
          />
          </>
        )}
        {version && !searchAll && (
          <SheetFooter
            sheets={(sheets ?? []).map((s, i) => ({ value: String(i), label: s.name }))}
            value={String(sheets?.[sheetIndex] ? sheetIndex : 0)}
            onChange={(v) => setSheetIndex(Number(v))}
            sheetsLabel={t.sheets}
            hint={t.keysHint}
            actionLabel={t.openInExcel}
            onAction={download}
            actionDisabled={!sheet}
          />
        )}
      </section>

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        t={t}
        calendar={{ ...dictionaries[locale].history.calendar, placeholder: t.uploadModal.datePlaceholder }}
        defaultCompany={company?.name}
        folders={[{ value: "", label: t.uploadModal.noFolder }, ...folders.map((f) => ({ value: f.id, label: f.name }))]}
        defaultFolder={version?.folderId ?? ""}
        onSubmit={upload}
      />
      <CompareModal open={compareOpen} onClose={() => setCompareOpen(false)} items={compareItems} t={t} />
      <SaveVersionModal open={saveOpen} onClose={() => setSaveOpen(false)} t={t} onSubmit={saveVersion} />
      <FolderModal open={folderOpen} onClose={() => setFolderOpen(false)} t={t} onSubmit={createFolder} />
      <Toast message={toast} onClose={() => setToast(null)} className={styles.toast} />
    </main>
  );
}
