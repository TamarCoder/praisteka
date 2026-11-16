"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ApiError } from "@/api/fetcher";
import { Button } from "@/components/ui/Button/Button";
import { ButtonSize, ButtonVariant } from "@/components/ui/Button/Button.types";
import { Field } from "@/components/ui/Field/Field";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher/LanguageSwitcher";
import { PasswordInput } from "@/components/ui/PasswordInput/PasswordInput";
import { SegmentedControl } from "@/components/ui/SegmentedControl/SegmentedControl";
import { SegmentedSize } from "@/components/ui/SegmentedControl/SegmentedControl.types";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher/ThemeSwitcher";
import { Toast } from "@/components/ui/Toast/Toast";
import { useAccountMutations } from "@/hooks/api/useAccountMutations";
import { useFileMutations } from "@/hooks/api/useFileMutations";
import { useSystemTheme } from "@/hooks/useSystemTheme";
import { dictionaries } from "@/i18n/dictionaries";
import { usePreferencesStore } from "@/stores/preferences.store";
import styles from "./page.module.scss";

enum Confirm {
  Data = "data",
  Account = "account",
}

const MIN_PASSWORD = 8;

// პარამეტრები: გარეგნობა, უსაფრთხოება, მონაცემები, ანგარიში
export default function SettingsPage() {
  const [toast, setToast] = useState<string | null>(null);
  const onNotice = setToast;
  const router = useRouter();
  const { locale, theme, setLocale, setTheme, sidebarCollapsed, toggleSidebar } = usePreferencesStore();
  const systemTheme = useSystemTheme();
  const { user: t, prefs, auth } = dictionaries[locale];
  const { changePassword: savePassword, deleteAccount: removeAccount } = useAccountMutations();
  const { deleteAll } = useFileMutations();
  const [busy, setBusy] = useState(false);
  const [passwordError, setPasswordError] = useState<string>();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [next2, setNext2] = useState("");
  const [confirm, setConfirm] = useState<Confirm | null>(null);

  const nextError = next && next.length < MIN_PASSWORD ? t.passwordShort : undefined;
  const next2Error = next2 && next2 !== next ? t.passwordMismatch : undefined;
  const canChange = current.length >= MIN_PASSWORD && next.length >= MIN_PASSWORD && next === next2;

  const changePassword = async () => {
    setBusy(true);
    setPasswordError(undefined);
    try {
      await savePassword({ currentPassword: current, newPassword: next });
      setCurrent("");
      setNext("");
      setNext2("");
      onNotice(t.passwordChanged);
    } catch (error) {
      setPasswordError(error instanceof ApiError && error.status === 400 ? t.wrongPassword : t.saveFailed);
    } finally {
      setBusy(false);
    }
  };

  // ფაილები, ფოლდერები, კომპანიები და ვერსიები — სერვერზე
  const deleteData = async () => {
    try {
      await deleteAll();
      setConfirm(null);
      onNotice(t.dataCleared);
    } catch {
      onNotice(t.saveFailed);
    }
  };

  const deleteAccount = async () => {
    try {
      await removeAccount();
      router.push("/login");
    } catch {
      onNotice(t.saveFailed);
    }
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
            <Field label={t.currentPassword} error={passwordError}>
              <PasswordInput value={current} onChange={(e) => {
                setCurrent(e.target.value);
                setPasswordError(undefined);
              }} invalid={!!passwordError} labels={auth.passwordToggle} autoComplete="current-password" />
            </Field>
            <div className={styles.pair}>
              <Field label={t.newPassword} error={nextError}>
                <PasswordInput value={next} onChange={(e) => setNext(e.target.value)} invalid={!!nextError} labels={auth.passwordToggle} autoComplete="new-password" />
              </Field>
              <Field label={t.newPassword2} error={next2Error}>
                <PasswordInput value={next2} onChange={(e) => setNext2(e.target.value)} invalid={!!next2Error} labels={auth.passwordToggle} autoComplete="new-password" />
              </Field>
            </div>
            <Button size={ButtonSize.Sm} className={styles.end} onClick={changePassword} loading={busy} disabled={!canChange}>{t.changePassword}</Button>
          </div>,
        )}

        {section(
          t.data,
          t.dataHint,
          danger(Confirm.Data, t.clearData, t.clearDataHint, deleteData),
        )}

        {section(t.account, t.accountHint, danger(Confirm.Account, t.deleteAccount, t.deleteAccountHint, deleteAccount), true)}
      </div>

      <Toast message={toast} onClose={() => setToast(null)} className={styles.toast} />
    </main>
  );
}
