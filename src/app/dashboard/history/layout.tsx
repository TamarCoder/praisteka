import type { Metadata } from "next";
import type { ReactNode } from "react";

// page.tsx client კომპონენტია, ამიტომ metadata აქ არის
export const metadata: Metadata = { title: "ვერსიების ისტორია" };

export default function HistoryLayout({ children }: { children: ReactNode }) {
  return children;
}
