import { createBrowserRouter } from "react-router-dom";

// layouts
import { AdminLayout } from "../components/layouts/AdminLayout";

// pages
import App from "../App";
import Login from "../features/auth/pages/Login";
import Unauthorized from "../pages/Unauthorized";
import AdminHome from "../features/admin/pages/AdminHome";
import { ProductPage } from "../features/products/pages/ProductPage";

// guards
import ProtectedRoute from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import ProductCreate from "../features/products/pages/ProductCreate";
import { CategoryPage } from "../features/categories/pages/CategoryPage";
import { CategoryForm } from "../features/categories/components/CategoryForm";
import { SubCategoryPage } from "../features/subcategories/pages/SubCategoryPage";
import { SubCategoryForm } from "../features/subcategories/components/SubCategoryForm";

export const router = createBrowserRouter([
  /* ---------- Unauthorized ---------- */
  {
    path: "/unauthorized",
    Component: Unauthorized,
  },

  /* ---------- Public Routes ---------- */
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: PublicRoute(Login),
      },
       {
        path: "/login",
        Component: PublicRoute(Login),
      },
    ],
  },

  /* ---------- Admin Protected Routes ---------- */
  {
    element: <ProtectedRoute allowedRoles={["admin"]} />, 
    children: [
      {
        path: "/admin-dashboard",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminHome />,
          },

          /* ---------- Products ---------- */
          {
            path: "product",
            element: <ProductPage />,
          },
           {
            path: "product/create",
            element: <ProductCreate />,
          },
          /* ---------- Category ---------- */
 {
            path: "category",
            element: <CategoryPage />,
          },
           {
            path: "category/create",
            element: <CategoryForm />,
          },

           /* ---------- SubCategory ---------- */
 {
            path: "subcategory",
            element: <SubCategoryPage />,
          },
           {
            path: "subcategory/create",
            element: <SubCategoryForm />,
          },
          {
            path: "subcategory/:id",
            element: <SubCategoryForm />,
          }
        ],
      },
    ],
  },
]
);
