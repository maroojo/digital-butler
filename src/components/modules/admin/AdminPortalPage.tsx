"use client";

import * as React from "react";
import {
  Building2,
  ClipboardList,
  FileCheck2,
  ReceiptText,
  ShieldCheck,
  Users,
  WalletCards,
  Wrench,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PortalLoginCard } from "@/components/modules/portal/PortalLoginCard";
import { PortalTopBar } from "@/components/modules/portal/PortalTopBar";
import { fetchMe, loginPortal, logoutPortal } from "@/lib/api/auth";
import { calculateUtility, createDraftContract, fetchAdminOverview, verifySlip } from "@/lib/api/admin";
import type { AdminOperationsData, AuthRole, AuthUser } from "@/types/portal";

export function AdminPortalPage() {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [data, setData] = React.useState<AdminOperationsData | null>(null);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [billingForm, setBillingForm] = React.useState({ roomNo: "101", currentWater: 136, currentElectric: 2245 });

  const load = React.useCallback(async () => {
    const overview = await fetchAdminOverview();
    setData(overview);
  }, []);

  React.useEffect(() => {
    (async () => {
      try {
        const me = await fetchMe();
        if (me.role === "admin") {
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
      if (me.role !== "admin") throw new Error("This account is not admin role");
      setUser(me);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutPortal();
    setUser(null);
    setData(null);
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,#e0f2fe_0%,#f8fbff_35%,#ffffff_75%)] px-4 py-10 md:px-8">
        <PortalLoginCard role="admin" onSubmit={handleLogin} loading={loading} error={error} />
      </main>
    );
  }

  if (!data) {
    return <main className="min-h-screen bg-slate-50 p-10">Loading admin system...</main>;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#e0f2fe_0%,#f8fbff_35%,#ffffff_75%)] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <PortalTopBar
          user={user}
          title="Admin Operations"
          subtitle="จัดการ owner tenant bookings กลาง ระบบสัญญา บิลค่าน้ำไฟ งานซ่อม และการเงิน"
          onLogout={handleLogout}
        />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {[
            { icon: Building2, label: "หอพักในระบบ", value: `${data.summary.totalDorms} แห่ง` },
            { icon: Users, label: "เจ้าของหอ", value: `${data.summary.totalOwners} ราย` },
            { icon: ShieldCheck, label: "ผู้เช่า active", value: `${data.summary.activeTenants} คน` },
            { icon: ClipboardList, label: "จองรอดำเนินการ", value: `${data.summary.pendingBookings} รายการ` },
            { icon: Wrench, label: "แจ้งซ่อมค้าง", value: `${data.summary.openRepairs} งาน` },
            { icon: WalletCards, label: "มูลค่ารวมต่อเดือน", value: `${data.summary.monthlyGmv.toLocaleString()} บาท` },
          ].map((item) => (
            <Card key={item.label} className="rounded-[28px] border-sky-100 bg-white/95 shadow-sm">
              <CardContent className="flex items-start justify-between p-5">
                <div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <h2 className="mt-2 text-xl font-black text-sky-950">{item.value}</h2>
                </div>
                <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                  <item.icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Card className="rounded-[28px] border-sky-100 bg-white/95">
            <CardContent className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-sky-950">Central Booking Queue</h2>
                  <p className="text-sm text-slate-500">รายการจองจากหน้า website / LINE OA ก่อนส่งต่อให้ owner หรือทีม leasing</p>
                </div>
                <ClipboardList className="h-5 w-5 text-sky-600" />
              </div>
              <div className="space-y-3">
                {data.bookings.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-sky-100 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-sky-950">{item.customerName} · {item.requestedRoomType}</p>
                        <p className="text-sm text-slate-500">{item.dormName} · owner {item.ownerName}</p>
                      </div>
                      <Badge className="rounded-full bg-sky-100 text-sky-700 hover:bg-sky-100">{item.status}</Badge>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">ย้ายเข้า {item.preferredMoveIn} · Source {item.source}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-sky-100 bg-white/95">
            <CardContent className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-sky-950">Repair Dispatch Overview</h2>
                  <p className="text-sm text-slate-500">มุมมองกลางของงานแจ้งซ่อมจากหลายหอพัก เพื่อประสาน owner และทีมซ่อม</p>
                </div>
                <Wrench className="h-5 w-5 text-sky-600" />
              </div>
              <div className="space-y-3">
                {data.repairs.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-sky-100 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-sky-950">{item.title} · ห้อง {item.roomNo}</p>
                        <p className="text-sm text-slate-500">{item.dormName} · owner {item.ownerName}</p>
                      </div>
                      <Badge className="rounded-full bg-sky-100 text-sky-700 hover:bg-sky-100">{item.status}</Badge>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">งบประมาณ {item.budget.toLocaleString()} บาท · แจ้งเมื่อ {item.createdAt}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Card className="rounded-[28px] border-sky-100 bg-white/95">
            <CardContent className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-sky-950">Leasing Management</h2>
                  <p className="text-sm text-slate-500">ตรวจเอกสารผู้เช่าและ move-in checklist แบบหลายหอพัก</p>
                </div>
                <ClipboardList className="h-5 w-5 text-sky-600" />
              </div>
              <div className="space-y-3">
                {data.leasing.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-sky-100 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-sky-950">{item.tenantName} · ห้อง {item.roomNo}</p>
                        <p className="text-sm text-slate-500">{item.dormName} · owner {item.ownerName}</p>
                      </div>
                      <Badge className="rounded-full bg-sky-100 text-sky-700 hover:bg-sky-100">{item.documentStatus}</Badge>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">เอกสาร: {item.documents.join(", ")}</p>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-sky-500" style={{ width: `${item.checklistCompletion}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">Move-in checklist {item.checklistCompletion}%</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-sky-100 bg-white/95">
            <CardContent className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-sky-950">E-Contract System</h2>
                  <p className="text-sm text-slate-500">สร้างและติดตามสัญญาเช่าแบบอิเล็กทรอนิกส์ข้ามหลาย owner</p>
                </div>
                <FileCheck2 className="h-5 w-5 text-sky-600" />
              </div>
              <Button
                onClick={async () => {
                  await createDraftContract();
                  await load();
                }}
                className="mb-4 rounded-2xl bg-sky-500 text-white hover:bg-sky-600"
              >
                สร้าง draft contract ใหม่
              </Button>
              <div className="space-y-3">
                {data.contracts.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-sky-100 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-sky-950">{item.tenantName} · ห้อง {item.roomNo}</p>
                        <p className="text-sm text-slate-500">{item.dormName} · owner {item.ownerName}</p>
                      </div>
                      <Badge className="rounded-full bg-sky-100 text-sky-700 hover:bg-sky-100">{item.status}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{item.leaseTerm} · {item.rentAmount.toLocaleString()} บาท/เดือน</p>
                    <p className="mt-1 text-xs text-slate-400">อัปเดตล่าสุด {item.lastUpdated}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Card className="rounded-[28px] border-sky-100 bg-white/95">
            <CardContent className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-sky-950">Utility Billing</h2>
                  <p className="text-sm text-slate-500">บันทึกมิเตอร์น้ำ-ไฟและคำนวณยอด back-office</p>
                </div>
                <ReceiptText className="h-5 w-5 text-sky-600" />
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <Input value={billingForm.roomNo} onChange={(e) => setBillingForm((prev) => ({ ...prev, roomNo: e.target.value }))} placeholder="Room No" className="rounded-2xl" />
                <Input type="number" value={billingForm.currentWater} onChange={(e) => setBillingForm((prev) => ({ ...prev, currentWater: Number(e.target.value) }))} placeholder="Current Water" className="rounded-2xl" />
                <Input type="number" value={billingForm.currentElectric} onChange={(e) => setBillingForm((prev) => ({ ...prev, currentElectric: Number(e.target.value) }))} placeholder="Current Electric" className="rounded-2xl" />
              </div>
              <Button
                className="mt-4 rounded-2xl bg-sky-500 text-white hover:bg-sky-600"
                onClick={async () => {
                  await calculateUtility(billingForm);
                  await load();
                }}
              >
                คำนวณบิลใหม่
              </Button>
              <div className="mt-5 space-y-3">
                {data.utilities.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-sky-100 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-sky-950">{item.dormName} · ห้อง {item.roomNo}</p>
                        <p className="text-sm text-slate-500">{item.tenantName} · owner {item.ownerName}</p>
                      </div>
                      <Badge className="rounded-full bg-sky-100 text-sky-700 hover:bg-sky-100">{item.totalAmount.toLocaleString()} บาท</Badge>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">น้ำ {item.previousWater} → {item.currentWater} | ไฟ {item.previousElectric} → {item.currentElectric}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-sky-100 bg-white/95">
            <CardContent className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-sky-950">Financial Tracking</h2>
                  <p className="text-sm text-slate-500">ตรวจสลิปโอนเงินแบบ manual / auto และบันทึกประวัติการจ่าย</p>
                </div>
                <WalletCards className="h-5 w-5 text-sky-600" />
              </div>

              <div className="space-y-3">
                {data.pendingSlips.map((slip) => (
                  <div key={slip.id} className="rounded-2xl border border-sky-100 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-sky-950">{slip.tenantName} · ห้อง {slip.roomNo}</p>
                        <p className="text-sm text-slate-500">{slip.dormName} · {slip.bankReference}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className="rounded-full bg-slate-100 text-slate-700 hover:bg-slate-100">{slip.method}</Badge>
                        <Badge className="rounded-full bg-sky-100 text-sky-700 hover:bg-sky-100">{slip.status}</Badge>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">owner {slip.ownerName} · {slip.amount.toLocaleString()} บาท</p>
                    <div className="mt-4 flex gap-2">
                      <Button className="rounded-2xl bg-sky-500 text-white hover:bg-sky-600" onClick={async () => { await verifySlip(slip.id, "verified"); await load(); }}>
                        Verify
                      </Button>
                      <Button variant="outline" className="rounded-2xl border-rose-200 text-rose-600 hover:bg-rose-50" onClick={async () => { await verifySlip(slip.id, "rejected"); await load(); }}>
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-sky-100 p-4">
                <h3 className="font-bold text-sky-950">Payment History</h3>
                <div className="mt-3 space-y-2">
                  {data.paymentHistory.slice(0, 4).map((item) => (
                    <div key={item.id} className="rounded-2xl bg-sky-50 px-3 py-2 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span>{item.tenantName} · ห้อง {item.roomNo}</span>
                        <span>{item.amount.toLocaleString()} บาท</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{item.dormName} · owner {item.ownerName}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
