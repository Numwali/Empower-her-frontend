import { createSlice } from "@reduxjs/toolkit";

export const PostSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    userPosts: [],
    selectedPost: JSON.parse(localStorage.getItem("selectedPost")) || {},
    likedPosts: [],
    selectedPostToEdit: {},
  },
  reducers: {
    selectingPost: (state, action) => {
      state.selectedPost = action.payload;
    },
    fetchPosts: (state, action) => {
      state.posts = action.payload;
    },
    fetchUserPosts: (state, action) => {
      state.userPosts = action.payload;
    },
    fetchLikedPosts: (state, action) => {
      state.likedPosts = action.payload;
    },
    selectingPostToEdit: (state, action) => {
      state.selectedPostToEdit = action.payload;
     }
  },
});

export const { fetchPosts, fetchUserPosts ,selectingPost,fetchLikedPosts,selectingPostToEdit} = PostSlice.actions;
export const fetchedData = (state) => state.posts;

export default PostSlice.reducer;
