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
import { DEMO_NAME, demoLogin } from "@/lib/demoAuth";
import { usePreferencesStore } from "@/stores/preferences.store";
import { useUserStore } from "@/stores/user.store";
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
        hint={t.auth.demoHint}
      >
        <LoginForm
          t={t.auth}
          onBusyChange={setBusy}
          forgotHref="/forgot-password"
          onSubmit={async (values) => {
            // დემო: შესვლა demo@clinic.ge-ით ან იმ ელფოსტით, რომლითაც ამ ბრაუზერში დარეგისტრირდი
            await useUserStore.persist.rehydrate();
            const registered = useUserStore.getState().user?.email === values.email.trim();
            if (!(await demoLogin(values)) && !registered) return t.auth.errors.credentials;
            const email = values.email.trim();
            useUserStore.getState().signIn(email, registered ? undefined : DEMO_NAME);
            router.push("/dashboard");
          }}
        />
      </AuthCard>
    </main>
  );
}
