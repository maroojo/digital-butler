import { NextRequest, NextResponse } from "next/server";
import { getDorms } from "@/server/services/dorms.service";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const furniture = searchParams.getAll("furniture");
  const q = searchParams.get("q") || undefined;
  const near = searchParams.get("near") || undefined;
  const priceMax = searchParams.get("priceMax");
  const roomSizeMin = searchParams.get("roomSizeMin");
  const petFriendly = searchParams.get("petFriendly");

  const data = await getDorms({
    q,
    near,
    furniture,
    priceMax: priceMax ? Number(priceMax) : undefined,
    roomSizeMin: roomSizeMin ? Number(roomSizeMin) : undefined,
    petFriendly: petFriendly === "true",
  });

  return NextResponse.json({
    success: true,
    data,
  });
}