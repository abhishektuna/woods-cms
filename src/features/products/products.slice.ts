import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productApi } from "./products.api";

export interface ProductState {
  data: any[];
  loading: boolean;
  error?: string | null;
}

const initialState: ProductState = {
  data: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchProducts = createAsyncThunk("products/fetchAll", async () => {
  return await productApi.getAll();
});

export const createProduct = createAsyncThunk("products/create", async (payload: any) => {
  return await productApi.create(payload);
});

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, payload }: { id: string; payload: any }) => {
    return await productApi.update(id, payload);
  }
);

export const deleteProduct = createAsyncThunk("products/delete", async (id: string) => {
  return await productApi.remove(id);
});

// Slice
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })

      .addCase(createProduct.pending, (state) => { state.loading = true; })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create product";
      })

      .addCase(updateProduct.pending, (state) => { state.loading = true; })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) state.data[index] = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update product";
      })

      .addCase(deleteProduct.pending, (state) => { state.loading = true; })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete product";
      });
  },
});

export default productsSlice.reducer;
