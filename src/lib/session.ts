import { useSessionStore } from "@/stores/session.store";

/** 401: სესია აღარ არის — AuthGuard /login-ზე გადაიყვანს */
export function requireSession(): void {
  useSessionStore.getState().signOut();
}
