"use client";

import * as React from "react";
import { Headset } from "lucide-react";
import { fetchChatRooms } from "@/lib/api/chat";
import type { ChatRoom } from "@/types/chat";
import ChatWindow from "./ChatWindow";

export default function AdminChatPage() {
  const [rooms, setRooms] = React.useState<ChatRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const loadRooms = React.useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchChatRooms({
        role: "admin",
      });

      setRooms(data.rooms);

      if (data.rooms.length > 0 && !activeRoomId) {
        setActiveRoomId(data.rooms[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admin chats");
    } finally {
      setLoading(false);
    }
  }, [activeRoomId]);

  React.useEffect(() => {
    loadRooms();

    const timer = setInterval(() => {
      loadRooms();
    }, 5000);

    return () => clearInterval(timer);
  }, [loadRooms]);

  const activeRoom = rooms.find((room) => room.id === activeRoomId);

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
              <Headset className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-950">Admin Chat Console</h1>
              <p className="text-sm text-slate-500">
                Prototype สำหรับ admin ตอบแชตลูกค้าแบบ real-time
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="px-2 text-lg font-black text-slate-950">รายการห้องแชต</h2>

            <div className="mt-4 space-y-3">
              {loading ? (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                  กำลังโหลดห้องแชต...
                </div>
              ) : rooms.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                  ยังไม่มีห้องแชตจากลูกค้า
                </div>
              ) : (
                rooms.map((room) => (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => setActiveRoomId(room.id)}
                    className={`w-full rounded-3xl border p-4 text-left transition ${
                      activeRoomId === room.id
                        ? "border-sky-500 bg-sky-50"
                        : "border-slate-100 bg-white hover:border-sky-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate font-bold text-slate-900">
                          {room.userName}
                        </div>
                        <div className="mt-1 text-sm font-medium text-sky-700">
                          {room.title}
                        </div>
                        <div className="mt-1 line-clamp-2 text-sm text-slate-500">
                          {room.lastMessage || "ยังไม่มีข้อความ"}
                        </div>
                      </div>

                      {room.unreadForAdmin > 0 && (
                        <span className="rounded-full bg-rose-500 px-2 py-1 text-xs font-bold text-white">
                          {room.unreadForAdmin}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div>
            {activeRoom ? (
              <ChatWindow
                roomId={activeRoom.id}
                currentRole="admin"
                senderName="Admin"
              />
            ) : (
              <div className="flex h-[620px] items-center justify-center rounded-[32px] border border-dashed border-slate-300 bg-white text-slate-500">
                เลือกห้องแชตก่อน
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}