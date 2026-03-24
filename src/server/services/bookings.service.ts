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

export async function createBookingQuote(
  payload: BookingQuoteRequest,
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
  payload: CreateBookingRequest,
): Promise<CreateBookingResponse> {
  const quote = await createBookingQuote({
    dormId: payload.dormId,
    roomInventoryId: payload.roomInventoryId,
  });

  return {
    bookingId: `bk_${Date.now()}`,
    status: "pending_payment",
    qrCodeValue: quote.qrCodeValue,
    expiresAt: quote.expiresAt,
  };
}