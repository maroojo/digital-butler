"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  MapPin,
  PawPrint,
  Wifi,
  Car,
  ShieldCheck,
  TrainFront,
  Landmark,
} from "lucide-react";

import { fetchDormDetail } from "@/lib/api/dorms";
import { fetchBookingQuote } from "@/lib/api/bookings";
import type { BookingQuoteResponse, DormDetail, RoomInventory } from "@/types/dorm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {
  dormId: string;
};

export function DormDetailPage({ dormId }: Props) {
  const [dorm, setDorm] = React.useState<DormDetail | null>(null);
  const [selectedRoomId, setSelectedRoomId] = React.useState<string | null>(null);
  const [quote, setQuote] = React.useState<BookingQuoteResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [loadingQuote, setLoadingQuote] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedImage, setSelectedImage] = React.useState("");

  React.useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchDormDetail(dormId);

        setDorm(data);
        setSelectedImage(data.gallery?.[0] || data.cover || "");
        setSelectedRoomId(data.roomInventories?.[0]?.id ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dorm detail");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [dormId]);

  const selectedRoom: RoomInventory | null = React.useMemo(() => {
    if (!dorm) return null;
    return dorm.roomInventories.find((room) => room.id === selectedRoomId) ?? dorm.roomInventories[0] ?? null;
  }, [dorm, selectedRoomId]);

  const handleGetQuote = async () => {
    if (!dorm || !selectedRoom) return;

    try {
      setLoadingQuote(true);
      const data = await fetchBookingQuote({
        dormId: dorm.id,
        roomInventoryId: selectedRoom.id,
      });
      setQuote(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get booking quote");
    } finally {
      setLoadingQuote(false);
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-[radial-gradient(circle_at_top,#e0f2fe_0%,#f0f9ff_40%,#ffffff_85%)] px-4 py-8 md:px-8">
        <div className="mx-auto max-w-7xl">
          <Card className="rounded-[30px] border-sky-100 bg-white">
            <CardContent className="p-8 text-slate-500">กำลังโหลดรายละเอียดหอพัก...</CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (error || !dorm) {
    return (
      <section className="min-h-screen bg-[radial-gradient(circle_at_top,#e0f2fe_0%,#f0f9ff_40%,#ffffff_85%)] px-4 py-8 md:px-8">
        <div className="mx-auto max-w-3xl">
          <Card className="rounded-[30px] border-sky-100 bg-white">
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-black text-sky-950">ไม่พบรายละเอียดหอพัก</h1>
              <p className="mt-2 text-slate-500">{error || "Dorm not found"}</p>
              <Link href="/" className="mt-6 inline-block">
                <Button className="rounded-2xl bg-sky-500 text-white hover:bg-sky-600">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  กลับไปหน้าค้นหา
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,#e0f2fe_0%,#f0f9ff_40%,#ffffff_85%)] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <Link href="/">
            <Button variant="outline" className="rounded-2xl border-sky-200 text-sky-700 hover:bg-sky-50">
              <ArrowLeft className="mr-2 h-4 w-4" />
              กลับไปหน้าค้นหา
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-white shadow-lg">
              <Image
                src={selectedImage || dorm.cover}
                alt={dorm.name}
                width={1200}
                height={420}
                className="h-105 w-full object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {dorm.gallery.map((img, index) => (
                <button
                  key={`${img}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`overflow-hidden rounded-[22px] border-2 transition ${
                    selectedImage === img ? "border-sky-500" : "border-transparent hover:border-sky-200"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Gallery ${index + 1}`}
                    width={300}
                    height={112}
                    className="h-28 w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <Card className="rounded-[32px] border-sky-200 bg-white/90">
            <CardContent className="p-6">
              <h1 className="text-3xl font-black text-sky-950">{dorm.name}</h1>

              <div className="mt-2 flex items-center gap-2 text-slate-500">
                <MapPin className="h-4 w-4 text-sky-500" />
                <span>{dorm.location}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge
                  className={
                    dorm.realTimeStatus === "available"
                      ? "bg-emerald-500 text-white hover:bg-emerald-500"
                      : "bg-rose-500 text-white hover:bg-rose-500"
                  }
                >
                  {dorm.realTimeStatus === "available" ? "ว่าง" : "เต็ม"}
                </Badge>

                {dorm.features.includes("Wifi") && (
                  <Badge className="rounded-full bg-sky-100 text-sky-700 hover:bg-sky-100">
                    <Wifi className="mr-1 h-3 w-3" />
                    Wifi
                  </Badge>
                )}

                {dorm.features.includes("ที่จอดรถ") && (
                  <Badge className="rounded-full bg-sky-100 text-sky-700 hover:bg-sky-100">
                    <Car className="mr-1 h-3 w-3" />
                    ที่จอดรถ
                  </Badge>
                )}

                {dorm.features.includes("CCTV") && (
                  <Badge className="rounded-full bg-sky-100 text-sky-700 hover:bg-sky-100">
                    <ShieldCheck className="mr-1 h-3 w-3" />
                    CCTV
                  </Badge>
                )}

                {dorm.petFriendly && (
                  <Badge className="rounded-full bg-cyan-100 text-cyan-700 hover:bg-cyan-100">
                    <PawPrint className="mr-1 h-3 w-3" />
                    เลี้ยงสัตว์ได้
                  </Badge>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {dorm.nearby.map((item) => (
                  <Badge key={item.id} variant="outline" className="rounded-full border-sky-200">
                    {item.type === "LANDMARK" ? (
                      <Landmark className="mr-1 h-3 w-3" />
                    ) : (
                      <TrainFront className="mr-1 h-3 w-3" />
                    )}
                    {item.name}
                  </Badge>
                ))}
              </div>

              <div className="mt-6 rounded-3xl bg-sky-50 p-4">
                <h3 className="font-bold text-sky-950">สรุปค่าใช้จ่าย</h3>
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <span>ค่าเช่ารายเดือน</span>
                    <span>฿{dorm.expenseSummary.monthlyRoomPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ค่าน้ำ</span>
                    <span>{dorm.expenseSummary.waterPerUnit} บาท/หน่วย</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ค่าไฟ</span>
                    <span>{dorm.expenseSummary.electricityPerUnit} บาท/หน่วย</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ค่าเน็ต</span>
                    <span>฿{dorm.expenseSummary.internetFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ค่าประกัน</span>
                    <span>฿{dorm.expenseSummary.depositAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ค่าเช่าล่วงหน้า</span>
                    <span>฿{dorm.expenseSummary.advanceAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold text-sky-700">
                    <span>ยอดคาดการณ์วันเข้าอยู่</span>
                    <span>฿{dorm.expenseSummary.estimatedMoveInTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-3xl bg-white p-4 ring-1 ring-sky-100">
                <p className="text-sm leading-7 text-slate-600">{dorm.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <Card className="rounded-[30px] border-sky-100 bg-white">
            <CardContent className="p-6">
              <h2 className="text-2xl font-black text-sky-950">รูปแบบห้อง / ห้องว่าง</h2>

              {dorm.roomInventories.length === 0 ? (
                <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-slate-500">
                  ยังไม่มีข้อมูลห้องสำหรับหอพักนี้
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  {dorm.roomInventories.map((room) => {
                    const active = room.id === selectedRoomId;

                    return (
                      <button
                        key={room.id}
                        type="button"
                        onClick={() => setSelectedRoomId(room.id)}
                        className={`w-full rounded-[28px] border p-4 text-left transition ${
                          active
                            ? "border-sky-500 bg-sky-50 shadow-md"
                            : "border-sky-100 bg-white hover:border-sky-200"
                        }`}
                      >
                        <div className="grid gap-4 md:grid-cols-[160px_1fr_auto] md:items-center">
                          <Image
                            src={room.image}
                            alt={room.roomTypeName}
                            width={160}
                            height={128}
                            className="h-32 w-full rounded-2xl object-cover"
                          />

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-black text-sky-950">{room.roomTypeName}</h3>
                              <Badge
                                className={
                                  room.status === "available"
                                    ? "bg-emerald-500 text-white hover:bg-emerald-500"
                                    : "bg-rose-500 text-white hover:bg-rose-500"
                                }
                              >
                                {room.status === "available" ? `ว่าง ${room.availableCount} ห้อง` : "เต็ม"}
                              </Badge>
                            </div>

                            <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-500">
                              <span className="rounded-full bg-white px-3 py-1 shadow-sm">
                                {room.sizeSqm} ตร.ม.
                              </span>

                              {room.furniture.map((f) => (
                                <span
                                  key={f}
                                  className="rounded-full bg-white px-3 py-1 shadow-sm"
                                >
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="text-left md:text-right">
                            <p className="text-2xl font-black text-sky-600">
                              ฿{room.monthlyPrice.toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-500">/ เดือน</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="sticky top-6 h-fit rounded-[30px] border-sky-200 bg-white shadow-lg">
            <CardContent className="p-6">
              {!selectedRoom ? (
                <div className="text-slate-500">ยังไม่มีห้องให้เลือก</div>
              ) : (
                <>
                  <h3 className="text-2xl font-black text-sky-950">{selectedRoom.roomTypeName}</h3>

                  <div className="mt-4 space-y-2 text-sm text-slate-700">
                    <div className="flex justify-between">
                      <span>ขนาดห้อง</span>
                      <span>{selectedRoom.sizeSqm} ตร.ม.</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ราคา/เดือน</span>
                      <span>฿{selectedRoom.monthlyPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ค่าประกัน</span>
                      <span>฿{selectedRoom.depositAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ค่าเช่าล่วงหน้า</span>
                      <span>฿{selectedRoom.advanceAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button
                    className="mt-6 h-12 w-full rounded-2xl bg-sky-500 text-white hover:bg-sky-600"
                    disabled={selectedRoom.status !== "available" || loadingQuote}
                    onClick={handleGetQuote}
                  >
                    {loadingQuote ? "กำลังสรุปยอด..." : "จอง"}
                  </Button>

                  {quote && (
                    <div className="mt-6 rounded-3xl border border-sky-100 bg-sky-50 p-4">
                      <h4 className="font-bold text-sky-950">QR Code ชำระเงิน</h4>

                      <div className="mt-4 flex justify-center">
                        <QRCodeSVG value={quote.qrCodeValue} size={180} />
                      </div>

                      <div className="mt-4 space-y-2 text-sm text-slate-700">
                        <div className="flex justify-between">
                          <span>ค่าประกัน</span>
                          <span>฿{quote.depositAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ค่าเช่าล่วงหน้า</span>
                          <span>฿{quote.advanceAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ค่าจอง</span>
                          <span>฿{quote.bookingFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2 font-bold text-sky-700">
                          <span>ยอดรวม</span>
                          <span>฿{quote.totalDue.toLocaleString()}</span>
                        </div>
                      </div>

                      <p className="mt-3 text-xs text-slate-500">
                        QR หมดอายุ: {new Date(quote.expiresAt).toLocaleString("th-TH")}
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}