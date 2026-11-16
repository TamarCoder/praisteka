"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { ButtonSize, ButtonVariant } from "@/components/ui/Button/Button.types";
import { DeleteModal } from "@/components/DeleteModal/DeleteModal";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher/LanguageSwitcher";
import { Logo } from "@/components/ui/Logo/Logo";
import { LogoSize } from "@/components/ui/Logo/Logo.types";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher/ThemeSwitcher";
import { Toast } from "@/components/ui/Toast/Toast";
import { useFileTree } from "@/hooks/useFileTree";
import { useFilesHydration } from "@/hooks/useFilesHydration";
import { useSystemTheme } from "@/hooks/useSystemTheme";
import { dictionaries } from "@/i18n/dictionaries";
import { fill } from "@/i18n/fill";
import { deleteSheets, deleteSnapshot } from "@/lib/demoFiles";
import { useFilesStore } from "@/stores/files.store";
import { usePreferencesStore } from "@/stores/preferences.store";
import { useUserStore } from "@/stores/user.store";
import { FileTree } from "../FileTree/FileTree";
import styles from "./AppSidebar.module.scss";

// dashboard/layout.tsx-შია — გვერდებს შორის გადასვლისას ადგილზე რჩება
export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const ready = useFilesHydration();
  const tree = useFileTree();
  const { versions, snapshots, removeVersion } = useFilesStore();
  const { locale, theme, setLocale, setTheme, sidebarCollapsed: collapsed, toggleSidebar } = usePreferencesStore();
  const systemTheme = useSystemTheme();
  const { prefs, nav, dashboard: t } = dictionaries[locale];
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  // ტაბლეტი/მობილური: ☰ მენიუ, როგორც ლენდინგზე (LandingTopBar)
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useUserStore((s) => s.user);

  // შესვლის გარეშე აპი არ იხსნება — შესვლის გვერდზე
  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  // ჩატვირთვისას — იგივე სიგანის ჩარჩო ლოგოთი (სიგანე <html data-sidebar>-იდან), რომ ბარათი არ გადახტეს
  if (!ready || !user)
    return (
      <aside className={`${styles.sidebar} ${styles.placeholder}`} aria-hidden>
        <Logo size={LogoSize.Md} className={styles.logo} />
      </aside>
    );

  const fileParam = params.get("file");
  const activeId = pathname === "/dashboard" ? (fileParam ?? tree.firstId) : undefined;
  const label = collapsed ? prefs.expand : prefs.collapse;
  const toDelete = versions.find((v) => v.id === deleteId);

  const removeFile = async () => {
    if (!toDelete) return;
    await deleteSheets(toDelete.id);
    await Promise.all(snapshots.filter((s) => s.fileId === toDelete.id).map((s) => deleteSnapshot(s.id)));
    removeVersion(toDelete.id);
    if (fileParam === toDelete.id) router.replace("/dashboard");
    setDeleteId(null);
    setToast(fill(t.deleted, { name: toDelete.fileName }));
  };

  return (
    <aside className={[styles.sidebar, collapsed && styles.collapsed].filter(Boolean).join(" ")}>
      <div className={styles.head}>
        <Logo size={LogoSize.Md} withText={!collapsed} className={styles.logo} />
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
