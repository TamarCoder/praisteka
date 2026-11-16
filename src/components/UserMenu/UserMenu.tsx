"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { useDismiss } from "@/hooks/useDismiss";
import { dictionaries } from "@/i18n/dictionaries";
import { useAccountMutations } from "@/hooks/api/useAccountMutations";
import { useMe } from "@/hooks/api/useMe";
import { usePreferencesStore } from "@/stores/preferences.store";
import styles from "./UserMenu.module.scss";

// ჰედერში ავატარი → პროფილი, პარამეტრები, გასვლა
export function UserMenu() {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);
  const locale = usePreferencesStore((s) => s.locale);
  const { user: t } = dictionaries[locale];
  const { data: user } = useMe();
  const { logout: endSession } = useAccountMutations();
  const initial = (user?.name[0] ?? "").toUpperCase();

  const logout = async () => {
    await endSession();
    router.push("/login");
  };

  return (
    <div ref={ref} className={styles.wrap}>
      <button type="button" className={styles.avatar} aria-label={t.menu} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {initial}
      </button>
      {open && (
        <div role="menu" className={styles.menu}>
          <div className={styles.who}>
            <span className={styles.avatarSm} aria-hidden>{initial}</span>
            <span className={styles.whoText}>
              <span className={styles.whoName}>{user?.name}</span>
              {user && <span className={styles.email}>{user.email}</span>}
            </span>
          </div>
          <button type="button" role="menuitem" className={styles.item} onClick={() => {
              setOpen(false);
              router.push("/dashboard/profile");
            }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21a8 8 0 0 1 16 0" />
            </svg>
            {t.profile}
          </button>
          <button type="button" role="menuitem" className={styles.item} onClick={() => {
              setOpen(false);
              router.push("/dashboard/settings");
            }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
              <circle cx="16" cy="6" r="2" />
              <circle cx="10" cy="12" r="2" />
              <circle cx="18" cy="18" r="2" />
            </svg>
            {t.settings}
          </button>
          <button type="button" role="menuitem" className={`${styles.item} ${styles.logout}`} onClick={logout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="m16 17 5-5-5-5M21 12H9" />
            </svg>
            {t.logout}
          </button>
        </div>
      )}
    </div>
  );
}
