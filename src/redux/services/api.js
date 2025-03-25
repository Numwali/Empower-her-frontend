import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "../../utils/handlers";

const BACKEND_URL = `${process.env.REACT_APP_BACKEND_URL}/v1`;

const baseQuery = fetchBaseQuery({
  baseUrl: BACKEND_URL,
  prepareHeaders: (headers) => {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
  credentials: "include",
});

export const Api = createApi({
  reducerPath: "heal-the-world-api",
  refetchOnFocus: true,
  refetchOnMountOrArgChange: true,
  baseQuery,
  tagTypes: [
    "Communities",
    "Community",
    "MyCommunities",
    "Join_Communities",
    "Community_Post",
    "Posts",
    "Post",
    "Users",
    "User",
  ],
  endpoints: (builder) => ({}),
});
