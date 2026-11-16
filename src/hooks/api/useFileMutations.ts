import { useSWRConfig } from "swr";
import { API_ENDPOINTS } from "@/api/endpoints";
import { filesApi } from "@/api/files";
import { SNAPSHOTS_KEY } from "@/hooks/api/useAllSnapshots";
import type { CreateFileRequest } from "@/types/api";

// ფაილის შექმნა/წაშლა ცვლის სიას, კომპანიებს და ვერსიებს
const isListKey = (key: unknown) =>
  key === API_ENDPOINTS.files || key === API_ENDPOINTS.companies || key === API_ENDPOINTS.folders || (Array.isArray(key) && key[0] === SNAPSHOTS_KEY);

export function useFileMutations() {
  const { mutate } = useSWRConfig();
  const refresh = () => mutate(isListKey);

  /** ატვირთვა = ფაილი + ვერსია 1 */
  const uploadFile = async (input: CreateFileRequest, firstNote: string) => {
    // ფაილი და ვერსია 1 — ერთ მოთხოვნაში
    const file = await filesApi.create({ ...input, note: firstNote });
    await mutate(API_ENDPOINTS.file(file.id), file, { revalidate: false });
    await refresh();
    return file;
  };

  const deleteFile = async (fileId: string) => {
    await filesApi.delete(fileId);
    await mutate(API_ENDPOINTS.file(fileId), undefined, { revalidate: false });
    await refresh();
  };

  /** ფოლდერში გადატანა; null — ფოლდერიდან გამოტანა */
  const moveFile = async (fileId: string, folderId: string | null) => {
    const file = await filesApi.update(fileId, { folderId });
    await mutate(API_ENDPOINTS.file(fileId), file, { revalidate: false });
    await refresh();
  };

  const deleteAll = async () => {
    await filesApi.deleteAll();
    await refresh();
  };

  return { uploadFile, deleteFile, moveFile, deleteAll };
}
