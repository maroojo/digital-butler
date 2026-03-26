import type { OwnerDashboardData, OwnerRepairItem } from "@/types/portal";
import { parseJsonResponse } from "./http";

type ApiResponse<T> = { success: boolean; data?: T; message?: string };

export async function fetchOwnerDashboard(): Promise<OwnerDashboardData> {
  const res = await fetch("/api/owner/dashboard", { cache: "no-store" });
  const json = await parseJsonResponse<ApiResponse<OwnerDashboardData>>(res);
  if (!res.ok || !json.success || !json.data) throw new Error(json.message || "Failed to load owner dashboard");
  return json.data;
}

export async function approveOwnerRepair(id: string): Promise<OwnerRepairItem> {
  const res = await fetch(`/api/owner/repairs/${id}/approve`, { method: "POST" });
  const json = await parseJsonResponse<ApiResponse<OwnerRepairItem>>(res);
  if (!res.ok || !json.success || !json.data) throw new Error(json.message || "Failed to approve repair");
  return json.data;
}
