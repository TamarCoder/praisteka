"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthCard } from "@/components/auth/AuthCard/AuthCard";
import { AuthMode } from "@/components/auth/AuthCard/AuthCard.types";
import { RegisterForm } from "@/components/auth/RegisterForm/RegisterForm";
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
        <RegisterForm
          t={t.auth}
          onBusyChange={setBusy}
          onSubmit={async (values) => {
            const email = values.email.trim();
            try {
              await authApi.register({ name: values.name.trim(), email, password: values.password });
              // ელფოსტა შესვლის ფორმაში წინასწარ ჩაიწერება
              router.push(`/login?email=${encodeURIComponent(email)}`);
            } catch (error) {
              reportError(ErrorAction.Register, error, email);
              if (!(error instanceof ApiError)) return t.auth.errors.network;
              return error.status === 409 ? t.auth.errors.emailTaken : t.auth.errors.network;
            }
          }}
        />
      </AuthCard>
    </main>
  );
}
