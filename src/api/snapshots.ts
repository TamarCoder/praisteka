import { API_ENDPOINTS } from "@/api/endpoints";
import { http } from "@/api/fetcher";
import type {
  CreateSnapshotRequest,
  SnapshotDetail,
  SnapshotSummary,
} from "@/types/api";

export const snapshotsApi = {
  list: (fileId: string) =>
    http.get<SnapshotSummary[]>(API_ENDPOINTS.snapshots(fileId)),
  get: (fileId: string, snapshotId: string) =>
    http.get<SnapshotDetail>(API_ENDPOINTS.snapshot(fileId, snapshotId)),
  /** backend-ი ფაილის ახლანდელ შიგთავსს აკოპირებს */
  create: (fileId: string, input: CreateSnapshotRequest) =>
    http.post<SnapshotDetail>(API_ENDPOINTS.snapshots(fileId), input),
};
