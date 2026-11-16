import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { AppSidebar } from "@/components/AppSidebar/AppSidebar";
import styles from "./layout.module.scss";

// page.tsx client კომპონენტია, ამიტომ metadata აქ არის
export const metadata: Metadata = { title: "ფაილები" };

// ზოლი აქ: /dashboard ↔ /dashboard/history გადასვლისას ადგილზე რჩება, იცვლება მხოლოდ ბარათი
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      {/* useSearchParams — Suspense-ის გარეშე სტატიკური აწყობა ვერ ხერხდება */}
      <Suspense>
        <AppSidebar />
      </Suspense>
      <Suspense>{children}</Suspense>
    </div>
  );
}
