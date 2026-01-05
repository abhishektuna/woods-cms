import { useAppSelector } from "../redux/useAppSelector";

export function useAuth() {
  const { user, isAuthenticated, loading } = useAppSelector(
    (state) => state.auth
  );

  return {
    user,
    isAuthenticated,
    role: user?.role ?? null,
    isLoading:loading,
  };
}
