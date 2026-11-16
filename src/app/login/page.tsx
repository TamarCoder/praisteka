"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthCard } from "@/components/auth/AuthCard/AuthCard";
import { AuthMode } from "@/components/auth/AuthCard/AuthCard.types";
import { LoginForm } from "@/components/auth/LoginForm/LoginForm";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher/ThemeSwitcher";
import { useSystemTheme } from "@/hooks/useSystemTheme";
import { dictionaries } from "@/i18n/dictionaries";
import { authApi } from "@/api/auth";
import { reportError } from "@/api/errors";
import { ApiError } from "@/api/fetcher";
import { usePreferencesStore } from "@/stores/preferences.store";
import { useSessionStore } from "@/stores/session.store";
import { ErrorAction } from "@/types/api";
import styles from "./page.module.scss";

export default function LoginPage() {
  const router = useRouter();
  const { locale, theme, setLocale, setTheme } = usePreferencesStore();
  const systemTheme = useSystemTheme();
  const t = dictionaries[locale];
  const [busy, setBusy] = useState(false);

  const changeMode = (mode: AuthMode) => mode === AuthMode.Register && router.push("/register");

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
        mode={AuthMode.Login}
        onModeChange={changeMode}
        modeLabels={t.auth.modes}
        busy={busy}
      >
        <LoginForm
          t={t.auth}
          onBusyChange={setBusy}
          forgotHref="/forgot-password"
          onSubmit={async (values) => {
            const email = values.email.trim();
            try {
              const { token } = await authApi.login({ email, password: values.password });
              useSessionStore.getState().signIn(token);
              router.push("/dashboard");
            } catch (error) {
              reportError(ErrorAction.Login, error, email);
              if (!(error instanceof ApiError)) return t.auth.errors.network;
              if (error.status === 403) return t.auth.errors.blocked;
              if (error.status === 429) return t.auth.errors.tooMany;
              return t.auth.errors.credentials;
            }
          }}
        />
      </AuthCard>
    </main>
  );
}
