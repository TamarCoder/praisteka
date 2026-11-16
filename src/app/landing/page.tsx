"use client";

import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher/ThemeSwitcher";
import { LandingAbout } from "@/components/landing/LandingAbout/LandingAbout";
import { LandingBackground } from "@/components/landing/LandingBackground/LandingBackground";
import { LandingHero } from "@/components/landing/LandingHero/LandingHero";
import { LandingScene } from "@/components/landing/LandingScene/LandingScene";
import { LandingTopBar } from "@/components/landing/LandingTopBar/LandingTopBar";
import type { LandingNavItem } from "@/components/landing/LandingTopBar/LandingTopBar.types";
import { SceneHistoryPlate } from "@/components/landing/SceneHistoryPlate/SceneHistoryPlate";
import { SceneInsurersPlate } from "@/components/landing/SceneInsurersPlate/SceneInsurersPlate";
import { ScenePricePlate } from "@/components/landing/ScenePricePlate/ScenePricePlate";
import { ModalSize } from "@/components/ui/Modal/Modal.types";
import { dictionaries } from "@/i18n/dictionaries";
import { Theme, usePreferencesStore } from "@/stores/preferences.store";
import styles from "./page.module.scss";

// სადემო მონაცემები 3D ფირფიტებისთვის
const VERSION_DATES = ["01.09.2026", "01.03.2026", "01.09.2025"];
const SAMPLE_ROWS = [
  { code: "A-102", total: "72" },
  { code: "A-108", total: "108" },
  { code: "B-032", total: "32" },
  { code: "C-135", total: "135" },
];

export default function LandingPage() {
  const { locale, theme, setLocale, setTheme } = usePreferencesStore();
  const t = dictionaries[locale];

  // თემა ჯერ არ არის არჩეული — გადამრთველი სისტემის თემას აჩვენებს
  const [systemTheme, setSystemTheme] = useState(Theme.Light);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => setSystemTheme(media.matches ? Theme.Dark : Theme.Light);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const navItems: LandingNavItem[] = [
    { id: "home", label: t.nav.home, href: "/landing" },
    {
      id: "about",
      label: t.nav.about,
      modal: {
        title: t.nav.about,
        size: ModalSize.Lg,
        content: <LandingAbout lead={t.about.lead} paragraphs={t.about.paragraphs} features={t.features} />,
      },
    },
    { id: "pricing", label: t.nav.pricing, modal: { title: t.nav.pricing } },
    { id: "contacts", label: t.nav.contacts, modal: { title: t.nav.contacts } },
  ];

  const plates = [
    <SceneInsurersPlate key="files" title={t.scene.filesTitle} insurers={t.scene.files} selected={1} />,
    <SceneHistoryPlate key="versions" title={t.scene.versionsTitle} dates={VERSION_DATES} currentLabel={t.scene.latest} />,
    <ScenePricePlate
      key="search"
      query={t.scene.query}
      serviceHeader={t.scene.nameHeader}
      priceHeader={t.scene.totalHeader}
      rows={SAMPLE_ROWS.map((row) => ({ service: `${t.scene.rowPrefix} ${row.code}`, price: row.total }))}
    />,
  ];

  return (
    <main className={styles.page}>
      <LandingBackground />
      <LandingTopBar
        className={styles.content}
        items={navItems}
        activeId="home"
        loginHref="/login"
        loginLabel={t.nav.login}
        registerHref="/register"
        registerLabel={t.nav.register}
        menuLabel={t.nav.menu}
        preferences={
          <div className={styles.prefs}>
            <LanguageSwitcher value={locale} onChange={setLocale} label={t.prefs.language} />
            <ThemeSwitcher
              value={theme ?? systemTheme}
              onChange={setTheme}
              labels={{ group: t.prefs.theme, light: t.prefs.light, dark: t.prefs.dark }}
            />
          </div>
        }
      />
      <div className={`${styles.grid} ${styles.content}`}>
        <LandingHero
          title={t.hero.title}
          text={t.hero.text}
          primaryAction={{ label: t.hero.register, href: "/register" }}
          secondaryAction={{ label: t.hero.login, href: "/login" }}
        />
        <LandingScene className={styles.scene} plates={plates} />
      </div>
    </main>
  );
}
