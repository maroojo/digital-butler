export type ChatRole = "user" | "admin";

export type ChatMessage = {
  id: string;
  roomId: string;
  senderRole: ChatRole;
  senderName: string;
  text: string;
  createdAt: string;
};

export type ChatRoom = {
  id: string;
  userId: string;
  userName: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessage: string;
  unreadForAdmin: number;
  unreadForUser: number;
};

export type CreateChatRoomPayload = {
  userId: string;
  userName: string;
  title?: string;
};

export type SendChatMessagePayload = {
  roomId: string;
  senderRole: ChatRole;
  senderName: string;
  text: string;
};

export type ChatRoomsResponse = {
  rooms: ChatRoom[];
};

export type ChatMessagesResponse = {
  messages: ChatMessage[];
};

export type CreateChatRoomResponse = {
  room: ChatRoom;
};

export type SendChatMessageResponse = {
  message: ChatMessage;
};