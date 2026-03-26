import { NextResponse } from "next/server";
import { requireRole } from "@/server/services/auth.service";
import { getOwnerDashboard } from "@/server/services/owner.service";

export async function GET() {
  try {
    await requireRole("owner");
    const data = await getOwnerDashboard();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Unauthorized" }, { status: 401 });
  }
}
