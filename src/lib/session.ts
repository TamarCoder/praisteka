import { useSessionStore } from "@/stores/session.store";

// fetcher-ისთვის — React-ის გარეთ
// localStorage-ის token იკითხება პირველ მოთხოვნამდე (სინქრონულად)
export function getSessionToken(): string | null {
  if (!useSessionStore.persist.hasHydrated()) void useSessionStore.persist.rehydrate();
  return useSessionStore.getState().token;
}

/** 401: token იშლება, AuthGuard /login-ზე გადაიყვანს */
export function requireSession(): void {
  useSessionStore.getState().signOut();
}
