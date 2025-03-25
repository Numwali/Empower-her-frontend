import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "isLogged",
  initialState: {
    isLogged: localStorage.getItem("isLogged") === "true" ? true : false,
  },
  reducers: {
    loginMode: (state) => {
      state.isLogged = true;
      localStorage.setItem("isLogged", true);
    },
    logoutMode: (state) => {
      state.isLogged = false;
      localStorage.setItem("isLogged", false);
    },
  },
});

export const { loginMode, logoutMode } = authSlice.actions;

export default authSlice.reducer;
