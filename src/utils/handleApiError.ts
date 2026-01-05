import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { ROUTES } from "../constants/routes";

interface ApiErrorResponse {
  message?: string;
}

export function handleApiError(error: unknown) {
  if (error instanceof AxiosError) {
    const message =
      (error.response?.data as ApiErrorResponse)?.message ||
      error.message ||
      "Something went wrong";

    const status = error.response?.status;

    // Only show a 401 toast if the user is on a protected route
    if (status === 401) {
      const pathname = window.location.pathname;
      const protectedPrefixes = [ROUTES.ADMIN_DASHBOARD, ROUTES.CREATOR_DASHBOARD];
      const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));

      if (isProtected) {
        toast.error(message);
      }

      throw error;
    }

    toast.error(message);
    throw error;
  }

  toast.error("Unexpected error");
  throw error;
}
