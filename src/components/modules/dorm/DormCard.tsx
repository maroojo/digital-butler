"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, PawPrint, Wifi, Car, ShieldCheck, TrainFront, Landmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DormListItem } from "@/types/dorm";

type DormCardProps = {
  dorm: DormListItem;
};

export function DormCard({ dorm }: DormCardProps) {
  const nearbyTop = dorm.nearby.slice(0, 2);

  return (
    <Card className="group overflow-hidden rounded-[30px] border-sky-100 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-52 overflow-hidden">
        <Image
          src={dorm.cover}
          alt={dorm.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {dorm.tags.slice(0, 2).map((tag) => (
            <Badge
              key={tag}
              className="rounded-full bg-white/90 text-sky-700 backdrop-blur hover:bg-white/90"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="absolute bottom-4 left-4">
          <Badge
            className={
              dorm.realTimeStatus === "available"
                ? "rounded-full bg-emerald-500 text-white hover:bg-emerald-500"
                : "rounded-full bg-rose-500 text-white hover:bg-rose-500"
            }
          >
            {dorm.realTimeStatus === "available" ? "ว่าง" : "เต็ม"}
          </Badge>
        </div>

        <button
          type="button"
          className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-sky-600 shadow-md transition hover:scale-105"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      <CardContent className="space-y-4 p-5">
        <div>
          <h3 className="line-clamp-1 text-lg font-black text-sky-950">{dorm.name}</h3>
          <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
            <MapPin className="h-4 w-4 shrink-0 text-sky-500" />
            <span className="line-clamp-1">{dorm.location}</span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-black text-sky-600">
              ฿{dorm.priceMin.toLocaleString()}
              {dorm.priceMax !== dorm.priceMin ? ` - ฿${dorm.priceMax.toLocaleString()}` : ""}
            </p>
            <p className="text-xs text-slate-500">/ เดือน</p>
          </div>

          <Badge className="rounded-full bg-sky-50 text-sky-700 hover:bg-sky-50">
            {dorm.roomSizeMin}-{dorm.roomSizeMax} ตร.ม.
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {dorm.features.includes("Wifi") && (
            <Badge variant="outline" className="rounded-full border-sky-200">
              <Wifi className="mr-1 h-3 w-3" />
              Wifi
            </Badge>
          )}

          {dorm.features.includes("ที่จอดรถ") && (
            <Badge variant="outline" className="rounded-full border-sky-200">
              <Car className="mr-1 h-3 w-3" />
              ที่จอดรถ
            </Badge>
          )}

          {dorm.features.includes("CCTV") && (
            <Badge variant="outline" className="rounded-full border-sky-200">
              <ShieldCheck className="mr-1 h-3 w-3" />
              CCTV
            </Badge>
          )}

          {dorm.petFriendly && (
            <Badge className="rounded-full bg-cyan-100 text-cyan-700 hover:bg-cyan-100">
              <PawPrint className="mr-1 h-3 w-3" />
              Pet Friendly
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {nearbyTop.map((item) => (
            <Badge
              key={item.id}
              className="rounded-full bg-slate-50 text-slate-600 hover:bg-slate-50"
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

        <div className="flex flex-wrap gap-2">
          {dorm.furniture.slice(0, 4).map((item) => (
            <span
              key={item}
              className="rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-600"
            >
              {item}
            </span>
          ))}
        </div>

        <Link href={`/dorms/${dorm.slug}`} className="block">
          <Button className="w-full rounded-2xl bg-sky-500 text-white hover:bg-sky-600">
            ดูรายละเอียดห้อง
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}