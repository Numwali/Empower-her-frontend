import { Api } from "../api";

const communityApi = Api.injectEndpoints({
  endpoints: (builder) => ({
    getCommunities: builder.query({
      query: () => "community",
      providesTags: ["Communities"],
    }),
    getMyCommunities: builder.query({
      query: () => "/community/my-communities",
      providesTags: ["MyCommunities"],
    }),
    getCreatedCommunities: builder.query({
      query: () => "/community/created-by-me",
      providesTags: ["Communities"],
    }),
    getJoinedCommunities: builder.query({
      query: () => "/community/joined-by-me",
      providesTags: ["Join_Communities"],
    }),

    getCommunity: builder.query({
      query: (communityId) => `/community/${communityId}`,
      providesTags: ["Community"],
    }),
    createCommunity: builder.mutation({
      query: (community) => ({
        url: "/community",
        method: "POST",
        body: community,
      }),
      invalidatesTags: ["Communities"],
    }),
    updateCommunity: builder.mutation({
      query: ({ communityId, community }) => ({
        url: `/community/${communityId}`,
        method: "PATCH",
        body: community,
      }),
    }),
    joinCommunity: builder.mutation({
      query: (communityId) => ({
        url: `/community/join/${communityId}`,
        method: "POST",
      }),
      invalidatesTags: ["Join_Communities"],
    }),
    leaveCommunity: builder.mutation({
      query: (communityId) => ({
        url: `/community/leave/${communityId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Join_Communities", "MyCommunities"],
    }),
    deleteCommunity: builder.mutation({
      query: (CommunityId) => ({
        url: `/community/${CommunityId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MyCommunities", "Communities"],
    }),
    //posts
    createCommunityPost: builder.mutation({
      query: ({ communityId, post }) => ({
        url: `/community/${communityId}/post`,
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["Community_Post"],
    }),
    getCommunityPosts: builder.query({
      query: (communityId) => `/community/${communityId}/posts`,
      providesTags: ["Community_Post"],
    }),
    deleteCommunityPost: builder.mutation({
      query: (postId) => ({
        url: `/post/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Community_Post", "Community"],
    }),
    getCommunityPendingMembers: builder.query({
      query: (communityId) => `/community/${communityId}/pending-members`,
    }),

    AddCommunityMember: builder.mutation({
      query: ({ communityId, userId }) => ({
        url: `/community/${communityId}/add-member`,
        method: "PUT",
        body: { userId },
      }),
    }),
    approveCommunityMember: builder.mutation({
      query: ({ communityId, userId }) => ({
        url: `/community/${communityId}/approve-members`,
        method: "PUT",
        body: { userId },
      }),
    }),
    rejectCommunityMember: builder.mutation({
      query: ({ communityId, userId }) => ({
        url: `/community/${communityId}/reject-members`,
        method: "PUT",
        body: { userId },
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateCommunityMutation,
  useGetCommunitiesQuery,
  useGetMyCommunitiesQuery,
  useDeleteCommunityMutation,
  useGetCommunityQuery,
  useUpdateCommunityMutation,
  useJoinCommunityMutation,
  useLeaveCommunityMutation,
  useCreateCommunityPostMutation,
  useGetCommunityPostsQuery,
  useDeleteCommunityPostMutation,
  useGetCommunityPendingMembersQuery,
  useAddCommunityMemberMutation,
  useApproveCommunityMemberMutation,
  useRejectCommunityMemberMutation,
  useGetCreatedCommunitiesQuery,
  useGetJoinedCommunitiesQuery,
} = communityApi;
