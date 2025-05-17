import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URI = import.meta.env.VITE_APP_BASE_URL;

const baseQuery = fetchBaseQuery({ 
  baseUrl: API_URI + "/api",
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    headers.set('Content-Type', 'application/json');
    return headers;
  }
});

// Add response interceptor to log responses and handle session errors
const baseQueryWithInterceptor = async (args, api, extraOptions) => {
  console.log('Making request:', { url: args.url, method: args.method });
  const result = await baseQuery(args, api, extraOptions);
  
  if (result.error) {
    console.error('API Error:', {
      endpoint: args.url,
      status: result.error.status,
      data: result.error.data
    });
  }
  
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithInterceptor,
  tagTypes: ['Task', 'User'],
  endpoints: (builder) => ({}),
});


