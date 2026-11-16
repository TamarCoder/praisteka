import useSWR from "swr";
import { API_ENDPOINTS } from "@/api/endpoints";
import { filesApi } from "@/api/files";

/** ფაილების სია — შიგთავსის გარეშე */
export function useFiles() {
  return useSWR(API_ENDPOINTS.files, filesApi.list);
}
