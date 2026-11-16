import type { Theme } from "@/stores/preferences.store";

export interface ThemeSwitcherProps {
  value: Theme;
  onChange: (theme: Theme) => void;
  /** ეკრანის წამკითხველისთვის */
  labels: {
    group: string;
    light: string;
    dark: string;
  };
  className?: string;
}
