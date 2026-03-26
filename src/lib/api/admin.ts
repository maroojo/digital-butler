import type { AdminOperationsData, EContractRecord, PaymentHistoryRecord, PaymentSlipRecord, UtilityBillingInput, UtilityBillingRecord } from "@/types/portal";
import { parseJsonResponse } from "./http";

type ApiResponse<T> = { success: boolean; data?: T; message?: string };

export async function fetchAdminOverview(): Promise<AdminOperationsData> {
  const res = await fetch("/api/admin/overview", { cache: "no-store" });
  const json = await parseJsonResponse<ApiResponse<AdminOperationsData>>(res);
  if (!res.ok || !json.success || !json.data) throw new Error(json.message || "Failed to load admin overview");
  return json.data;
}

export async function createDraftContract(): Promise<EContractRecord> {
  const res = await fetch("/api/admin/contracts", { method: "POST" });
  const json = await parseJsonResponse<ApiResponse<EContractRecord>>(res);
  if (!res.ok || !json.success || !json.data) throw new Error(json.message || "Failed to create contract");
  return json.data;
}

export async function calculateUtility(payload: UtilityBillingInput): Promise<UtilityBillingRecord> {
  const res = await fetch("/api/admin/utility-billing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await parseJsonResponse<ApiResponse<UtilityBillingRecord>>(res);
  if (!res.ok || !json.success || !json.data) throw new Error(json.message || "Failed to calculate utility bill");
  return json.data;
}

export async function verifySlip(id: string, action: "verified" | "rejected"): Promise<PaymentSlipRecord> {
  const res = await fetch("/api/admin/financial/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, action }),
  });
  const json = await parseJsonResponse<ApiResponse<PaymentSlipRecord>>(res);
  if (!res.ok || !json.success || !json.data) throw new Error(json.message || "Failed to verify slip");
  return json.data;
}
