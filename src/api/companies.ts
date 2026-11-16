import { API_ENDPOINTS } from "@/api/endpoints";
import { http } from "@/api/fetcher";
import type { Company } from "@/types/api";

export const companiesApi = {
  list: () => http.get<Company[]>(API_ENDPOINTS.companies),
};
