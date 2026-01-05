import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {
  getSubCategoriesAPI,
  createSubCategoryAPI,
  updateSubCategoryAPI,
  deleteSubCategoryAPI,
  type SubCategory,
  type SubCategoryPayload,
} from "./subcategories.api";

/* -------------------- State -------------------- */
interface SubCategoryState {
  data: SubCategory[];
  loading: boolean;
  error: string | null;
}

const initialState: SubCategoryState = {
  data: [],
  loading: false,
  error: null,
};

/* -------------------- Thunks -------------------- */
export const fetchSubCategories = createAsyncThunk<SubCategory[]>(
  "subcategories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await getSubCategoriesAPI();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const createSubCategory = createAsyncThunk<
  SubCategory,
  SubCategoryPayload
>("subcategories/create", async (payload, { rejectWithValue }) => {
  try {
    return await createSubCategoryAPI(payload);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const updateSubCategory = createAsyncThunk<
  SubCategory,
  { id: string; data: SubCategoryPayload }
>("subcategories/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    return await updateSubCategoryAPI(id, data);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const deleteSubCategory = createAsyncThunk<string, string>(
  "subcategories/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteSubCategoryAPI(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

/* -------------------- Slice -------------------- */
const subcategoriesSlice = createSlice({
  name: "subcategories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchSubCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create
      .addCase(createSubCategory.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })

      // Update
      .addCase(updateSubCategory.fulfilled, (state, action) => {
        state.data = state.data.map((s) =>
          s._id === action.payload._id ? action.payload : s
        );
      })

      // Delete
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (s) => s._id !== action.payload
        );
      });
  },
});

export default subcategoriesSlice.reducer;
