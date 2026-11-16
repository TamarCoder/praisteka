import useSWR from "swr";
import { companiesApi } from "@/api/companies";
import { API_ENDPOINTS } from "@/api/endpoints";

export function useCompanies() {
  return useSWR(API_ENDPOINTS.companies, companiesApi.list);
}
