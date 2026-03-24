import type { DormDetail, DormListItem, DormSearchParams } from "@/types/dorm";
import { parseJsonResponse } from "./http";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

function buildDormQuery(params: DormSearchParams) {
  const searchParams = new URLSearchParams();

  if (params.q) searchParams.set("q", params.q);
  if (params.near) searchParams.set("near", params.near);
  if (params.priceMax) searchParams.set("priceMax", String(params.priceMax));
  if (params.roomSizeMin) searchParams.set("roomSizeMin", String(params.roomSizeMin));
  if (params.petFriendly) searchParams.set("petFriendly", "true");

  for (const item of params.furniture ?? []) {
    searchParams.append("furniture", item);
  }

  return searchParams.toString();
}

export async function fetchDorms(params: DormSearchParams): Promise<DormListItem[]> {
  const query = buildDormQuery(params);

  const res = await fetch(`/api/dorms?${query}`, {
    method: "GET",
    cache: "no-store",
  });

  const json = await parseJsonResponse<ApiResponse<DormListItem[]>>(res);

  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.message || "Failed to fetch dorms");
  }

  return json.data;
}

export async function fetchDormDetail(identifier: string): Promise<DormDetail> {
  const res = await fetch(`/api/dorms/${identifier}`, {
    method: "GET",
    cache: "no-store",
  });

  const json = await parseJsonResponse<ApiResponse<DormDetail>>(res);

  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.message || "Failed to fetch dorm detail");
  }

  return json.data;
}