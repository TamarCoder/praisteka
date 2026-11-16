import { useSessionStore } from "@/stores/session.store";

// fetcher-ისთვის — React-ის გარეთ
export function getSessionToken(): string | null {
  return useSessionStore.getState().token;
}

/** 401: token იშლება, AuthGuard /login-ზე გადაიყვანს */
export function requireSession(): void {
  useSessionStore.getState().signOut();
}
