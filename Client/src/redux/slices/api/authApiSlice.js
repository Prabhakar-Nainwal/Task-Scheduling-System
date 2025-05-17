import { USERS_URL } from "../../../utils/contants";
import { apiSlice } from "../apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('Login successful:', data);
          // Check if cookies were set
          const cookies = document.cookie;
          console.log('Cookies after login:', cookies);
        } catch (err) {
          console.error('Login failed:', err);
        }
      },
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
        credentials: "include",
      }),
    }),
    // Add a verify session endpoint
    verifySession: builder.query({
      query: () => ({
        url: `${USERS_URL}/verify-session`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useLogoutMutation,
  useVerifySessionQuery 
} = authApiSlice;
