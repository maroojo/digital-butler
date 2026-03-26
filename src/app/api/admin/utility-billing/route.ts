import { NextResponse } from "next/server";
import { requireRole } from "@/server/services/auth.service";
import { calculateUtilityBill, getAdminOperations } from "@/server/services/admin.service";

export async function GET() {
  try {
    await requireRole("admin");
    const data = (await getAdminOperations()).utilities;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await requireRole("admin");
    const body = await req.json();
    const data = await calculateUtilityBill(body);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Unable to calculate bill" }, { status: 400 });
  }
}
