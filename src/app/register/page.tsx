"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthCard } from "@/components/auth/AuthCard/AuthCard";
import { AuthMode } from "@/components/auth/AuthCard/AuthCard.types";
import { AuthSuccess } from "@/components/auth/AuthSuccess/AuthSuccess";
import { RegisterForm } from "@/components/auth/RegisterForm/RegisterForm";
import { Button } from "@/components/ui/Button/Button";
import { ButtonVariant } from "@/components/ui/Button/Button.types";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher/ThemeSwitcher";
import { useSystemTheme } from "@/hooks/useSystemTheme";
import { dictionaries } from "@/i18n/dictionaries";
import { authApi } from "@/api/auth";
import { reportError } from "@/api/errors";
import { ApiError } from "@/api/fetcher";
import { usePreferencesStore } from "@/stores/preferences.store";
import { ErrorAction } from "@/types/api";
import styles from "./page.module.scss";

export default function RegisterPage() {
  const router = useRouter();
  const { locale, theme, setLocale, setTheme } = usePreferencesStore();
  const systemTheme = useSystemTheme();
  const t = dictionaries[locale];
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const toLogin = () => router.push("/login");

  return (
    <main className={styles.page}>
      <div className={styles.prefs}>
        <LanguageSwitcher value={locale} onChange={setLocale} label={t.prefs.language} />
        <ThemeSwitcher
          value={theme ?? systemTheme}
          onChange={setTheme}
          labels={{ group: t.prefs.theme, light: t.prefs.light, dark: t.prefs.dark }}
        />
      </div>
      <AuthCard
        mode={AuthMode.Register}
        onModeChange={(mode) => mode === AuthMode.Login && toLogin()}
        modeLabels={t.auth.modes}
        busy={busy}
      >
        {done ? (
          <AuthSuccess title={t.auth.done.register.title} text={t.auth.done.register.text}>
            <Button variant={ButtonVariant.Text} onClick={toLogin}>
              {t.auth.done.back}
            </Button>
          </AuthSuccess>
        ) : (
          <RegisterForm
            t={t.auth}
            onBusyChange={setBusy}
            onSubmit={async (values) => {
              const email = values.email.trim();
              try {
                await authApi.register({ name: values.name.trim(), email, password: values.password });
                setDone(true);
              } catch (error) {
                reportError(ErrorAction.Register, error, email);
                if (!(error instanceof ApiError)) return t.auth.errors.network;
                return error.status === 409 ? t.auth.errors.emailTaken : t.auth.errors.network;
              }
            }}
          />
        )}
      </AuthCard>
    </main>
  );
}
