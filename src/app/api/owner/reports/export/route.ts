import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/server/services/auth.service";
import { getOwnerDashboard } from "@/server/services/owner.service";
import { createSimplePdf } from "@/server/utils/pdf";

export async function GET(req: NextRequest) {
  try {
    await requireRole("owner");
    const format = req.nextUrl.searchParams.get("format") || "csv";
    const data = await getOwnerDashboard();

    if (format === "pdf") {
      const lines = [
        `Total Revenue: ${data.summary.totalRevenue} THB`,
        `Vacant Rooms: ${data.summary.vacantRooms}`,
        `Overdue Amount: ${data.summary.overdueAmount} THB`,
        ...data.analytics.map((item) => `${item.label}: revenue ${item.revenue} THB / occupancy ${item.occupancyRate}%`),
      ];
      const pdf = createSimplePdf("Owner Accounting Summary", lines);
      return new NextResponse(pdf, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="owner-summary.pdf"',
        },
      });
    }

    const rows = [
      ["month", "revenue", "occupancyRate"],
      ...data.analytics.map((item) => [item.label, String(item.revenue), String(item.occupancyRate)]),
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="owner-summary.csv"',
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Unauthorized" }, { status: 401 });
  }
}
