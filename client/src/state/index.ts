import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface initialStateTypes {
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
  user: any | null;
  token: string | null;
}

const initialState: initialStateTypes = {
  isSidebarCollapsed: false,
  isDarkMode: false,
  user: null,
  token: null,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    setAuth: (state, action: PayloadAction<{ user?: any; token?: string | null }>) => {
      if (action.payload.user !== undefined) state.user = action.payload.user;
      if (action.payload.token !== undefined) state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setIsSidebarCollapsed, setIsDarkMode, setAuth, logout } = globalSlice.actions;
export default globalSlice.reducer;
