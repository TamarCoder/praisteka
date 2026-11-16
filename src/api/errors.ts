import { API_ENDPOINTS } from "@/api/endpoints";
import { ApiError, http } from "@/api/fetcher";
import type { ErrorAction, ReportErrorRequest } from "@/types/api";

export const errorsApi = {
  report: (input: ReportErrorRequest) =>
    http.post<void>(API_ENDPOINTS.errors, input),
};

/** შეცდომა ადმინკისთვის (POST /api/errors). თვითონ არასდროს აგდებს შეცდომას */
export function reportError(
  action: ErrorAction,
  error: unknown,
  email?: string,
): void {
  const code = error instanceof ApiError ? `HTTP_${error.status}` : "NETWORK";
  const message = (
    error instanceof Error ? error.message : String(error)
  ).slice(0, 1000);
  errorsApi.report({ action, code, message, email }).catch(() => {});
}
