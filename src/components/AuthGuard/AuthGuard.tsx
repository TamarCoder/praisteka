"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useSessionStore } from "@/stores/session.store";

/** შესვლის გარეშე ადმინის გვერდები არ ჩანს — გადაყავს /login-ზე */
export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const signedIn = useSessionStore((s) => s.signedIn);
  const hydrated = useSessionStore((s) => s.hydrated);

  useEffect(() => {
    useSessionStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (hydrated && !signedIn) router.replace("/login");
  }, [hydrated, signedIn, router]);

  // გვერდი ყოველთვის იხატება (Next.js-ის instant validation); გაუსვლელი → /login
  return children;
}
