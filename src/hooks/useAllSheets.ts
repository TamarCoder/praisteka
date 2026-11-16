"use client";

import { useEffect, useState } from "react";
import { loadSheets } from "@/lib/demoFiles";
import type { SheetData } from "@/lib/readWorkbook";
import type { SearchSource } from "@/lib/searchFiles";
import type { FileVersion } from "@/stores/files.store";

/**
 * ყველა ფაილის ფურცლები IndexedDB-დან — მხოლოდ როცა enabled.
 * active — ღია ფაილის ახალი (დაუსეივებელი რედაქტირებით) ფურცლები.
 */
export function useAllSheets(files: FileVersion[], enabled: boolean, active?: { id: string; sheets: SheetData[] }) {
  const [loaded, setLoaded] = useState<Record<string, SheetData[]>>({});
  const ids = files.map((f) => f.id).join(",");

  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    const list = ids ? ids.split(",") : [];
    Promise.all(list.map((id) => loadSheets(id).then((s) => [id, s ?? []] as const, () => [id, []] as const))).then(
      (pairs) => alive && setLoaded(Object.fromEntries(pairs)),
    );
    return () => {
      alive = false;
    };
  }, [enabled, ids]);

  const sources: SearchSource[] = files.map((f) => ({
    fileId: f.id,
    fileName: f.fileName,
    sheets: active?.id === f.id ? active.sheets : (loaded[f.id] ?? []),
  }));
  return { sources, loading: enabled && files.some((f) => !(f.id in loaded)) };
}
