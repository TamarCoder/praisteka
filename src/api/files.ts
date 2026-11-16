import { API_ENDPOINTS } from "@/api/endpoints";
import { http } from "@/api/fetcher";
import type {
  CreateFileRequest,
  FileDetail,
  FileSummary,
  UpdateFileRequest,
} from "@/types/api";

export const filesApi = {
  list: () => http.get<FileSummary[]>(API_ENDPOINTS.files),
  get: (fileId: string) => http.get<FileDetail>(API_ENDPOINTS.file(fileId)),
  create: (input: CreateFileRequest) =>
    http.post<FileDetail>(API_ENDPOINTS.files, input),
  update: (fileId: string, input: UpdateFileRequest) =>
    http.patch<FileDetail>(API_ENDPOINTS.file(fileId), input),
  delete: (fileId: string) => http.delete(API_ENDPOINTS.file(fileId)),
  /** ყველა ფაილი, ფოლდერი და კომპანია */
  deleteAll: () => http.delete(API_ENDPOINTS.files),
};
