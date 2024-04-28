import { createSlice } from "@reduxjs/toolkit";
import { TConversation, TUser } from "../../model";

interface TypingSlice {
  typingChat: any;
  typingUser: any;
}

const initialState: TypingSlice = {
  typingChat: [],
  typingUser: [],
};
export const typingSlice = createSlice({
  name: "typing",
  initialState,
  reducers: {
    addTypingChat: (state, action: any) => {
      state.typingChat.push(action.payload);
    },
    addTypingUser: (state, action) => {
      state.typingUser.push(action.payload);
    },
    removeTypingChat: (state, action) => {
      state.typingChat = state.typingChat.filter(
        (item: TConversation) => item !== action.payload
      );
    },
    removeTypingUser: (state, action) => {
      state.typingUser = state.typingUser.filter(
        (item: TUser) => item !== action.payload
      );
    },
  },
});

export const {
  addTypingChat,
  addTypingUser,
  removeTypingChat,
  removeTypingUser,
} = typingSlice.actions;

export default typingSlice.reducer;
