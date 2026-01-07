import API from "../../lib/axios";

/* ================= TYPES ================= */

export interface CategoryPayload {
  title: string;
  image?: string;
}

export interface Category extends CategoryPayload {
  _id: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/* ================= API CALLS ================= */

// GET all categories
export const getCategoriesAPI = async (): Promise<Category[]> => {
  const res = await API.get("/categories");
  return res.data.data || res.data;
};

// CREATE category
export const createCategoryAPI = async (
  payload: CategoryPayload
): Promise<Category> => {
  const res = await API.post("/categories", payload);
  return res.data.data || res.data;
};

// UPDATE category
export const updateCategoryAPI = async (
  id: string,
  payload: CategoryPayload
): Promise<Category> => {
  const res = await API.patch(`/categories/${id}`, payload);
  return res.data.data || res.data;
};

// DELETE category (soft delete on backend)
export const deleteCategoryAPI = async (id: string): Promise<void> => {
  await API.delete(`/categories/${id}`);
};
