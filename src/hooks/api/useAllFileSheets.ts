import useSWR from "swr";
import { filesApi } from "@/api/files";
import { trimSheet, type SheetData } from "@/lib/readWorkbook";
import type { SearchSource } from "@/lib/searchFiles";
import type { FileSummary } from "@/types/api";

/**
 * ყველა ფაილის ფურცლები ძებნისთვის — მხოლოდ როცა enabled.
 * active — ღია ფაილის ფურცლები (დაუსეივებელი რედაქტირებით).
 */
export function useAllFileSheets(files: FileSummary[], enabled: boolean, active?: { id: string; sheets: SheetData[] }) {
  const ids = files.map((f) => f.id);
  const { data, isLoading } = useSWR(enabled ? ["all-sheets", ...ids] : null, async () =>
    Object.fromEntries(await Promise.all(ids.map(async (id) => [id, (await filesApi.get(id)).sheets.map(trimSheet)] as const))),
  );

  const sources: SearchSource[] = files.map((f) => ({
    fileId: f.id,
    fileName: f.fileName,
    sheets: active?.id === f.id ? active.sheets : (data?.[f.id] ?? []),
  }));
  return { sources, loading: enabled && isLoading };
}
