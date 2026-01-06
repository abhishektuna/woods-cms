import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AuthState, LoginPayload, User } from "./auth.types";
import { loginApi, logoutApi, fetchMeApi } from "./auth.api";

/* -------- THUNKS -------- */

export const login = createAsyncThunk<User, LoginPayload, { rejectValue: string }>(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      return await loginApi(payload);
    } catch (err: any) {
      return rejectWithValue(err.message || "Login failed");
    }
  }
);

export const fetchMe = createAsyncThunk<User, void, { rejectValue: string }>(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchMeApi();
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch user");
    }
  }
);

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
    } catch (err: any) {
      return rejectWithValue(err.message || "Logout failed");
    }
  }
);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        console.log("action.payload", action.payload);
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message ?? "Login failed";
      })

      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload ?? action.error?.message ?? "Failed to fetch user";
      })

      .addCase(logout.fulfilled, () => initialState)
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload ?? action.error?.message ?? "Logout failed";
      });
  },
});

export default authSlice.reducer;
