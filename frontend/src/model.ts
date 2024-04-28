export interface TUser {
  _id: string;
  username: string | null;
  email: string;
  profilePic: string | null;
  bio: string;
  createdAt: Date;
}

export interface TMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  isImage?: boolean;
  caption?: string;
  seen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TConversation {
  _id: string;
  participants: TUser[];
  messages: TMessage[];
  lastMsg: string;
  unseenMessages: number;
  createdAt: Date;
  updatedAt: Date;
}
