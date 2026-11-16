import { useSyncExternalStore } from "react";

// ეკრანი 1024px-ზე ვიწროა? (tokens/_breakpoints.scss: desktop 1024px)
const QUERY = "(max-width: 1023.98px)";

const subscribe = (change: () => void) => {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", change);
  return () => media.removeEventListener("change", change);
};

export const useBelowDesktop = () =>
  useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
