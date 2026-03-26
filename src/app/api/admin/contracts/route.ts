import { NextResponse } from "next/server";
import { requireRole } from "@/server/services/auth.service";
import { generateContractDraft, getAdminOperations } from "@/server/services/admin.service";

export async function GET() {
  try {
    await requireRole("admin");
    const data = (await getAdminOperations()).contracts;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Unauthorized" }, { status: 401 });
  }
}

export async function POST() {
  try {
    await requireRole("admin");
    const data = await generateContractDraft();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Unable to generate contract" }, { status: 400 });
  }
}
