import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCategoriesAPI,
  createCategoryAPI,
  updateCategoryAPI,
  deleteCategoryAPI,
  type Category,
  type CategoryPayload,
} from "./categories.api";

/* -------------------- State -------------------- */
interface CategoryState {
  data: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  data: [],
  loading: false,
  error: null,
};

/* -------------------- Thunks -------------------- */
export const fetchCategories = createAsyncThunk<Category[]>(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await getCategoriesAPI();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const createCategory = createAsyncThunk<Category, CategoryPayload>(
  "categories/create",
  async (payload, { rejectWithValue }) => {
    try {
      return await createCategoryAPI(payload);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateCategory = createAsyncThunk<
  Category,
  { id: string; data: CategoryPayload }
>("categories/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    return await updateCategoryAPI(id, data);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const deleteCategory = createAsyncThunk<string, string>(
  "categories/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteCategoryAPI(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

/* -------------------- Slice -------------------- */
const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create
      .addCase(createCategory.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })

      // Update
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.data = state.data.map((c) =>
          c._id === action.payload._id ? action.payload : c
        );
      })

      // Delete
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (c) => c._id !== action.payload
        );
      });
  },
});

export default categoriesSlice.reducer;
