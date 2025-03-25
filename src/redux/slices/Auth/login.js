import { createSlice } from "@reduxjs/toolkit";
const user=JSON.parse(localStorage.getItem('user'))
export const LoginSlice = createSlice({
    name: "user",
    initialState: {
        user: user,
    },
    reducers: {
        logginUser: (state, action) => {
            state.user = action.payload;
        },
    },
});

export const { logginUser } = LoginSlice.actions;
export const thisUser = (state) => state.login;

export default LoginSlice.reducer;
