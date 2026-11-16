"use client";

import { useEffect, useState } from "react";
import { loadSnapshot } from "@/lib/demoFiles";
import { diffSheets, type SheetsDiff } from "@/lib/diffSheets";
import type { SheetData } from "@/lib/readWorkbook";

interface Loaded {
  id: string;
  sheets: SheetData[];
  /** null — წინა ვერსია არ არსებობს */
  diff: SheetsDiff | null;
  error: boolean;
}

/** არჩეული ვერსიის შიგთავსი და შედარება წინასთან */
export function useSnapshotDiff(id: string | undefined, previousId: string | undefined) {
  const [loaded, setLoaded] = useState<Loaded>();

  useEffect(() => {
    if (!id) return;
    let alive = true;
    Promise.all([loadSnapshot(id), previousId ? loadSnapshot(previousId) : undefined])
      .then(([sheets = [], prev]) => {
        if (alive) setLoaded({ id, sheets, diff: prev ? diffSheets(prev, sheets) : null, error: false });
      })
      .catch(() => alive && setLoaded({ id, sheets: [], diff: null, error: true }));
    return () => {
      alive = false;
    };
  }, [id, previousId]);

  return loaded?.id === id ? loaded : undefined;
}
