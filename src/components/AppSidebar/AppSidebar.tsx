"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { ButtonSize, ButtonVariant } from "@/components/ui/Button/Button.types";
import { DeleteModal } from "@/components/DeleteModal/DeleteModal";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher/LanguageSwitcher";
import { Logo } from "@/components/ui/Logo/Logo";
import { LogoSize } from "@/components/ui/Logo/Logo.types";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher/ThemeSwitcher";
import { Toast } from "@/components/ui/Toast/Toast";
import { useFileTree } from "@/hooks/useFileTree";
import { useCompanies } from "@/hooks/api/useCompanies";
import { useFileMutations } from "@/hooks/api/useFileMutations";
import { useFiles } from "@/hooks/api/useFiles";
import { useFolders } from "@/hooks/api/useFolders";
import { useSystemTheme } from "@/hooks/useSystemTheme";
import { dictionaries } from "@/i18n/dictionaries";
import { fill } from "@/i18n/fill";
import { usePreferencesStore } from "@/stores/preferences.store";
import { FileTree } from "../FileTree/FileTree";
import styles from "./AppSidebar.module.scss";

// dashboard/layout.tsx-შია — გვერდებს შორის გადასვლისას ადგილზე რჩება
export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { data: files } = useFiles();
  const { data: folders } = useFolders();
  const { data: companies } = useCompanies();
  const { deleteFile } = useFileMutations();
  const tree = useFileTree(files ?? [], folders ?? [], companies ?? []);
  const { locale, theme, setLocale, setTheme, sidebarCollapsed: collapsed, toggleSidebar } = usePreferencesStore();
  const systemTheme = useSystemTheme();
  const { prefs, nav, dashboard: t } = dictionaries[locale];
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  // ტაბლეტი/მობილური: ☰ მენიუ, როგორც ლენდინგზე (LandingTopBar)
  const [menuOpen, setMenuOpen] = useState(false);

  // ჩატვირთვისას — იგივე სიგანის ჩარჩო ლოგოთი (სიგანე <html data-sidebar>-იდან), რომ ბარათი არ გადახტეს
  if (!files || !folders || !companies)
    return (
      <aside className={`${styles.sidebar} ${styles.placeholder}`} aria-hidden>
        <Logo size={LogoSize.Md} className={styles.logo} />
      </aside>
    );

  const fileParam = params.get("file");
  // ფაილი მონიშნულია მხოლოდ მაშინ, როცა გახსნილია (?file=)
  const activeId = pathname === "/dashboard" ? (fileParam ?? undefined) : undefined;
  const label = collapsed ? prefs.expand : prefs.collapse;
  const toDelete = files.find((f) => f.id === deleteId);

  const removeFile = async () => {
    if (!toDelete) return;
    try {
      await deleteFile(toDelete.id);
    } catch {
      setToast(t.errors.save);
      return;
    }
    if (fileParam === toDelete.id) router.replace("/dashboard");
    setDeleteId(null);
    setToast(fill(t.deleted, { name: toDelete.fileName }));
  };

  return (
    <aside className={[styles.sidebar, collapsed && styles.collapsed].filter(Boolean).join(" ")}>
      <div className={styles.head}>
        <Link href="/dashboard" className={styles.home} aria-label={t.filesTitle} onClick={() => setMenuOpen(false)}>
          <Logo size={LogoSize.Md} withText={!collapsed} className={styles.logo} />
        </Link>
        <Button
          variant={ButtonVariant.Ghost}
          size={ButtonSize.Sm}
          className={styles.burger}
          aria-label={nav.menu}
          aria-expanded={menuOpen}
          aria-controls="app-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "✕" : "☰"}
        </Button>
      </div>
      <div id="app-menu" className={[styles.menu, menuOpen && styles.menuOpen].filter(Boolean).join(" ")}>
        <FileTree
          label={t.filesTitle}
          folders={tree.folders}
          files={tree.files}
          activeId={activeId}
          onSelect={(id) => {
            setMenuOpen(false);
            router.push(`/dashboard?file=${id}`);
          }}
          onDelete={setDeleteId}
          deleteLabel={t.deleteFile}
          emptyText={t.noFiles}
          emptyHint={t.noFilesHint}
        />
        <div className={styles.bottom}>
          <div className={styles.prefs}>
            <LanguageSwitcher value={locale} onChange={setLocale} label={prefs.language} />
            <ThemeSwitcher value={theme ?? systemTheme} onChange={setTheme} labels={{ group: prefs.theme, light: prefs.light, dark: prefs.dark }} />
          </div>
          <button type="button" className={styles.toggle} aria-label={label} title={label} aria-expanded={!collapsed} onClick={toggleSidebar}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M9 4v16" />
              <path d={collapsed ? "m13 10 2 2-2 2" : "m15 10-2 2 2 2"} />
            </svg>
          </button>
        </div>
      </div>
      <DeleteModal name={toDelete?.fileName ?? null} onClose={() => setDeleteId(null)} onConfirm={removeFile} t={t} />
      <Toast message={toast} onClose={() => setToast(null)} className={styles.toast} />
    </aside>
  );
}
