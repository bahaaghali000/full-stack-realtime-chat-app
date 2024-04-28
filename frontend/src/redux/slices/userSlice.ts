import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { TConversation, TMessage, TUser } from "../../model";

export interface userSlice {
  darkMode: string;
  socket: any;
  onlineUsers: any;
  selectedConversation: TConversation | any;
  selectedReceiver: TUser | any;
  messages: TMessage[] | any;
  chats: TConversation[] | any;
}

const darkMode = JSON.parse(localStorage.getItem("BGChatTheme")!);
const initialState: userSlice = {
  darkMode,
  socket: "",
  onlineUsers: [],
  selectedConversation: {},
  selectedReceiver: {},
  messages: [],
  chats: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    changeChatTheme: (state) => {
      if (state.darkMode === "dark") {
        state.darkMode = "light";
        localStorage.setItem("BGChatTheme", JSON.stringify("light"));
      } else {
        state.darkMode = "dark";
        localStorage.setItem("BGChatTheme", JSON.stringify("dark"));
      }
    },
    setSelectedConversation: (state, action: PayloadAction<any>) => {
      state.selectedConversation = action.payload;
    },
    setSelectedReceiver: (state, action: PayloadAction<any>) => {
      state.selectedReceiver = action.payload;
    },

    setMessages: (state, action) => {
      state.messages = action.payload.messages;
    },
    addMessage: (state, action: PayloadAction<any>) => {
      state.messages?.push(action.payload.message);
      const conversation: any = state.chats.find(
        (c: TConversation) => c._id === action.payload.conversationId
      );
      // update the lastMsg
      if (action.payload.message.isImage) {
        conversation.lastMsg = "Image";
      } else {
        conversation.lastMsg = action.payload.message.message;
      }

      state.chats.sort((a: TConversation, b: TConversation) => {
        const dateA: any = new Date(a.updatedAt);
        const dateB: any = new Date(b.updatedAt);

        return dateA - dateB;
      });
    },
    updateLastMessage: (state, action) => {
      const conversation: any = state.chats.find(
        (c: TConversation) => c._id === action.payload
      );

      if (state.messages[state.messages.length - 1]?.isImage) {
        conversation.lastMsg = "Image";
      } else {
        conversation.lastMsg =
          state.messages[state.messages.length - 1]?.message;
      }
    },
    seenMessages: (state, action) => {
      if (state.selectedConversation?._id === action.payload) {
        state.messages = state.messages?.map((m: TMessage) => ({
          ...m,
          seen: true,
        }));
      }
    },
    updateUnseenMessages: (state, action) => {
      const conversation: any = state.chats.find(
        (ch: TConversation) => ch._id === action.payload.id
      );

      conversation.unseenMessages = action.payload.unseenMessages;
    },
    removeMessage: (state, action) => {
      state.messages = state.messages.filter(
        (m: TMessage) => m._id !== action.payload
      );
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    addChat: (state, action: any) => {
      const chat = state.chats?.find(
        (c: TConversation) => c._id === action.payload._id
      );

      if (chat) return;

      state.chats.push(action.payload);
    },
    removeChat: (state, action) => {
      state.chats = state.chats.filter(
        (ch: TConversation) => ch._id !== action.payload
      );
    },

    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const {
  setSelectedConversation,
  setMessages,
  setChats,
  addChat,
  addMessage,
  setSocket,
  setOnlineUsers,
  setSelectedReceiver,
  removeMessage,
  removeChat,
  seenMessages,
  updateUnseenMessages,
  changeChatTheme,
  updateLastMessage,
} = userSlice.actions;

export default userSlice.reducer;
