import { Api } from "../api";

const usersApi = Api.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => "/user/allUsers",
      providesTags: ["Users"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetAllUsersQuery } = usersApi;
