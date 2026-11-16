"use client";

import type { ReactNode } from "react";
import { SWRConfig } from "swr";
import { ApiError, fetcher } from "@/api/fetcher";

export function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (path: string) => fetcher(path),
        // 4xx თავიდან ცდით არ გასწორდება
        shouldRetryOnError: (error) => !(error instanceof ApiError && error.status < 500),
      }}
    >
      {children}
    </SWRConfig>
  );
}
