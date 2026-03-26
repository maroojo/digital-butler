import { getDormByIdOrSlug } from "./dorms.service";
import type {
  BookingQuoteRequest,
  BookingQuoteResponse,
  CreateBookingRequest,
  CreateBookingResponse,
} from "@/types/dorm";

function makeExpiry(minutes = 15) {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}

function isBase64Image(value: string) {
  return /^data:image\/[a-zA-Z]+;base64,/.test(value);
}

export async function createBookingQuote(
  payload: BookingQuoteRequest
): Promise<BookingQuoteResponse> {
  const dorm = await getDormByIdOrSlug(payload.dormId);
  if (!dorm) {
    throw new Error("Dorm not found");
  }

  const room = dorm.roomInventories.find((r) => r.id === payload.roomInventoryId);
  if (!room) {
    throw new Error("Room inventory not found");
  }

  if (room.availableCount <= 0 || room.status !== "available") {
    throw new Error("Room is not available");
  }

  const bookingFee = 500;
  const totalDue = room.depositAmount + room.advanceAmount + bookingFee;

  return {
    dormId: dorm.id,
    dormName: dorm.name,
    roomInventoryId: room.id,
    roomTypeName: room.roomTypeName,
    monthlyPrice: room.monthlyPrice,
    depositAmount: room.depositAmount,
    advanceAmount: room.advanceAmount,
    bookingFee,
    totalDue,
    qrCodeValue: `PROMPTPAY|DORM=${dorm.id}|ROOM=${room.id}|AMOUNT=${totalDue}`,
    expiresAt: makeExpiry(15),
  };
}

export async function createBooking(
  payload: CreateBookingRequest
): Promise<CreateBookingResponse> {
  if (!payload.tenantName?.trim()) {
    throw new Error("Tenant name is required");
  }

  if (!payload.tenantPhone?.trim()) {
    throw new Error("Tenant phone is required");
  }

  if (!payload.moveInDate?.trim()) {
    throw new Error("Move-in date is required");
  }

  if (!payload.slipFileName?.trim()) {
    throw new Error("Slip file name is required");
  }

  if (!payload.slipBase64?.trim()) {
    throw new Error("Slip image is required");
  }

  if (!isBase64Image(payload.slipBase64)) {
    throw new Error("Slip must be an image file");
  }

  const quote = await createBookingQuote({
    dormId: payload.dormId,
    roomInventoryId: payload.roomInventoryId,
  });

  return {
    bookingId: `bk_${Date.now()}`,
    status: "pending_review",
    qrCodeValue: quote.qrCodeValue,
    expiresAt: quote.expiresAt,
    tenantName: payload.tenantName.trim(),
    tenantPhone: payload.tenantPhone.trim(),
    moveInDate: payload.moveInDate,
    slipFileName: payload.slipFileName,
    createdAt: new Date().toISOString(),
  };
}