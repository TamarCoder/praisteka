"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button/Button";
import { ButtonSize, ButtonVariant } from "@/components/ui/Button/Button.types";
import { Field } from "@/components/ui/Field/Field";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher/LanguageSwitcher";
import { PasswordInput } from "@/components/ui/PasswordInput/PasswordInput";
import { SegmentedControl } from "@/components/ui/SegmentedControl/SegmentedControl";
import { SegmentedSize } from "@/components/ui/SegmentedControl/SegmentedControl.types";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher/ThemeSwitcher";
import { Toast } from "@/components/ui/Toast/Toast";
import { useFilesHydration } from "@/hooks/useFilesHydration";
import { useSystemTheme } from "@/hooks/useSystemTheme";
import { dictionaries } from "@/i18n/dictionaries";
import { clearAllSheets } from "@/lib/demoFiles";
import { useFilesStore } from "@/stores/files.store";
import { usePreferencesStore } from "@/stores/preferences.store";
import { useUserStore } from "@/stores/user.store";
import styles from "./page.module.scss";

enum Confirm {
  Data = "data",
  Account = "account",
}

const MIN_PASSWORD = 8;

/** ბაიტები → „1.2 MB“ */
const formatBytes = (n: number) => (n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`);

// პარამეტრები: გარეგნობა, უსაფრთხოება, მონაცემები, ანგარიში (ბექენდამდე — ბრაუზერში)
export default function SettingsPage() {
  const ready = useFilesHydration();
  const [toast, setToast] = useState<string | null>(null);
  const onNotice = setToast;
  const router = useRouter();
  const { locale, theme, setLocale, setTheme, sidebarCollapsed, toggleSidebar } = usePreferencesStore();
  const systemTheme = useSystemTheme();
  const { user: t, prefs, auth } = dictionaries[locale];
  const clearAll = useFilesStore((s) => s.clearAll);
  const signOut = useUserStore((s) => s.signOut);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [next2, setNext2] = useState("");
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [usage, setUsage] = useState<number | null>(null);

  useEffect(() => {
    navigator.storage?.estimate?.().then((e) => setUsage(e.usage ?? null)).catch(() => setUsage(null));
  }, []);

  const nextError = next && next.length < MIN_PASSWORD ? t.passwordShort : undefined;
  const next2Error = next2 && next2 !== next ? t.passwordMismatch : undefined;
  const canChange = current.length >= MIN_PASSWORD && next.length >= MIN_PASSWORD && next === next2;

  const changePassword = () => {
    setCurrent("");
    setNext("");
    setNext2("");
    onNotice(t.passwordChanged);
  };

  const wipe = async () => {
    await clearAllSheets();
    clearAll();
  };

  const deleteData = async () => {
    await wipe();
    setConfirm(null);
    setUsage(null);
    onNotice(t.dataCleared);
  };

  const deleteAccount = async () => {
    await wipe();
    signOut();
    router.push("/login");
  };

  const danger = (kind: Confirm, title: string, hint: string, action: () => void) => (
    <div className={styles.danger}>
      <div className={styles.text}>
        <p className={styles.name}>{title}</p>
        <p className={styles.hint}>{hint}</p>
      </div>
      {confirm === kind ? (
        <div className={styles.confirm}>
          <Button size={ButtonSize.Sm} variant={ButtonVariant.Secondary} onClick={() => setConfirm(null)}>{t.cancel}</Button>
          <Button size={ButtonSize.Sm} className={styles.destroy} onClick={action}>{t.confirmDelete}</Button>
        </div>
      ) : (
        <Button size={ButtonSize.Sm} variant={ButtonVariant.Outline} className={styles.destroyOutline} onClick={() => setConfirm(kind)}>{title}</Button>
      )}
    </div>
  );

  if (!ready) return <main className={styles.card} aria-hidden />;

  // ერთი სექცია: მარცხნივ სათაური + აღწერა, მარჯვნივ ბარათი
  const section = (title: string, hint: string, body: ReactNode, dangerZone = false) => (
    <section className={styles.section}>
      <div className={styles.intro}>
        <h2 className={styles.heading}>{title}</h2>
        <p className={styles.hint}>{hint}</p>
      </div>
      <div className={[styles.panel, dangerZone && styles.dangerPanel].filter(Boolean).join(" ")}>{body}</div>
    </section>
  );

  return (
    <main className={styles.card}>
      <header className={styles.header}>
        <Button variant={ButtonVariant.Secondary} href="/dashboard" aria-label={t.back} title={t.back} className={styles.back}>
          ←
        </Button>
        <h1 className={styles.title}>{t.settings}</h1>
      </header>

      <div className={styles.body}>
        {section(
          t.appearance,
          t.appearanceHint,
          <>
            <div className={styles.row}>
              <span className={styles.name}>{prefs.language}</span>
              <LanguageSwitcher value={locale} onChange={setLocale} label={prefs.language} />
            </div>
            <div className={styles.row}>
              <span className={styles.name}>{prefs.theme}</span>
              <ThemeSwitcher value={theme ?? systemTheme} onChange={setTheme} labels={{ group: prefs.theme, light: prefs.light, dark: prefs.dark }} />
            </div>
            <div className={`${styles.row} ${styles.desktopOnly}`}>
              <span className={styles.name}>{t.sidebarStart}</span>
              <SegmentedControl
                size={SegmentedSize.Sm}
                label={t.sidebarStart}
                value={sidebarCollapsed ? "closed" : "open"}
                onChange={(v) => (v === "closed") !== sidebarCollapsed && toggleSidebar()}
                items={[
                  { value: "open", label: t.sidebarOpen },
                  { value: "closed", label: t.sidebarClosed },
                ]}
              />
            </div>
          </>,
        )}

        {section(
          t.security,
          t.passwordHint,
          <div className={styles.form}>
            <Field label={t.currentPassword}>
              <PasswordInput value={current} onChange={(e) => setCurrent(e.target.value)} labels={auth.passwordToggle} autoComplete="current-password" />
            </Field>
            <div className={styles.pair}>
              <Field label={t.newPassword} error={nextError}>
                <PasswordInput value={next} onChange={(e) => setNext(e.target.value)} invalid={!!nextError} labels={auth.passwordToggle} autoComplete="new-password" />
              </Field>
              <Field label={t.newPassword2} error={next2Error}>
                <PasswordInput value={next2} onChange={(e) => setNext2(e.target.value)} invalid={!!next2Error} labels={auth.passwordToggle} autoComplete="new-password" />
              </Field>
            </div>
            <Button size={ButtonSize.Sm} className={styles.end} onClick={changePassword} disabled={!canChange}>{t.changePassword}</Button>
          </div>,
        )}

        {section(
          t.data,
          t.dataHint,
          <>
            <div className={styles.row}>
              <span className={styles.name}>{t.storageUsed}</span>
              <span className={styles.usage}>{usage === null ? "—" : formatBytes(usage)}</span>
            </div>
            {danger(Confirm.Data, t.clearData, t.clearDataHint, deleteData)}
          </>,
        )}

        {section(t.account, t.accountHint, danger(Confirm.Account, t.deleteAccount, t.deleteAccountHint, deleteAccount), true)}
      </div>

      <Toast message={toast} onClose={() => setToast(null)} className={styles.toast} />
    </main>
  );
}
