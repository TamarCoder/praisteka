"use client";

import { useEffect } from "react";
import { usePreferencesStore } from "@/stores/preferences.store";

/** localStorage-იდან აღადგენს ენას, თემას და ზოლს და <html>-ზე ასახავს */
export function PreferencesSync() {
  const locale = usePreferencesStore((s) => s.locale);
  const theme = usePreferencesStore((s) => s.theme);
  const collapsed = usePreferencesStore((s) => s.sidebarCollapsed);

  useEffect(() => {
    usePreferencesStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme) root.dataset.th = theme;
  }, [theme]);

  // layout.tsx-ის სკრიპტის მსგავსად — ზოლის ჩარჩო ჩატვირთვისას სწორ სიგანეზე
  useEffect(() => {
    const root = document.documentElement;
    if (collapsed) root.dataset.sidebar = "collapsed";
    else delete root.dataset.sidebar;
  }, [collapsed]);

  return null;
}
