import type { ChatMessage, ChatRoom, ChatRole } from "@/types/chat";

type ChatStore = {
  rooms: ChatRoom[];
  messagesByRoom: Record<string, ChatMessage[]>;
  listenersByRoom: Record<string, Set<(message: ChatMessage) => void>>;
};

declare global {
  // eslint-disable-next-line no-var
  var __CHAT_STORE__: ChatStore | undefined;
}

function createInitialStore(): ChatStore {
  const roomId = "room_demo_1";

  const initialRoom: ChatRoom = {
    id: roomId,
    userId: "guest-demo",
    userName: "Guest Demo",
    title: "สอบถามห้องพัก Sky Residence",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastMessage: "สวัสดีครับ สนใจสอบถามห้องพัก",
    unreadForAdmin: 1,
    unreadForUser: 0,
  };

  const initialMessages: ChatMessage[] = [
    {
      id: "msg_demo_1",
      roomId,
      senderRole: "user",
      senderName: "Guest Demo",
      text: "สวัสดีครับ สนใจสอบถามห้องพัก",
      createdAt: new Date().toISOString(),
    },
  ];

  return {
    rooms: [initialRoom],
    messagesByRoom: {
      [roomId]: initialMessages,
    },
    listenersByRoom: {},
  };
}

export function getChatStore(): ChatStore {
  if (!global.__CHAT_STORE__) {
    global.__CHAT_STORE__ = createInitialStore();
  }

  return global.__CHAT_STORE__;
}

export function getRoomsByRole(role: ChatRole, userId?: string): ChatRoom[] {
  const store = getChatStore();

  let rooms = store.rooms;

  if (role === "user" && userId) {
    rooms = rooms.filter((room) => room.userId === userId);
  }

  return [...rooms].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getMessages(roomId: string): ChatMessage[] {
  const store = getChatStore();
  return store.messagesByRoom[roomId] ?? [];
}

export function createOrGetRoom(params: {
  userId: string;
  userName: string;
  title?: string;
}): ChatRoom {
  const store = getChatStore();

  const existing = store.rooms.find(
    (room) =>
      room.userId === params.userId &&
      room.title === (params.title?.trim() || "แชตสอบถามทั่วไป")
  );

  if (existing) {
    return existing;
  }

  const now = new Date().toISOString();
  const room: ChatRoom = {
    id: `room_${Date.now()}`,
    userId: params.userId,
    userName: params.userName.trim(),
    title: params.title?.trim() || "แชตสอบถามทั่วไป",
    createdAt: now,
    updatedAt: now,
    lastMessage: "",
    unreadForAdmin: 0,
    unreadForUser: 0,
  };

  store.rooms.unshift(room);
  store.messagesByRoom[room.id] = [];

  return room;
}

export function appendMessage(params: {
  roomId: string;
  senderRole: ChatRole;
  senderName: string;
  text: string;
}): ChatMessage {
  const store = getChatStore();

  const room = store.rooms.find((item) => item.id === params.roomId);
  if (!room) {
    throw new Error("Chat room not found");
  }

  const message: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    roomId: params.roomId,
    senderRole: params.senderRole,
    senderName: params.senderName.trim(),
    text: params.text.trim(),
    createdAt: new Date().toISOString(),
  };

  if (!store.messagesByRoom[params.roomId]) {
    store.messagesByRoom[params.roomId] = [];
  }

  store.messagesByRoom[params.roomId].push(message);

  room.updatedAt = message.createdAt;
  room.lastMessage = message.text;

  if (params.senderRole === "user") {
    room.unreadForAdmin += 1;
  } else {
    room.unreadForUser += 1;
  }

  const listeners = store.listenersByRoom[params.roomId];
  if (listeners?.size) {
    listeners.forEach((listener) => listener(message));
  }

  return message;
}

export function markRoomAsRead(roomId: string, role: ChatRole) {
  const store = getChatStore();
  const room = store.rooms.find((item) => item.id === roomId);
  if (!room) return;

  if (role === "admin") {
    room.unreadForAdmin = 0;
  } else {
    room.unreadForUser = 0;
  }
}

export function subscribeRoom(roomId: string, callback: (message: ChatMessage) => void) {
  const store = getChatStore();

  if (!store.listenersByRoom[roomId]) {
    store.listenersByRoom[roomId] = new Set();
  }

  store.listenersByRoom[roomId].add(callback);

  return () => {
    store.listenersByRoom[roomId]?.delete(callback);
  };
}