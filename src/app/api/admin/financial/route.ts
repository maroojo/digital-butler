import { NextResponse } from "next/server";
import { requireRole } from "@/server/services/auth.service";
import { getAdminOperations } from "@/server/services/admin.service";

export async function GET() {
  try {
    await requireRole("admin");
    const data = await getAdminOperations();
    return NextResponse.json({
      success: true,
      data: {
        pendingSlips: data.pendingSlips,
        paymentHistory: data.paymentHistory,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Unauthorized" }, { status: 401 });
  }
}
