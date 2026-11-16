"use client";

import { useEffect, useState } from "react";
import { loadSheets, saveSheets } from "@/lib/demoFiles";
import type { SheetData } from "@/lib/readWorkbook";

/** არჩეული ვერსიის ფურცლები IndexedDB-დან */
export function useVersionSheets(versionId: string | undefined) {
  const [loaded, setLoaded] = useState<{ id: string; sheets: SheetData[] }>();

  useEffect(() => {
    if (!versionId) return;
    let alive = true;
    loadSheets(versionId)
      .then((sheets) => alive && setLoaded({ id: versionId, sheets: sheets ?? [] }))
      .catch(() => alive && setLoaded({ id: versionId, sheets: [] }));
    return () => {
      alive = false;
    };
  }, [versionId]);

  const ready = !!versionId && loaded?.id === versionId;

  /** ერთი ფურცლის შეცვლა — ეკრანზე მაშინვე, IndexedDB-ში ფონურად */
  const update = (index: number, sheet: SheetData) => {
    if (!ready) return;
    const sheets = loaded.sheets.map((s, i) => (i === index ? sheet : s));
    setLoaded({ id: loaded.id, sheets });
    return saveSheets(loaded.id, sheets);
  };

  return { sheets: ready ? loaded.sheets : undefined, loading: !!versionId && !ready, update };
}
