import { createSlice } from "@reduxjs/toolkit";

export const ChatSlice = createSlice({
  name: "chats",
  initialState: {
    conversations: [],
    messages: [],
  },
  reducers: {
    fetchConversations: (state, action) => {
      state.conversations = action.payload;
    },
    fetchMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
});

export const { fetchConversations, fetchMessages } = ChatSlice.actions;

export default ChatSlice.reducer;
