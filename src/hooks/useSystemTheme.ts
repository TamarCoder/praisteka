"use client";

import { useEffect, useState } from "react";
import { Theme } from "@/stores/preferences.store";

// სისტემის თემა, სანამ მომხმარებელი თავად აირჩევს
export function useSystemTheme() {
  const [theme, setTheme] = useState(Theme.Light);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => setTheme(media.matches ? Theme.Dark : Theme.Light);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return theme;
}
