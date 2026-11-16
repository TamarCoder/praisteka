import useSWR from "swr";
import { authApi } from "@/api/auth";
import { API_ENDPOINTS } from "@/api/endpoints";

export function useMe() {
  return useSWR(API_ENDPOINTS.authMe, authApi.me);
}
