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

/** ელემენტი id-ით; ზოლი მოგვიანებით იტვირთება (ჯერ ჩარჩო), ამიტომ DOM-ს ვუყურებთ */
export function useElementById(id: string, enabled: boolean): HTMLElement | null {
  const el = useSyncExternalStore(
    (change) => {
      const observer = new MutationObserver(change);
      observer.observe(document.body, { childList: true, subtree: true });
      return () => observer.disconnect();
    },
    () => document.getElementById(id),
    () => null,
  );
  return enabled ? el : null;
}
