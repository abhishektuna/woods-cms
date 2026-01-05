import { handleApiError } from "../utils/handleApiError";
import API from "./axios"

API.interceptors.response.use(
  (response) => response,
  (error) => {
    handleApiError(error);
    return Promise.reject(error);
  }
);
