import type { Metadata } from "next";
import type { ReactNode } from "react";

// page.tsx client კომპონენტია, ამიტომ metadata აქ არის
export const metadata: Metadata = { title: "პროფილი" };

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return children;
}
