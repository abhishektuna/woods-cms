import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/rootReducer";
import { useEffect } from "react";
import { useAppDispatch } from "../app/hooks";
import { fetchMe } from "../features/auth/auth.slice";
import { Loader } from "../components/common/Loader/Loader";

interface ProtectedRouteProps {
  allowedRoles?: Array<"admin" | "user">;
}

export default function ProtectedRoute({
  allowedRoles = [],
}: ProtectedRouteProps) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, loading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (!loading && !isAuthenticated && !user) {
      dispatch(fetchMe());
    }
  }, [dispatch, loading, isAuthenticated, user]);

  /* -------- Loading (restore session) -------- */
  if (loading) return <Loader />;

  /* -------- Not Logged In -------- */
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const role: "admin" | "user" = user.data.role;
  /* -------- Role Guard -------- */
  if (allowedRoles.length && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  /* -------- Access Granted -------- */
  return <Outlet />;
}
