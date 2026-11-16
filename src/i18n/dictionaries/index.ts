import { Locale } from "../locales";
import { en } from "./en";
import { ka, type Dictionary } from "./ka";

export const dictionaries: Record<Locale, Dictionary> = {
  [Locale.Ka]: ka,
  [Locale.En]: en,
};
