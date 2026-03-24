"use client";

import * as React from "react";
import {
  Search,
  SlidersHorizontal,
  PawPrint,
  BedDouble,
  Wallet,
  Maximize,
  MapPinned,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

import { DormCard } from "./DormCard";
import { fetchDorms } from "@/lib/api/dorms";
import type { DormListItem } from "@/types/dorm";

const furnitureOptions = ["เตียง", "ตู้เสื้อผ้า", "โต๊ะ", "แอร์", "ตู้เย็น", "ทีวี", "โซฟา"];

export function DormListPage() {
  const [keyword, setKeyword] = React.useState("");
  const [near, setNear] = React.useState("");
  const [priceRange, setPriceRange] = React.useState([12000]);
  const [roomSizeRange, setRoomSizeRange] = React.useState([24]);
  const [petFriendlyOnly, setPetFriendlyOnly] = React.useState(false);
  const [selectedFurniture, setSelectedFurniture] = React.useState<string[]>([]);
  const [dorms, setDorms] = React.useState<DormListItem[]>([]);
  const [loading, setLoading] = React.useState(false);

  const loadDorms = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchDorms({
        q: keyword,
        near,
        priceMax: priceRange[0],
        roomSizeMin: roomSizeRange[0],
        petFriendly: petFriendlyOnly,
        furniture: selectedFurniture,
      });
      setDorms(data);
    } finally {
      setLoading(false);
    }
  }, [keyword, near, priceRange, roomSizeRange, petFriendlyOnly, selectedFurniture]);

  React.useEffect(() => {
    loadDorms();
  }, [loadDorms]);

  const toggleFurniture = (item: string) => {
    setSelectedFurniture((prev) =>
      prev.includes(item) ? prev.filter((f) => f !== item) : [...prev, item],
    );
  };

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe_0%,#eff6ff_35%,#ffffff_75%)] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[32px] border border-sky-200/70 bg-white/80 p-6 shadow-[0_20px_80px_-30px_rgba(59,130,246,0.45)] backdrop-blur md:p-8">
          <div className="relative z-10 flex flex-col gap-5">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-sky-950 md:text-5xl">
                ตามหา<span className="text-sky-500">หอพัก</span>ที่ใช่
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base">
                ค้นหาได้เลย ทั้งทำเล ราคา ขนาดห้อง เฟอร์นิเจอร์ และเลี้ยงสัตว์
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sky-500" />
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="ค้นหาชื่อหอพัก, ทำเล, หรือ keyword..."
                  className="h-12 rounded-2xl border-sky-200 bg-white pl-11"
                />
              </div>

              <div className="relative">
                <MapPinned className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sky-500" />
                <Input
                  value={near}
                  onChange={(e) => setNear(e.target.value)}
                  placeholder="ใกล้ BTS / MRT / Landmark เช่น BTS บางนา"
                  className="h-12 rounded-2xl border-sky-200 bg-white pl-11"
                />
              </div>

              <Button
                onClick={loadDorms}
                className="h-12 rounded-2xl bg-sky-500 px-6 text-white hover:bg-sky-600"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                ค้นหาเลย
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
          <Card className="h-fit rounded-[28px] border-sky-200 bg-white/90 shadow-lg">
            <CardContent className="p-5">
              <div className="mb-5 flex items-center gap-2">
                <div className="rounded-2xl bg-sky-100 p-2 text-sky-600">
                  <SlidersHorizontal className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-bold text-sky-950">ตัวกรอง</h2>
                  <p className="text-xs text-slate-500">เลือกตาม requirement ได้เลย</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
                    <Wallet className="h-4 w-4 text-sky-500" />
                    ราคาไม่เกิน
                  </div>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={20000}
                    min={3000}
                    step={500}
                  />
                  <div className="mt-2 text-sm text-slate-600">
                    {priceRange[0].toLocaleString()} บาท/เดือน
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
                    <Maximize className="h-4 w-4 text-sky-500" />
                    ขนาดห้องขั้นต่ำ
                  </div>
                  <Slider
                    value={roomSizeRange}
                    onValueChange={setRoomSizeRange}
                    max={50}
                    min={18}
                    step={1}
                  />
                  <div className="mt-2 text-sm text-slate-600">
                    {roomSizeRange[0]} ตร.ม. ขึ้นไป
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
                    <BedDouble className="h-4 w-4 text-sky-500" />
                    เฟอร์นิเจอร์
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {furnitureOptions.map((item) => (
                      <label
                        key={item}
                        className="flex cursor-pointer items-center gap-2 rounded-2xl border border-sky-100 p-3 text-sm transition hover:bg-sky-50"
                      >
                        <Checkbox
                          checked={selectedFurniture.includes(item)}
                          onCheckedChange={() => toggleFurniture(item)}
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-sky-100 p-4 transition hover:bg-sky-50">
                    <div className="flex items-center gap-2">
                      <PawPrint className="h-4 w-4 text-sky-500" />
                      <span className="font-medium text-slate-800">เลี้ยงสัตว์ได้</span>
                    </div>
                    <Checkbox
                      checked={petFriendlyOnly}
                      onCheckedChange={(checked) => setPetFriendlyOnly(Boolean(checked))}
                    />
                  </label>
                </div>

                <Button
                  variant="outline"
                  className="w-full rounded-2xl border-sky-200 text-sky-700 hover:bg-sky-50"
                  onClick={() => {
                    setKeyword("");
                    setNear("");
                    setPriceRange([12000]);
                    setRoomSizeRange([24]);
                    setPetFriendlyOnly(false);
                    setSelectedFurniture([]);
                  }}
                >
                  รีเซ็ตตัวกรอง
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex flex-col items-start justify-between gap-3 rounded-[28px] border border-sky-100 bg-white/80 p-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-xl font-black text-sky-950">ผลการค้นหา</h2>
                <p className="text-sm text-slate-500">
                  พบ {dorms.length} รายการ
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {petFriendlyOnly && (
                  <Badge className="rounded-full bg-sky-100 text-sky-700 hover:bg-sky-100">
                    เลี้ยงสัตว์ได้
                  </Badge>
                )}
                {near && (
                  <Badge className="rounded-full bg-cyan-100 text-cyan-700 hover:bg-cyan-100">
                    ใกล้: {near}
                  </Badge>
                )}
              </div>
            </div>

            {loading ? (
              <Card className="rounded-[28px] border-dashed border-sky-200 bg-white/80">
                <CardContent className="flex min-h-60 items-center justify-center text-slate-500">
                  กำลังโหลดรายการหอพัก...
                </CardContent>
              </Card>
            ) : dorms.length === 0 ? (
              <Card className="rounded-[28px] border-dashed border-sky-200 bg-white/80">
                <CardContent className="flex min-h-60 flex-col items-center justify-center text-center">
                  <h3 className="text-xl font-bold text-sky-950">ยังไม่เจอห้องที่ตรงใจ</h3>
                  <p className="mt-2 max-w-md text-sm text-slate-500">
                    ลองปรับช่วงราคา ขนาดห้อง หรือ keyword ใหม่
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {dorms.map((dorm) => (
                  <DormCard key={dorm.id} dorm={dorm} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}