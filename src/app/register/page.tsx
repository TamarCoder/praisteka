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
import { demoRegister } from "@/lib/demoAuth";
import { usePreferencesStore } from "@/stores/preferences.store";
import { useUserStore } from "@/stores/user.store";
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
        hint={t.auth.demoHint}
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
              await demoRegister();
              await useUserStore.persist.rehydrate();
              useUserStore.getState().signIn(values.email, values.name.trim());
              setDone(true);
            }}
          />
        )}
      </AuthCard>
    </main>
  );
}
