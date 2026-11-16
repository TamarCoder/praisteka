import { useSWRConfig } from "swr";
import { API_ENDPOINTS } from "@/api/endpoints";
import { filesApi } from "@/api/files";
import { snapshotsApi } from "@/api/snapshots";
import { SNAPSHOTS_KEY } from "@/hooks/api/useAllSnapshots";
import type { SheetData } from "@/lib/readWorkbook";

export function useSnapshotMutations() {
  const { mutate } = useSWRConfig();
  const refresh = () => mutate((key) => Array.isArray(key) && key[0] === SNAPSHOTS_KEY);

  /** ახალი ვერსია ფაილის ახლანდელი შიგთავსიდან */
  const saveSnapshot = async (fileId: string, note: string) => {
    const snapshot = await snapshotsApi.create(fileId, { note });
    await refresh();
    return snapshot;
  };

  /** ძველი ვერსიის აღდგენა: ფაილი იცვლება და ინახება ახალ ვერსიად */
  const restoreSnapshot = async (fileId: string, sheets: SheetData[], note: string) => {
    const file = await filesApi.update(fileId, { sheets });
    await mutate(API_ENDPOINTS.file(fileId), file, { revalidate: false });
    return saveSnapshot(fileId, note);
  };

  return { saveSnapshot, restoreSnapshot };
}
