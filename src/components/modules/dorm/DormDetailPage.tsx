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
  X,
  CalendarDays,
  Phone,
  UserRound,
  ReceiptText,
  UploadCloud,
} from "lucide-react";

import { fetchDormDetail } from "@/lib/api/dorms";
import { createBookingRequestApi, fetchBookingQuote } from "@/lib/api/bookings";
import type {
  BookingQuoteResponse,
  CreateBookingResponse,
  DormDetail,
  RoomInventory,
} from "@/types/dorm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type Props = {
  dormId: string;
};

type BookingFormState = {
  tenantName: string;
  tenantPhone: string;
  moveInDate: string;
  note: string;
  slipFileName: string;
  slipBase64: string;
};

const initialBookingForm: BookingFormState = {
  tenantName: "",
  tenantPhone: "",
  moveInDate: "",
  note: "",
  slipFileName: "",
  slipBase64: "",
};

export function DormDetailPage({ dormId }: Props) {
  const [dorm, setDorm] = React.useState<DormDetail | null>(null);
  const [selectedRoomId, setSelectedRoomId] = React.useState<string | null>(
    null,
  );
  const [quote, setQuote] = React.useState<BookingQuoteResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [loadingQuote, setLoadingQuote] = React.useState(false);
  const [submittingBooking, setSubmittingBooking] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedImage, setSelectedImage] = React.useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = React.useState(false);
  const [bookingForm, setBookingForm] =
    React.useState<BookingFormState>(initialBookingForm);
  const [bookingResult, setBookingResult] =
    React.useState<CreateBookingResponse | null>(null);

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
        setError(
          err instanceof Error ? err.message : "Failed to load dorm detail",
        );
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [dormId]);

  const selectedRoom: RoomInventory | null = React.useMemo(() => {
    if (!dorm) return null;
    return (
      dorm.roomInventories.find((room) => room.id === selectedRoomId) ??
      dorm.roomInventories[0] ??
      null
    );
  }, [dorm, selectedRoomId]);

  const resetBookingFlow = React.useCallback(() => {
    setQuote(null);
    setBookingForm(initialBookingForm);
    setBookingResult(null);
  }, []);

  const openBookingModal = React.useCallback(() => {
    setError(null);
    resetBookingFlow();
    setIsBookingModalOpen(true);
  }, [resetBookingFlow]);

  const closeBookingModal = React.useCallback(() => {
    setIsBookingModalOpen(false);
    resetBookingFlow();
  }, [resetBookingFlow]);

  const handleBookingInputChange =
    (field: keyof BookingFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setBookingForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSlipUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("กรุณาอัปโหลดไฟล์รูปภาพสลิปเท่านั้น");
      return;
    }

    const toBase64 = (inputFile: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(inputFile);
      });

    try {
      setError(null);
      const base64 = await toBase64(file);
      setBookingForm((prev) => ({
        ...prev,
        slipFileName: file.name,
        slipBase64: base64,
      }));
    } catch {
      setError("ไม่สามารถอ่านไฟล์สลิปได้");
    }
  };

  const handlePrepareBooking = async () => {
    if (!dorm || !selectedRoom) return;

    if (!bookingForm.tenantName.trim()) {
      setError("กรุณากรอกชื่อผู้จอง");
      return;
    }

    if (!bookingForm.tenantPhone.trim()) {
      setError("กรุณากรอกเบอร์โทร");
      return;
    }

    if (!bookingForm.moveInDate.trim()) {
      setError("กรุณาเลือกวันย้ายเข้า");
      return;
    }

    try {
      setError(null);
      setLoadingQuote(true);

      const data = await fetchBookingQuote({
        dormId: dorm.id,
        roomInventoryId: selectedRoom.id,
      });

      setQuote(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to get booking quote",
      );
    } finally {
      setLoadingQuote(false);
    }
  };

  const handleSubmitBooking = async () => {
    if (!dorm || !selectedRoom || !quote) return;

    if (!bookingForm.slipBase64 || !bookingForm.slipFileName) {
      setError("กรุณาแนบสลิปการโอนเงินจอง");
      return;
    }

    try {
      setError(null);
      setSubmittingBooking(true);

      const result = await createBookingRequestApi({
        dormId: dorm.id,
        roomInventoryId: selectedRoom.id,
        tenantName: bookingForm.tenantName.trim(),
        tenantPhone: bookingForm.tenantPhone.trim(),
        moveInDate: bookingForm.moveInDate,
        note: bookingForm.note.trim(),
        slipFileName: bookingForm.slipFileName,
        slipBase64: bookingForm.slipBase64,
      });

      setBookingResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create booking");
    } finally {
      setSubmittingBooking(false);
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-[radial-gradient(circle_at_top,#e0f2fe_0%,#f0f9ff_40%,#ffffff_85%)] px-4 py-8 md:px-8">
        <div className="mx-auto max-w-7xl">
          <Card className="rounded-[30px] border-sky-100 bg-white">
            <CardContent className="p-8 text-slate-500">
              กำลังโหลดรายละเอียดหอพัก...
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (error && !dorm) {
    return (
      <section className="min-h-screen bg-[radial-gradient(circle_at_top,#e0f2fe_0%,#f0f9ff_40%,#ffffff_85%)] px-4 py-8 md:px-8">
        <div className="mx-auto max-w-3xl">
          <Card className="rounded-[30px] border-sky-100 bg-white">
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-black text-sky-950">
                ไม่พบรายละเอียดหอพัก
              </h1>
              <p className="mt-2 text-slate-500">{error}</p>
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

  if (!dorm) return null;

  return (
    <>
      <section className="min-h-screen bg-[radial-gradient(circle_at_top,#e0f2fe_0%,#f0f9ff_40%,#ffffff_85%)] px-4 py-8 md:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div>
            <Link href="/">
              <Button
                variant="outline"
                className="rounded-2xl border-sky-200 text-sky-700 hover:bg-sky-50"
              >
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
                      selectedImage === img
                        ? "border-sky-500"
                        : "border-transparent hover:border-sky-200"
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
                <h1 className="text-3xl font-black text-sky-950">
                  {dorm.name}
                </h1>

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
                    <Badge
                      key={item.id}
                      variant="outline"
                      className="rounded-full border-sky-200"
                    >
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
                      <span>
                        ฿{dorm.expenseSummary.monthlyRoomPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>ค่าน้ำ</span>
                      <span>{dorm.expenseSummary.waterPerUnit} บาท/หน่วย</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ค่าไฟ</span>
                      <span>
                        {dorm.expenseSummary.electricityPerUnit} บาท/หน่วย
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>ค่าเน็ต</span>
                      <span>
                        ฿{dorm.expenseSummary.internetFee.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>ค่าประกัน</span>
                      <span>
                        ฿{dorm.expenseSummary.depositAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>ค่าเช่าล่วงหน้า</span>
                      <span>
                        ฿{dorm.expenseSummary.advanceAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold text-sky-700">
                      <span>ยอดคาดการณ์วันเข้าอยู่</span>
                      <span>
                        ฿
                        {dorm.expenseSummary.estimatedMoveInTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl bg-white p-4 ring-1 ring-sky-100">
                  <p className="text-sm leading-7 text-slate-600">
                    {dorm.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <Card className="rounded-[30px] border-sky-100 bg-white">
              <CardContent className="p-6">
                <h2 className="text-2xl font-black text-sky-950">
                  รูปแบบห้อง / ห้องว่าง
                </h2>

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
                                <h3 className="text-lg font-black text-sky-950">
                                  {room.roomTypeName}
                                </h3>
                                <Badge
                                  className={
                                    room.status === "available"
                                      ? "bg-emerald-500 text-white hover:bg-emerald-500"
                                      : "bg-rose-500 text-white hover:bg-rose-500"
                                  }
                                >
                                  {room.status === "available"
                                    ? `ว่าง ${room.availableCount} ห้อง`
                                    : "เต็ม"}
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
                    <h3 className="text-2xl font-black text-sky-950">
                      {selectedRoom.roomTypeName}
                    </h3>

                    <div className="mt-4 space-y-2 text-sm text-slate-700">
                      <div className="flex justify-between">
                        <span>ขนาดห้อง</span>
                        <span>{selectedRoom.sizeSqm} ตร.ม.</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ราคา/เดือน</span>
                        <span>
                          ฿{selectedRoom.monthlyPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>ค่าประกัน</span>
                        <span>
                          ฿{selectedRoom.depositAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>ค่าเช่าล่วงหน้า</span>
                        <span>
                          ฿{selectedRoom.advanceAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Button className="w-full h-6 rounded-2xl bg-sky-500 text-white hover:bg-sky-600 mt-8">
                      <Link href="/chat" className="w-full h-full">แชตสอบถามแอดมิน</Link>
                    </Button>

                    <Button
                      className="mt-6 h-12 w-full rounded-2xl bg-sky-500 text-white hover:bg-sky-600"
                      disabled={selectedRoom.status !== "available"}
                      onClick={openBookingModal}
                    >
                      จองห้องนี้
                    </Button>

                    <p className="mt-3 text-xs leading-6 text-slate-500">
                      เมื่อกดจอง ระบบจะเปิดฟอร์มให้กรอกข้อมูลผู้เช่า
                      เลือกวันย้ายเข้า แสดง QR Code และอัปโหลดสลิปการโอนเงินจอง
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {isBookingModalOpen && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[32px] bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-5 backdrop-blur">
              <div>
                <h3 className="text-2xl font-black text-sky-950">จองห้องพัก</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {dorm.name} • {selectedRoom.roomTypeName}
                </p>
              </div>

              <button
                type="button"
                onClick={closeBookingModal}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-6 p-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-6">
                <div className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm">
                  <h4 className="text-lg font-black text-sky-950">
                    รายละเอียดห้องที่เลือก
                  </h4>

                  <div className="mt-4 grid gap-4 md:grid-cols-[120px_1fr]">
                    <Image
                      src={selectedRoom.image}
                      alt={selectedRoom.roomTypeName}
                      width={120}
                      height={96}
                      className="h-28 w-full rounded-2xl object-cover"
                    />

                    <div className="space-y-2 text-sm text-slate-700">
                      <div className="flex justify-between gap-4">
                        <span>ประเภทห้อง</span>
                        <span className="font-semibold text-slate-900">
                          {selectedRoom.roomTypeName}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>ขนาด</span>
                        <span className="font-semibold text-slate-900">
                          {selectedRoom.sizeSqm} ตร.ม.
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>ค่าเช่ารายเดือน</span>
                        <span className="font-semibold text-slate-900">
                          ฿{selectedRoom.monthlyPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>ค่าประกัน</span>
                        <span className="font-semibold text-slate-900">
                          ฿{selectedRoom.depositAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>ค่าเช่าล่วงหน้า</span>
                        <span className="font-semibold text-slate-900">
                          ฿{selectedRoom.advanceAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-[28px] border border-sky-100 bg-sky-50 p-5">
                  <h4 className="text-lg font-black text-sky-950">
                    ข้อมูลผู้จอง
                  </h4>

                  <div className="mt-4 grid gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        ชื่อ - นามสกุล
                      </label>
                      <div className="relative">
                        <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          value={bookingForm.tenantName}
                          onChange={handleBookingInputChange("tenantName")}
                          placeholder="เช่น รณกร บัวผึ้ง"
                          className="h-11 rounded-2xl border-slate-200 pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        เบอร์โทรศัพท์
                      </label>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          value={bookingForm.tenantPhone}
                          onChange={handleBookingInputChange("tenantPhone")}
                          placeholder="08x-xxx-xxxx"
                          className="h-11 rounded-2xl border-slate-200 pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        วันที่ต้องการย้ายเข้า
                      </label>
                      <div className="relative">
                        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          type="date"
                          value={bookingForm.moveInDate}
                          onChange={handleBookingInputChange("moveInDate")}
                          className="h-11 rounded-2xl border-slate-200 pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        หมายเหตุเพิ่มเติม
                      </label>
                      <textarea
                        value={bookingForm.note}
                        onChange={handleBookingInputChange("note")}
                        placeholder="เช่น สะดวกย้ายเข้าช่วงต้นเดือน / ขอห้องชั้นล่าง"
                        className="min-h-[110px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-300"
                      />
                    </div>
                  </div>
                </div>

                {!quote && (
                  <Button
                    onClick={handlePrepareBooking}
                    disabled={loadingQuote}
                    className="h-12 w-full rounded-2xl bg-sky-500 text-white hover:bg-sky-600"
                  >
                    {loadingQuote
                      ? "กำลังสร้างรายการจอง..."
                      : "ถัดไป: ดู QR และแนบสลิป"}
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                <div className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm">
                  <h4 className="text-lg font-black text-sky-950">
                    ชำระเงินจอง
                  </h4>

                  {!quote ? (
                    <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                      กรอกข้อมูลผู้จองให้ครบก่อน แล้วกดปุ่มเพื่อสร้าง QR Code
                      สำหรับชำระเงินจอง
                    </div>
                  ) : (
                    <>
                      <div className="mt-4 flex justify-center rounded-[24px] border border-sky-100 bg-sky-50 p-6">
                        <QRCodeSVG value={quote.qrCodeValue} size={220} />
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
                        <div className="flex justify-between border-t pt-2 text-base font-bold text-sky-700">
                          <span>ยอดรวม</span>
                          <span>฿{quote.totalDue.toLocaleString()}</span>
                        </div>
                      </div>

                      <p className="mt-3 text-xs text-slate-500">
                        QR หมดอายุ:{" "}
                        {new Date(quote.expiresAt).toLocaleString("th-TH")}
                      </p>
                    </>
                  )}
                </div>

                <div className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm">
                  <h4 className="text-lg font-black text-sky-950">
                    แนบสลิปการโอนเงินจอง
                  </h4>

                  <div className="mt-4">
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-sky-200 bg-sky-50 px-4 py-8 text-center transition hover:border-sky-300 hover:bg-sky-100/70">
                      <UploadCloud className="h-8 w-8 text-sky-500" />
                      <span className="mt-3 text-sm font-semibold text-sky-900">
                        คลิกเพื่ออัปโหลดสลิป
                      </span>
                      <span className="mt-1 text-xs text-slate-500">
                        รองรับไฟล์รูปภาพ เช่น PNG, JPG, JPEG
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleSlipUpload}
                      />
                    </label>

                    {bookingForm.slipFileName && (
                      <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-700">
                        แนบไฟล์แล้ว:{" "}
                        <span className="font-semibold">
                          {bookingForm.slipFileName}
                        </span>
                      </div>
                    )}

                    {bookingForm.slipBase64 && (
                      <div className="mt-4 overflow-hidden rounded-[24px] border border-slate-200">
                        <Image
                          src={bookingForm.slipBase64}
                          alt="Slip Preview"
                          width={800}
                          height={600}
                          className="h-auto w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {quote && !bookingResult && (
                  <Button
                    onClick={handleSubmitBooking}
                    disabled={submittingBooking}
                    className="h-12 w-full rounded-2xl bg-emerald-500 text-white hover:bg-emerald-600"
                  >
                    {submittingBooking
                      ? "กำลังส่งข้อมูลจอง..."
                      : "ยืนยันการจองและส่งสลิป"}
                  </Button>
                )}

                {bookingResult && (
                  <div className="rounded-[28px] border border-emerald-100 bg-emerald-50 p-5">
                    <h4 className="text-lg font-black text-emerald-800">
                      ส่งคำขอจองเรียบร้อย
                    </h4>

                    <div className="mt-3 space-y-2 text-sm text-emerald-900">
                      <div className="flex justify-between gap-4">
                        <span>เลขที่รายการ</span>
                        <span className="font-bold">
                          {bookingResult.bookingId}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>สถานะ</span>
                        <span className="font-bold">รอตรวจสอบสลิป</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>ผู้จอง</span>
                        <span className="font-bold">
                          {bookingResult.tenantName}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>เบอร์โทร</span>
                        <span className="font-bold">
                          {bookingResult.tenantPhone}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>วันย้ายเข้า</span>
                        <span className="font-bold">
                          {bookingResult.moveInDate}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={closeBookingModal}
                      className="mt-5 h-11 w-full rounded-2xl bg-sky-500 text-white hover:bg-sky-600"
                    >
                      ปิดหน้าต่าง
                    </Button>
                  </div>
                )}

                {error && (
                  <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
