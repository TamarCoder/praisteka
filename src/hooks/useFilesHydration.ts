"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useFilesStore } from "@/stores/files.store";
import { usePreferencesStore } from "@/stores/preferences.store";
import { useUserStore } from "@/stores/user.store";

const isHydrated = () => !!(useFilesStore.persist?.hasHydrated() && usePreferencesStore.persist?.hasHydrated() && useUserStore.persist?.hasHydrated());

const subscribe = (onChange: () => void) => {
  const off = [useFilesStore.persist?.onFinishHydration(onChange), usePreferencesStore.persist?.onFinishHydration(onChange), useUserStore.persist?.onFinishHydration(onChange)];
  return () => off.forEach((fn) => fn?.());
};

/**
 * localStorage-იდან ფაილების სიის და პარამეტრების (ენა, ზოლი) აღდგენა.
 * true — როცა ორივე მზადაა; მანამდე გვერდი არაფერს ხატავს, რომ არ აციმციმდეს.
 * Hydration-ის დროს ყოველთვის false (სერვერის მსგავსად) — Link-ით გადასვლისას მაშინვე true.
 */
export function useFilesHydration() {
  const ready = useSyncExternalStore(subscribe, isHydrated, () => false);

  useEffect(() => {
    if (!useFilesStore.persist.hasHydrated()) useFilesStore.persist.rehydrate();
    if (!usePreferencesStore.persist.hasHydrated()) usePreferencesStore.persist.rehydrate();
    if (!useUserStore.persist.hasHydrated()) useUserStore.persist.rehydrate();
  }, []);

  return ready;
}
