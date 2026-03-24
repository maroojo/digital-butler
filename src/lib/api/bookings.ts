import type {
  BookingQuoteRequest,
  BookingQuoteResponse,
  CreateBookingRequest,
  CreateBookingResponse,
} from "@/types/dorm";
import { parseJsonResponse } from "./http";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

export async function fetchBookingQuote(
  payload: BookingQuoteRequest
): Promise<BookingQuoteResponse> {
  const res = await fetch("/api/bookings/quote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await parseJsonResponse<ApiResponse<BookingQuoteResponse>>(res);

  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.message || "Failed to create booking quote");
  }

  return json.data;
}

export async function createBookingRequestApi(
  payload: CreateBookingRequest
): Promise<CreateBookingResponse> {
  const res = await fetch("/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await parseJsonResponse<ApiResponse<CreateBookingResponse>>(res);

  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.message || "Failed to create booking");
  }

  return json.data;
}