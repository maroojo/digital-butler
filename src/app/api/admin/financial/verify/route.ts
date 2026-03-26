import { NextResponse } from "next/server";
import { requireRole } from "@/server/services/auth.service";
import { verifyPaymentSlip } from "@/server/services/admin.service";

export async function POST(req: Request) {
  try {
    await requireRole("admin");
    const body = await req.json();
    const data = await verifyPaymentSlip(body.id, body.action);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Unable to verify slip" }, { status: 400 });
  }
}
