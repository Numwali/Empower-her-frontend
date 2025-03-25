import { createSlice } from "@reduxjs/toolkit";

export const UserSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    therapies: [],
    onlineUsers: [],
    selectedTherapist: null,
  },
  reducers: {
    fetchUsers: (state, action) => {
      state.users = action.payload;
    },
    fetchTherapies: (state, action) => {
      state.therapies = action.payload;
    },
    setSelectedTherapist: (state, action) => {
      state.selectedTherapist = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const {
  fetchUsers,
  setSelectedTherapist,
  fetchTherapies,
  setOnlineUsers,
} = UserSlice.actions;

export default UserSlice.reducer;
