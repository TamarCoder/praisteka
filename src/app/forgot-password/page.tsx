"use client";

import { useState } from "react";
import { AuthCard } from "@/components/auth/AuthCard/AuthCard";
import { AuthSuccess } from "@/components/auth/AuthSuccess/AuthSuccess";
import { Button } from "@/components/ui/Button/Button";
import { ButtonVariant } from "@/components/ui/Button/Button.types";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher/ThemeSwitcher";
import { useSystemTheme } from "@/hooks/useSystemTheme";
import { dictionaries } from "@/i18n/dictionaries";
import { usePreferencesStore } from "@/stores/preferences.store";
import styles from "./page.module.scss";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm/ForgotPasswordForm";
import { demoSendResetLink } from "@/lib/demoAuth";

export default function ForgotPasswordPage() {
  const { locale, theme, setLocale, setTheme } = usePreferencesStore();
  const systemTheme = useSystemTheme();
  const t = dictionaries[locale];
  const [done, setDone] = useState(false);

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
      <AuthCard title={t.auth.forgotPage.title} text={done ? undefined : t.auth.forgotPage.text}>
        {done ? (
          <AuthSuccess title={t.auth.done.forgot.title} text={t.auth.done.forgot.text}>
            {/* დემო: რეალური ელფოსტის ნაცვლად — წაიშლება ბექენდთან ერთად */}
            <Button variant={ButtonVariant.Text} href="/reset-password">
              {t.auth.forgotPage.demoOpen}
            </Button>
            <Button variant={ButtonVariant.Text} href="/login">
              {t.auth.backToLogin}
            </Button>
          </AuthSuccess>
        ) : (
          <ForgotPasswordForm
            t={t.auth}
            backHref="/login"
            onSubmit={async () => {
              await demoSendResetLink();
              setDone(true);
            }}
          />
        )}
      </AuthCard>
    </main>
  );
}
