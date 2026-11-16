import type { Metadata } from "next";
import type { ReactNode } from "react";

// page.tsx client კომპონენტია, ამიტომ metadata აქ არის
export const metadata: Metadata = { title: "პარამეტრები" };

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return children;
}
