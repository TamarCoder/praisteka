import useSWR from "swr";
import { API_ENDPOINTS } from "@/api/endpoints";
import { foldersApi } from "@/api/folders";

export function useFolders() {
  return useSWR(API_ENDPOINTS.folders, foldersApi.list);
}
