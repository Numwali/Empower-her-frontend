import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
  },
  reducers: {
    addNotification: (state, action) => {
      let newNotifications = action.payload;
      if (!Array.isArray(newNotifications))
        newNotifications = [newNotifications];
      const uniqueNotifications = newNotifications.filter((newNotification) => {
        return !state.notifications.some(
          (existingNotification) =>
            existingNotification?._id === newNotification?._id
        );
      });
      state.notifications = [...state.notifications, ...uniqueNotifications];
    },
    markAsRead: (state, action) => {
      // Create a new array with modified notifications
      const updatedNotifications = state.notifications.map((notification) => {
        if (notification?._id === action.payload) {
          // Create a new object with the same properties, updating isRead to true
          return { ...notification, isRead: true };
        }
        return notification; // For other notifications, return them unchanged
      });

      // Update state with the new array
      state.notifications = updatedNotifications;
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification?._id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  addNotification,
  removeNotification,
  clearNotifications,
  markAsRead,
} = notificationSlice.actions;

export default notificationSlice.reducer;
