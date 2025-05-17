import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,

  isSidebarOpen: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = { ...action.payload, isAuthenticated: true };
      localStorage.setItem("userInfo", JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("userInfo");
      // Clear any session cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    },
    setOpenSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
  },
});

export const { setCredentials, logout, setOpenSidebar } = authSlice.actions;

// Selectors
export const selectIsAuthenticated = (state) => 
  state.auth.user?.isAuthenticated ?? false;

export default authSlice.reducer;
