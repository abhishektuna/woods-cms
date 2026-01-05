import { combineReducers } from "@reduxjs/toolkit";

// feature reducers (we’ll add these later)
import authReducer from "../features/auth/auth.slice";
// import usersReducer from "@/features/users/users.slice";
import categoriesReducer from "../features/categories/categories.slice";
import subcategoriesReducer from "../features/subcategories/subcategories.slice";
import productsReducer from "../features/products/products.slice";

export const rootReducer = combineReducers({
  auth: authReducer,
//   users: usersReducer,
  categories: categoriesReducer,
  subcategories: subcategoriesReducer,
  products: productsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
