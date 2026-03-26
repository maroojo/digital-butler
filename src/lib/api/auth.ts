import type { AuthRole, AuthUser } from "@/types/portal";
import { parseJsonResponse } from "./http";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

export async function loginPortal(payload: { username: string; password: string; role: AuthRole }) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await parseJsonResponse<ApiResponse<AuthUser>>(res);
  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.message || "Login failed");
  }
  return json.data;
}

export async function fetchMe() {
  const res = await fetch("/api/auth/me", { cache: "no-store" });
  const json = await parseJsonResponse<ApiResponse<AuthUser>>(res);
  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.message || "Not authenticated");
  }
  return json.data;
}

export async function logoutPortal() {
  const res = await fetch("/api/auth/logout", { method: "POST" });
  const json = await parseJsonResponse<ApiResponse<null>>(res);
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Logout failed");
  }
}
