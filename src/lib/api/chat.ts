import type {
  ChatMessagesResponse,
  ChatRoomsResponse,
  CreateChatRoomPayload,
  CreateChatRoomResponse,
  SendChatMessagePayload,
  SendChatMessageResponse,
} from "@/types/chat";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

async function parseJsonResponse<T>(res: Response): Promise<T> {
  const text = await res.text();

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("Invalid JSON response");
  }
}

export async function fetchChatRooms(params: {
  role: "user" | "admin";
  userId?: string;
}) {
  const search = new URLSearchParams({
    role: params.role,
  });

  if (params.userId) {
    search.set("userId", params.userId);
  }

  const res = await fetch(`/api/chat/rooms?${search.toString()}`);
  const json = await parseJsonResponse<ApiResponse<ChatRoomsResponse>>(res);

  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.message || "Failed to fetch chat rooms");
  }

  return json.data;
}

export async function createChatRoomApi(payload: CreateChatRoomPayload) {
  const res = await fetch("/api/chat/rooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await parseJsonResponse<ApiResponse<CreateChatRoomResponse>>(res);

  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.message || "Failed to create chat room");
  }

  return json.data;
}

export async function fetchChatMessages(params: {
  roomId: string;
  role?: "user" | "admin";
}) {
  const search = new URLSearchParams({
    roomId: params.roomId,
  });

  if (params.role) {
    search.set("role", params.role);
  }

  const res = await fetch(`/api/chat/messages?${search.toString()}`);
  const json = await parseJsonResponse<ApiResponse<ChatMessagesResponse>>(res);

  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.message || "Failed to fetch chat messages");
  }

  return json.data;
}

export async function sendChatMessageApi(payload: SendChatMessagePayload) {
  const res = await fetch("/api/chat/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await parseJsonResponse<ApiResponse<SendChatMessageResponse>>(res);

  if (!res.ok || !json.success || !json.data) {
    throw new Error(json.message || "Failed to send chat message");
  }

  return json.data;
}