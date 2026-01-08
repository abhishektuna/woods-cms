import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productTireKeyApi } from "./productTireKey.api";

export interface ProductTireKey {
  _id: string;
  type: string;
  color: string;
}

interface ProductTireKeyState {
  data: ProductTireKey[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductTireKeyState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchProductTireKeys = createAsyncThunk(
  "productTireKey/fetchAll",
  async () => {
    return await productTireKeyApi.getAll();
  }
);

const slice = createSlice({
  name: "productTireKey",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductTireKeys.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductTireKeys.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProductTireKeys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tire keys";
      });
  },
});

export default slice.reducer;
