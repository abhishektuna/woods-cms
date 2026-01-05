import axios from "axios";
import { API_BASE_URL } from "../constants/api";

export default axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 🔥 cookies auto-sent
  timeout: 15000,
});
