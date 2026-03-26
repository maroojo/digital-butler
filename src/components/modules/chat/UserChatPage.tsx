"use client";

import * as React from "react";
import { MessageCircleMore } from "lucide-react";
import { createChatRoomApi, fetchChatRooms } from "@/lib/api/chat";
import type { ChatRoom } from "@/types/chat";
import ChatWindow from "./ChatWindow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DEMO_USER_ID_STORAGE_KEY = "demo_chat_user_id";
const DEMO_USER_NAME_STORAGE_KEY = "demo_chat_user_name";

function getOrCreateDemoUserId() {
  if (typeof window === "undefined") return "guest-demo";

  const existing = window.localStorage.getItem(DEMO_USER_ID_STORAGE_KEY);
  if (existing) return existing;

  const next = `guest_${Date.now()}`;
  window.localStorage.setItem(DEMO_USER_ID_STORAGE_KEY, next);
  return next;
}

export default function UserChatPage() {
  const [userId, setUserId] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const [rooms, setRooms] = React.useState<ChatRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [creating, setCreating] = React.useState(false);
  const [error, setError] = React.useState("");

  const loadRooms = React.useCallback(async (currentUserId: string) => {
    try {
      setLoading(true);
      const data = await fetchChatRooms({
        role: "user",
        userId: currentUserId,
      });

      setRooms(data.rooms);

      if (data.rooms.length > 0 && !activeRoomId) {
        setActiveRoomId(data.rooms[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chat rooms");
    } finally {
      setLoading(false);
    }
  }, [activeRoomId]);

  React.useEffect(() => {
    const id = getOrCreateDemoUserId();
    const savedName =
      window.localStorage.getItem(DEMO_USER_NAME_STORAGE_KEY) || "Guest User";

    setUserId(id);
    setUserName(savedName);
    loadRooms(id);
  }, [loadRooms]);

  const handleCreateRoom = async () => {
    try {
      if (!userName.trim()) {
        setError("กรุณากรอกชื่อก่อนเริ่มแชต");
        return;
      }

      setCreating(true);
      setError("");

      window.localStorage.setItem(DEMO_USER_NAME_STORAGE_KEY, userName.trim());

      const res = await createChatRoomApi({
        userId,
        userName,
        title: "สอบถามห้องพัก / การจอง",
      });

      await loadRooms(userId);
      setActiveRoomId(res.room.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create room");
    } finally {
      setCreating(false);
    }
  };

  const activeRoom = rooms.find((room) => room.id === activeRoomId);

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,#e0f2fe_0%,#f0f9ff_40%,#ffffff_85%)] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-[32px] border border-sky-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
              <MessageCircleMore className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-sky-950">แชตสอบถามกับแอดมิน</h1>
              <p className="text-sm text-slate-500">
                Prototype สำหรับให้ลูกค้าพิมพ์คุยกับ admin ได้แบบ real-time
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 md:flex-row">
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="ชื่อของคุณ"
              className="h-12 rounded-2xl border-slate-200 md:max-w-xs"
            />
            <Button
              onClick={handleCreateRoom}
              disabled={creating}
              className="h-12 rounded-2xl bg-sky-500 text-white hover:bg-sky-600"
            >
              {creating ? "กำลังเริ่มแชต..." : "เริ่มแชตใหม่"}
            </Button>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="rounded-[32px] border border-sky-100 bg-white p-4 shadow-sm">
            <h2 className="px-2 text-lg font-black text-sky-950">ห้องแชตของฉัน</h2>

            <div className="mt-4 space-y-3">
              {loading ? (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                  กำลังโหลดห้องแชต...
                </div>
              ) : rooms.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                  ยังไม่มีห้องแชต กดปุ่มเริ่มแชตใหม่ได้เลย
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
                      <div>
                        <div className="font-bold text-slate-900">{room.title}</div>
                        <div className="mt-1 line-clamp-2 text-sm text-slate-500">
                          {room.lastMessage || "ยังไม่มีข้อความ"}
                        </div>
                      </div>

                      {room.unreadForUser > 0 && (
                        <span className="rounded-full bg-rose-500 px-2 py-1 text-xs font-bold text-white">
                          {room.unreadForUser}
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
                currentRole="user"
                senderName={userName || "Guest User"}
              />
            ) : (
              <div className="flex h-[620px] items-center justify-center rounded-[32px] border border-dashed border-sky-200 bg-white text-slate-500">
                เลือกห้องแชต หรือสร้างแชตใหม่ก่อน
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}