import { Api } from "../api";

const chatApi = Api.injectEndpoints({
  endpoints: (builder) => ({
    getConversation: builder.query({
      query: (userId) => `/conversations/${userId}`,
      providesTags: ["Conversations"],
    }),
    getMessages: builder.query({
      query: (conversationId) => `/messages/${conversationId}`,
      providesTags: ["Messages"],
    }),
    sendMessage: builder.mutation({
      query: (data) => ({
        url: "/messages",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Messages"],
    }),
    createConversation: builder.mutation({
      query: (data) => ({
        url: "/conversations",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Conversations"],
    }),
  }),
});

export const {
  useGetConversationQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useCreateConversationMutation,
} = chatApi;
