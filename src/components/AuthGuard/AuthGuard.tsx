"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useSessionStore } from "@/stores/session.store";

/** შესვლის გარეშე ადმინის გვერდები არ ჩანს — გადაყავს /login-ზე */
export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const token = useSessionStore((s) => s.token);
  const hydrated = useSessionStore((s) => s.hydrated);

  useEffect(() => {
    useSessionStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (hydrated && !token) router.replace("/login");
  }, [hydrated, token, router]);

  // გვერდი ყოველთვის იხატება (Next.js-ის instant validation); token-ის გარეშე → /login
  return children;
}
