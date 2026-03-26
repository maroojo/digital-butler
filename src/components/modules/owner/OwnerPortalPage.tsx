"use client";

import * as React from "react";
import {
  BarChart3,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  FileSpreadsheet,
  FileText,
  Home,
  TriangleAlert,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PortalLoginCard } from "@/components/modules/portal/PortalLoginCard";
import { PortalTopBar } from "@/components/modules/portal/PortalTopBar";
import { fetchMe, loginPortal, logoutPortal } from "@/lib/api/auth";
import { approveOwnerRepair, fetchOwnerDashboard } from "@/lib/api/owner";
import type { AuthRole, AuthUser, OwnerDashboardData, OwnerRoomStatus } from "@/types/portal";

function roomStatusClass(status: OwnerRoomStatus) {
  if (status === "vacant") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "overdue") return "border-rose-200 bg-rose-50 text-rose-700";
  return "border-sky-200 bg-sky-50 text-sky-700";
}

function bookingBadgeClass(status: string) {
  if (status === "new") return "bg-amber-100 text-amber-700 hover:bg-amber-100";
  if (status === "deposit_pending") return "bg-rose-100 text-rose-700 hover:bg-rose-100";
  return "bg-sky-100 text-sky-700 hover:bg-sky-100";
}

export function OwnerPortalPage() {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [data, setData] = React.useState<OwnerDashboardData | null>(null);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    const dashboard = await fetchOwnerDashboard();
    setData(dashboard);
  }, []);

  React.useEffect(() => {
    (async () => {
      try {
        const me = await fetchMe();
        if (me.role === "owner") {
          setUser(me);
          await load();
        }
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, [load]);

  const handleLogin = async (payload: { username: string; password: string; role: AuthRole }) => {
    try {
      setError("");
      setLoading(true);
      const me = await loginPortal(payload);
      if (me.role !== "owner") throw new Error("This account is not owner role");
      setUser(me);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    await approveOwnerRepair(id);
    await load();
  };

  const handleLogout = async () => {
    await logoutPortal();
    setUser(null);
    setData(null);
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,#e0f2fe_0%,#f8fbff_35%,#ffffff_75%)] px-4 py-10 md:px-8">
        <PortalLoginCard role="owner" onSubmit={handleLogin} loading={loading} error={error} />
      </main>
    );
  }

  if (!data) {
    return <main className="min-h-screen bg-slate-50 p-10">Loading owner dashboard...</main>;
  }

  const maxRevenue = Math.max(...data.analytics.map((item) => item.revenue));

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#e0f2fe_0%,#f8fbff_35%,#ffffff_75%)] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <PortalTopBar
          user={user}
          title="Owner Operations"
          subtitle="ดูแลห้องพักของตัวเอง ติดตาม booking ห้องว่าง ค้างชำระ และอนุมัติงานซ่อม"
          onLogout={handleLogout}
        />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            { icon: CircleDollarSign, label: "รายได้รวมต่อเดือน", value: `${data.summary.totalRevenue.toLocaleString()} บาท` },
            { icon: Home, label: "ห้องว่าง", value: `${data.summary.vacantRooms} / ${data.summary.totalRooms} ห้อง` },
            { icon: TriangleAlert, label: "ยอดค้างชำระ", value: `${data.summary.overdueAmount.toLocaleString()} บาท` },
            { icon: Users, label: "จองใหม่จากหน้าเว็บ", value: `${data.summary.pendingBookings} รายการ` },
            { icon: CalendarClock, label: "สัญญาใกล้ครบ/รอเซ็น", value: `${data.summary.renewalDueCount} รายการ` },
          ].map((item) => (
            <Card key={item.label} className="rounded-[28px] border-sky-100 bg-white/95 shadow-sm">
              <CardContent className="flex items-start justify-between p-6">
                <div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <h2 className="mt-2 text-2xl font-black text-sky-950">{item.value}</h2>
                </div>
                <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                  <item.icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
          <Card className="rounded-[28px] border-sky-100 bg-white/95">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-sky-950">Real-time Analytics</h2>
                  <p className="text-sm text-slate-500">รายได้และ occupancy ของหอที่ owner ดูแล</p>
                </div>
                <BarChart3 className="h-5 w-5 text-sky-600" />
              </div>
              <div className="grid gap-4 md:grid-cols-6">
                {data.analytics.map((item) => (
                  <div key={item.label} className="space-y-3 rounded-2xl border border-sky-100 p-4">
                    <div className="flex h-40 items-end rounded-2xl bg-sky-50 p-2">
                      <div className="w-full rounded-xl bg-sky-500" style={{ height: `${Math.max(12, (item.revenue / maxRevenue) * 100)}%` }} />
                    </div>
                    <div>
                      <p className="font-bold text-sky-950">{item.label}</p>
                      <p className="text-sm text-slate-500">{item.revenue.toLocaleString()} บาท</p>
                      <p className="text-xs text-slate-400">Occupancy {item.occupancyRate}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-sky-100 bg-white/95">
            <CardContent className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-sky-950">Exportable Reports</h2>
                  <p className="text-sm text-slate-500">ดาวน์โหลดสรุปรายรับ-รายจ่ายและรายงานบัญชีได้ทันที</p>
                </div>
              </div>
              <div className="space-y-3">
                <a href="/api/owner/reports/export?format=csv" className="block">
                  <Button className="h-11 w-full rounded-2xl bg-sky-500 text-white hover:bg-sky-600">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    ดาวน์โหลดรายงานบัญชี (CSV / Excel)
                  </Button>
                </a>
                <a href="/api/owner/reports/export?format=pdf" className="block">
                  <Button variant="outline" className="h-11 w-full rounded-2xl border-sky-200">
                    <FileText className="mr-2 h-4 w-4" />
                    ดาวน์โหลดสรุปรายรับ-รายจ่าย (PDF)
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="rounded-[28px] border-sky-100 bg-white/95">
            <CardContent className="p-6">
              <div className="mb-5">
                <h2 className="text-xl font-black text-sky-950">Visual Room Grid</h2>
                <p className="text-sm text-slate-500">ดูสถานะห้อง ว่าง / ผู้เช่าอยู่ / ค้างชำระ แบบเห็นภาพทันที</p>
              </div>
              <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-4">
                {data.rooms.map((room) => (
                  <div key={room.id} className={`rounded-2xl border p-4 ${roomStatusClass(room.status)}`}>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-black">ห้อง {room.roomNo}</p>
                      <Badge className="rounded-full bg-white/80 text-current hover:bg-white/80">ชั้น {room.floor}</Badge>
                    </div>
                    <p className="mt-3 text-sm">{room.tenantName || "ยังไม่มีผู้เช่า"}</p>
                    <p className="mt-1 text-xs opacity-80">ค่าเช่า {room.monthlyRent.toLocaleString()} บาท</p>
                    <p className="mt-1 text-xs opacity-80">ค้างชำระ {room.balanceDue.toLocaleString()} บาท</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-sky-100 bg-white/95">
            <CardContent className="p-6">
              <div className="mb-5">
                <h2 className="text-xl font-black text-sky-950">Website Booking Queue</h2>
                <p className="text-sm text-slate-500">ลูกค้าที่กดจองเข้ามาจากหน้าเว็บ / LINE OA รอ owner ติดตามต่อ</p>
              </div>
              <div className="space-y-3">
                {data.bookings.map((booking) => (
                  <div key={booking.id} className="rounded-2xl border border-sky-100 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-sky-950">{booking.customerName} · {booking.roomType}</p>
                        <p className="text-sm text-slate-500">{booking.dormName} · ย้ายเข้า {booking.preferredMoveIn}</p>
                      </div>
                      <Badge className={`rounded-full ${bookingBadgeClass(booking.status)}`}>{booking.status}</Badge>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">งบประมาณ {booking.budget.toLocaleString()} บาท · Source {booking.source}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="rounded-[28px] border-sky-100 bg-white/95">
            <CardContent className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-sky-950">Contract & Tenant Follow-up</h2>
                  <p className="text-sm text-slate-500">ดูรายการสัญญาใกล้ครบ รอเซ็น หรือยังมียอดค้างชำระ</p>
                </div>
                <ClipboardCheck className="h-5 w-5 text-sky-600" />
              </div>
              <div className="space-y-3">
                {data.contracts.map((contract) => (
                  <div key={contract.id} className="rounded-2xl border border-sky-100 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-sky-950">{contract.tenantName} · ห้อง {contract.roomNo}</p>
                        <p className="text-sm text-slate-500">{contract.dormName} · สิ้นสุด {contract.endDate}</p>
                      </div>
                      <Badge className="rounded-full bg-sky-100 text-sky-700 hover:bg-sky-100">{contract.status}</Badge>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">ยอดค้างชำระ {contract.balanceDue.toLocaleString()} บาท</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-sky-100 bg-white/95">
            <CardContent className="p-6">
              <div className="mb-5">
                <h2 className="text-xl font-black text-sky-950">Repair Approval Workflow</h2>
                <p className="text-sm text-slate-500">ดูรูปแจ้งซ่อม อนุมัติงบ และตามงานของหอที่ owner ดูแล</p>
              </div>
              <div className="space-y-4">
                {data.repairs.map((repair) => (
                  <div key={repair.id} className="rounded-2xl border border-sky-100 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-sky-950">{repair.title} · ห้อง {repair.roomNo}</p>
                        <p className="text-sm text-slate-500">{repair.requestedBy} · งบประมาณ {repair.estimatedBudget.toLocaleString()} บาท</p>
                      </div>
                      <Badge className="rounded-full bg-sky-100 text-sky-700 hover:bg-sky-100">{repair.status}</Badge>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">{repair.description}</p>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {repair.imageUrls.map((url) => (
                        <img key={url} src={url} alt={repair.title} className="h-20 w-full rounded-2xl object-cover" />
                      ))}
                    </div>
                    <Button
                      disabled={repair.status !== "pending"}
                      onClick={() => handleApprove(repair.id)}
                      className="mt-4 w-full rounded-2xl bg-sky-500 text-white hover:bg-sky-600"
                    >
                      {repair.status === "pending" ? "อนุมัติงบประมาณ" : "อัปเดตแล้ว"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
