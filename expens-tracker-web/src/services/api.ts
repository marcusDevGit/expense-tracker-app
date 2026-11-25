import { useAuthStore } from "../stores/auth.store";

const BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3333/api/v1/"
).replace(/\/?$/, "/");

export interface RequestConfig {
  params?: Record<string, string | number | boolean | undefined | null>;
  responseType?: "json" | "blob";
  headers?: Record<string, string>;
}

export interface ApiErrorPayload {
  error?: string;
  message?: string;
}

export class ApiHttpError extends Error {
  public readonly response: { status: number; data: ApiErrorPayload | null };

  constructor(message: string, status: number, data: ApiErrorPayload | null) {
    super(message);
    this.name = "ApiHttpError";
    this.response = { status, data };
  }
}

function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined | null>,
): string {
  const cleanPath = path.replace(/^\/+/, "");
  const url = new URL(cleanPath, BASE_URL);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.append(key, String(value));
      }
    }
  }

  return url.toString();
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(buildUrl("auth/refresh"), {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) return null;

        const json = await res.json();
        const newToken: string | undefined =
          json?.data?.accessToken ?? json?.accessToken;
        if (newToken) {
          localStorage.setItem("@expense:token", newToken);
          return newToken;
        }
        return null;
      } catch {
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  config?: RequestConfig,
  isRetry = false,
): Promise<{ data: T }> {
  const headers: Record<string, string> = {
    ...(config?.headers ?? {}),
  };

  const token = localStorage.getItem("@expense:token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const init: RequestInit = {
    method,
    headers,
    credentials: "include",
  };

  if (body !== undefined) {
    if (body instanceof FormData) {
      init.body = body;
    } else {
      headers["Content-Type"] = "application/json";
      init.body = JSON.stringify(body);
    }
  }

  const response = await fetch(buildUrl(path, config?.params), init);

  if (
    response.status === 401 &&
    !isRetry &&
    !path.includes("auth/login") &&
    !path.includes("auth/refresh")
  ) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return request<T>(method, path, body, config, true);
    }
    useAuthStore.getState().logout();
    window.location.href = "/login";
  }

  if (!response.ok) {
    let errorData: ApiErrorPayload | null = null;
    try {
      errorData = (await response.json()) as ApiErrorPayload;
    } catch {
      errorData = null;
    }
    const message =
      errorData?.error ||
      errorData?.message ||
      `Erro HTTP ${response.status}`;
    throw new ApiHttpError(message, response.status, errorData);
  }

  if (config?.responseType === "blob") {
    const blob = await response.blob();
    return { data: blob as T };
  }

  if (response.status === 204) {
    return { data: undefined as T };
  }

  const text = await response.text();
  if (!text) {
    return { data: undefined as T };
  }

  const json = JSON.parse(text);
  if (json && json.success === true) {
    return { data: json.data as T };
  }
  return { data: json as T };
}

export const api = {
  get<T = unknown>(path: string, config?: RequestConfig) {
    return request<T>("GET", path, undefined, config);
  },
  post<T = unknown>(path: string, body?: unknown, config?: RequestConfig) {
    return request<T>("POST", path, body, config);
  },
  put<T = unknown>(path: string, body?: unknown, config?: RequestConfig) {
    return request<T>("PUT", path, body, config);
  },
  patch<T = unknown>(path: string, body?: unknown, config?: RequestConfig) {
    return request<T>("PATCH", path, body, config);
  },
  delete<T = unknown>(path: string, config?: RequestConfig) {
    return request<T>("DELETE", path, undefined, config);
  },
};
