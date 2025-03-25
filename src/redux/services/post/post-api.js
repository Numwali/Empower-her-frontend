import { Api } from "../api";

const postApi = Api.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => "/posts",
      providesTags: ["Posts"],
    }),
    getPost: builder.query({
      query: (postId) => `/posts/${postId}`,
      providesTags: ["Post"],
    }),
    createPost: builder.mutation({
      query: (post) => ({
        url: "/posts",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["Posts"],
    }),
    updatePost: builder.mutation({
      query: ({ postId, post }) => ({
        url: `/post/update/${postId}`,
        method: "PATCH",
        body: post,
      }),
    }),
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `/post/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posts"],
    }),
    myPosts: builder.query({
      query: () => "/post/my-posts",
      providesTags: ["Posts"],
    }),

    // Like a post
    likePost: builder.mutation({
      query: (id) => ({
        url: `/post/like/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Posts", "Post", "Community_Post"],
    }),

    // Comment on a post
    commentOnAPost: builder.mutation({
      query: (data) => ({
        url: `/post/comment/${data.id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Posts", "Post", "Community_Post"],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useMyPostsQuery,
  useLikePostMutation,
  useCommentOnAPostMutation,
} = postApi;
