import useSWR from "swr";
import { snapshotsApi } from "@/api/snapshots";
import type { FileSummary } from "@/types/api";

/** SWR key-ის პირველი ელემენტი — ფაილის წაშლისას ამით ახლდება */
export const SNAPSHOTS_KEY = "snapshots";

/** ყველა ფაილის ვერსიები ერთ სიად (ისტორია, პროფილი) */
export function useAllSnapshots(files: FileSummary[] | undefined) {
  const ids = files?.map((f) => f.id) ?? [];
  return useSWR(files ? [SNAPSHOTS_KEY, ...ids] : null, async () => (await Promise.all(ids.map((id) => snapshotsApi.list(id)))).flat());
}
