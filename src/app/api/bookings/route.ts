import { NextResponse } from "next/server";
import { createBooking } from "@/server/services/bookings.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await createBooking(body);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    );
  }
}