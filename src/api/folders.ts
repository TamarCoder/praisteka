import { API_ENDPOINTS } from "@/api/endpoints";
import { http } from "@/api/fetcher";
import type { CreateFolderRequest, Folder } from "@/types/api";

export const foldersApi = {
  list: () => http.get<Folder[]>(API_ENDPOINTS.folders),
  create: (input: CreateFolderRequest) =>
    http.post<Folder>(API_ENDPOINTS.folders, input),
  delete: (folderId: string) => http.delete(API_ENDPOINTS.folder(folderId)),
};
