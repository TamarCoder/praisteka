import useSWR from "swr";
import { API_ENDPOINTS } from "@/api/endpoints";
import { snapshotsApi } from "@/api/snapshots";
import { diffSheets } from "@/lib/diffSheets";
import type { SnapshotSummary } from "@/types/api";

/** არჩეული ვერსიის შიგთავსი და შედარება წინასთან (null — წინა არ არსებობს) */
export function useSnapshotDiff(active: SnapshotSummary | undefined, previous: SnapshotSummary | undefined) {
  const key = active ? [API_ENDPOINTS.snapshot(active.fileId, active.id), previous?.id ?? ""] : null;
  return useSWR(key, async () => {
    const [current, prev] = await Promise.all([
      snapshotsApi.get(active!.fileId, active!.id),
      previous ? snapshotsApi.get(previous.fileId, previous.id) : undefined,
    ]);
    return { sheets: current.sheets, diff: prev ? diffSheets(prev.sheets, current.sheets) : null };
  });
}
