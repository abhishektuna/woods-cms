import axios from "axios";

export function useApiError() {
  const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Something went wrong"
      );
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "Unexpected error occurred";
  };

  return { getErrorMessage };
}
