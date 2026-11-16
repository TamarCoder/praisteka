import type { Locale } from "@/i18n/locales";

export interface LanguageSwitcherProps {
  value: Locale;
  onChange: (locale: Locale) => void;
  /** ეკრანის წამკითხველისთვის, მაგ. „ენა“ */
  label: string;
  className?: string;
}
