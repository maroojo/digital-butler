"use client";

import * as React from "react";
import { SendHorizonal } from "lucide-react";
import type { ChatMessage, ChatRole } from "@/types/chat";
import { fetchChatMessages, sendChatMessageApi } from "@/lib/api/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  roomId: string;
  currentRole: ChatRole;
  senderName: string;
};

export default function ChatWindow({ roomId, currentRole, senderName }: Props) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState("");
  const bottomRef = React.useRef<HTMLDivElement | null>(null);

  const scrollToBottom = React.useCallback(() => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  const loadMessages = React.useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchChatMessages({
        roomId,
        role: currentRole,
      });

      setMessages(data.messages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [roomId, currentRole]);

  React.useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  React.useEffect(() => {
    const eventSource = new EventSource(`/api/chat/stream?roomId=${roomId}`);

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);

        if (payload.type === "message" && payload.message) {
          setMessages((prev) => {
            const exists = prev.some((item) => item.id === payload.message.id);
            if (exists) return prev;
            return [...prev, payload.message];
          });
        }
      } catch {
        // ignore prototype parse issues
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [roomId]);

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      setSending(true);
      setError("");

      const res = await sendChatMessageApi({
        roomId,
        senderRole: currentRole,
        senderName,
        text: input,
      });

      setMessages((prev) => {
        const exists = prev.some((item) => item.id === res.message.id);
        if (exists) return prev;
        return [...prev, res.message];
      });

      setInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-[620px] flex-col rounded-[28px] border border-sky-100 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h3 className="text-lg font-black text-sky-950">Chat</h3>
        <p className="text-sm text-slate-500">Prototype real-time chat</p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 px-4 py-4">
        {loading ? (
          <div className="rounded-2xl bg-white p-4 text-sm text-slate-500">
            กำลังโหลดข้อความ...
          </div>
        ) : messages.length === 0 ? (
          <div className="rounded-2xl bg-white p-4 text-sm text-slate-500">
            ยังไม่มีข้อความ เริ่มพิมพ์ได้เลย
          </div>
        ) : (
          messages.map((message) => {
            const isMe = message.senderRole === currentRole;

            return (
              <div
                key={message.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[78%] rounded-3xl px-4 py-3 shadow-sm ${
                    isMe
                      ? "bg-sky-500 text-white"
                      : "bg-white text-slate-800"
                  }`}
                >
                  <div className={`text-xs ${isMe ? "text-sky-100" : "text-slate-400"}`}>
                    {message.senderName}
                  </div>
                  <div className="mt-1 whitespace-pre-wrap break-words text-sm">
                    {message.text}
                  </div>
                  <div className={`mt-2 text-[11px] ${isMe ? "text-sky-100" : "text-slate-400"}`}>
                    {new Date(message.createdAt).toLocaleString("th-TH")}
                  </div>
                </div>
              </div>
            );
          })
        )}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-slate-100 p-4">
        {error && (
          <div className="mb-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="พิมพ์ข้อความ..."
            className="h-12 rounded-2xl border-slate-200"
          />
          <Button
            onClick={handleSend}
            disabled={sending}
            className="h-12 rounded-2xl bg-sky-500 px-5 text-white hover:bg-sky-600"
          >
            <SendHorizonal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}