import API from "../../lib/axios";

import type { LoginPayload, User } from "./auth.types";

export const loginApi = async (
  payload: LoginPayload
): Promise<User> => {
  const res = await API.post("/auth/login", payload);
  return res.data; 
};

export const fetchMeApi = async (): Promise<User> => {
  const res = await API.get("/auth/me");
  return res.data;
};

export const logoutApi = async (): Promise<void> => {
  await API.post("/auth/logout");
};

