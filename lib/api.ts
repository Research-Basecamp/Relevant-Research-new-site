const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ── Public API (ISR with revalidation) ──

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export function getProjects() { return fetchAPI<any[]>("/projects"); }
export function getClients() { return fetchAPI<any[]>("/clients"); }
export function getFeaturedIn() { return fetchAPI<any[]>("/featured-in"); }
export function getServices() { return fetchAPI<any[]>("/services"); }
export function getTeamMembers() { return fetchAPI<any[]>("/team-members"); }
export function getResearchPapers() { return fetchAPI<any[]>("/research-papers"); }
export function getNews(params?: { page?: number; limit?: number; category?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.category) searchParams.set("category", params.category);
  const qs = searchParams.toString();
  return fetchAPI<{ items: any[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>(
    `/news${qs ? `?${qs}` : ""}`
  );
}
export function getSiteSettings() { return fetchAPI<Record<string, any>>("/site-settings"); }
export function getHomeSections() { return fetchAPI<any[]>("/site-settings/home-sections"); }
export function getSiteSetting(key: string) { return getSiteSettings().then((s) => s[key]); }

// ── Auth API Client (for admin dashboard) ──

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) localStorage.setItem("auth_token", token);
      else localStorage.removeItem("auth_token");
    }
  }

  getToken() {
    return this.token;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: any,
    options?: { auth?: boolean }
  ): Promise<T> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (options?.auth !== false && this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body, (_k, v) => v === null ? undefined : v) : undefined,
    });

    if (res.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
      }
      throw new Error("Unauthorized");
    }

    if (res.status === 204) return undefined as T;

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || data.message || "Request failed");
    }
    return data;
  }

  get<T>(path: string, auth?: boolean) { return this.request<T>("GET", path, undefined, { auth }); }
  post<T>(path: string, body?: any, auth?: boolean) { return this.request<T>("POST", path, body, { auth }); }
  put<T>(path: string, body?: any, auth?: boolean) { return this.request<T>("PUT", path, body, { auth }); }
  delete<T>(path: string, auth?: boolean) { return this.request<T>("DELETE", path, undefined, { auth }); }
}

export const api = new ApiClient();
