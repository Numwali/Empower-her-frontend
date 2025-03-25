import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { Api } from "./services/api";
import authReducer from "./slices/Auth/Auth";
import loggedUserReducer from "./slices/Auth/login";
import chatReducer from "./slices/chat/chatSlice";
import communityReducer from "./slices/community/community";
import notificationReducer from "./slices/notifications/notificationSlice";
import postReducer from "./slices/post/post";
import userReducer from "./slices/users/userSlice";

export const reducers = {
  // Add your reducers here
  auth: authReducer,
  user: loggedUserReducer,
  posts: postReducer,
  users: userReducer,
  communities: communityReducer,
  chats: chatReducer,
  notifications: notificationReducer,
  [Api.reducerPath]: Api.reducer,
};

const store = configureStore({
  reducer: {
    ...reducers,
    devTools: process.env.NODE_ENV !== "production",
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(Api.middleware),
});

setupListeners(store.dispatch);

export default store;
