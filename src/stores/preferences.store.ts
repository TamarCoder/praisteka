import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_LOCALE, Locale } from "@/i18n/locales";

export enum Theme {
  Light = "light",
  Dark = "dark",
}

/** localStorage-ის გასაღები — layout.tsx-ის inline სკრიპტიც ამას კითხულობს */
export const PREFERENCES_KEY = "praisteka-preferences";

interface PreferencesState {
  locale: Locale;
  /** null — სისტემის თემა */
  theme: Theme | null;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: Theme) => void;
  /** გვერდითი ზოლი დაკეცილია (მხოლოდ ლოგო + ღილაკი) */
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,
      theme: null,
      setLocale: (locale) => set({ locale }),
      setTheme: (theme) => set({ theme }),
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    }),
    {
      name: PREFERENCES_KEY,
      // სერვერის HTML და პირველი client render ერთნაირი უნდა იყოს; აღდგენა PreferencesSync-შია
      skipHydration: true,
      partialize: ({ locale, theme, sidebarCollapsed }) => ({ locale, theme, sidebarCollapsed }),
    },
  ),
);
