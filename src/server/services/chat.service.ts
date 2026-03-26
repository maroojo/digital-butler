import type {
  CreateChatRoomPayload,
  SendChatMessagePayload,
} from "@/types/chat";
import {
  appendMessage,
  createOrGetRoom,
  getMessages,
  getRoomsByRole,
  markRoomAsRead,
} from "@/server/mocks/chat.store";

export async function getChatRooms(role: "user" | "admin", userId?: string) {
  return {
    rooms: getRoomsByRole(role, userId),
  };
}

export async function getRoomMessages(roomId: string, role?: "user" | "admin") {
  if (role) {
    markRoomAsRead(roomId, role);
  }

  return {
    messages: getMessages(roomId),
  };
}

export async function createChatRoom(payload: CreateChatRoomPayload) {
  if (!payload.userId?.trim()) {
    throw new Error("userId is required");
  }

  if (!payload.userName?.trim()) {
    throw new Error("userName is required");
  }

  const room = createOrGetRoom(payload);

  return { room };
}

export async function sendChatMessage(payload: SendChatMessagePayload) {
  if (!payload.roomId?.trim()) {
    throw new Error("roomId is required");
  }

  if (!payload.senderName?.trim()) {
    throw new Error("senderName is required");
  }

  if (!payload.text?.trim()) {
    throw new Error("text is required");
  }

  const message = appendMessage(payload);

  return { message };
}