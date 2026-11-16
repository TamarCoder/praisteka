import { requireSession } from "@/lib/session";
import type { ApiErrorResponse } from "@/types/api";

// API იგივე დომენზეა: /api/* → priceteka-backend (next.config.ts rewrite, API_ORIGIN)
// სესია HttpOnly cookie-შია და ბრაუზერი თავად აგზავნის — token კოდში არსად არის
export const API_URL = "";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly body: unknown,
    message = `Request failed with status ${status}`,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const messageOf = (body: unknown, status: number) => {
  const message = (body as Partial<ApiErrorResponse> | null)?.message;
  if (Array.isArray(message)) return message.join(", ");
  return typeof message === "string"
    ? message
    : `Request failed with status ${status}`;
};

/** ერთადერთი fetch აპში: cookie, JSON, 401 → გასვლა, შეცდომა → ApiError */
export async function fetcher<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");
  if (init?.body && !headers.has("Content-Type"))
    headers.set("Content-Type", "application/json");

  const res = await fetch(
    `${API_URL}${path.startsWith("/") ? path : `/${path}`}`,
    { ...init, headers, credentials: "same-origin" },
  );
  const text = res.status === 204 ? "" : await res.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text) as unknown;
    } catch {
      if (res.ok)
        throw new ApiError(
          res.status,
          text,
          "The API returned an invalid JSON response.",
        );
      body = text;
    }
  }

  if (res.status === 401) requireSession();
  if (!res.ok)
    throw new ApiError(res.status, body, messageOf(body, res.status));
  return body as T;
}

const json = (method: string, body?: unknown): RequestInit => ({
  method,
  body: body === undefined ? undefined : JSON.stringify(body),
});

/** მეთოდები ცალ-ცალკე — ყველა იმავე fetcher-ით */
export const http = {
  get: <T>(path: string) => fetcher<T>(path),
  post: <T>(path: string, body?: unknown) =>
    fetcher<T>(path, json("POST", body)),
  put: <T>(path: string, body?: unknown) => fetcher<T>(path, json("PUT", body)),
  patch: <T>(path: string, body?: unknown) =>
    fetcher<T>(path, json("PATCH", body)),
  delete: <T = void>(path: string) => fetcher<T>(path, json("DELETE")),
};
