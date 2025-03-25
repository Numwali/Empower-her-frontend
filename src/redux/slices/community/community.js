import { createSlice } from "@reduxjs/toolkit";

export const CommunitySlice = createSlice({
  name: "communities",
  initialState: {
    communities: {},
    community: {},
    myCommunities: {},
    joinedCommunities: {},
    createdCommunities: {},
    posts: {},
    post: {},
  },
  reducers: {
    fetchCommunities: (state, action) => {
      state.communities = action.payload;
    },
    fetchCommunity: (state, action) => {
      state.community = action.payload;
    },
    fetchCommunityPosts: (state, action) => {
      state.posts = action.payload;
    },
    fetchCommunityPost: (state, action) => {
      state.post = action.payload;
    },
    fetchMyCommunities: (state, action) => {
      state.myCommunities = action.payload;
    },
    fetchJoinedCommunities: (state, action) => {
      state.joinedCommunities = action.payload;
    },
    fetchCreatedCommunities: (state, action) => {
      state.createdCommunities = action.payload;
    },
  },
});

export const {
  fetchCommunities,
  fetchCreatedCommunities,
  fetchJoinedCommunities,
  fetchMyCommunities,
  fetchCommunity,
  fetchCommunityPosts,
  fetchCommunityPost,
} = CommunitySlice.actions;

export const fetchedData = (state) => state.communities;

export default CommunitySlice.reducer;
