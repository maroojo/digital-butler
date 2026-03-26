import { NextResponse } from "next/server";
import { requireRole } from "@/server/services/auth.service";
import { approveRepairBudget } from "@/server/services/owner.service";

export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("owner");
    const { id } = await context.params;
    const data = await approveRepairBudget(id);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Unable to approve repair" }, { status: 400 });
  }
}
