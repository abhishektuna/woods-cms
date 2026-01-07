import API from "../../lib/axios";

/* ================= TYPES ================= */

export interface SubCategoryPayload {
  title: string;
  image?: string;
  categoryId: string;
}

export interface SubCategory extends SubCategoryPayload {
  _id: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/* ================= API CALLS ================= */

// GET all subcategories
export const getSubCategoriesAPI = async (): Promise<SubCategory[]> => {
  const res = await API.get("/subcategories");
  return res.data.data || res.data;
};

// CREATE subcategory
export const createSubCategoryAPI = async (
  payload: SubCategoryPayload
): Promise<SubCategory> => {
  const res = await API.post("/subcategories", payload);
  return res.data.data || res.data;
};

// UPDATE subcategory
export const updateSubCategoryAPI = async (
  id: string,
  payload: SubCategoryPayload
): Promise<SubCategory> => {
  const res = await API.patch(`/subcategories/${id}`, payload);
  return res.data.data || res.data;
};

// DELETE subcategory (soft delete)
export const deleteSubCategoryAPI = async (id: string): Promise<void> => {
  await API.delete(`/subcategories/${id}`);
};
