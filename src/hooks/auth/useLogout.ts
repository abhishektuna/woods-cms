import { useAppDispatch } from "../../app/hooks"; // typed dispatch
import { logout } from "../../features/auth/auth.slice"

export function useLogout() {
  const dispatch = useAppDispatch();

  return () => {
    // dispatch the logout thunk
    dispatch(logout())
      .finally(() => {
        window.location.href = "/login";
      });
  };
}
