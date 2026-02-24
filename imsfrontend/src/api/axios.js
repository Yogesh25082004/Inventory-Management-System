import axios from "axios";
import { getStoredAuthToken } from "../auth/AuthContext";

const api = axios.create({
  baseURL: "http://localhost:9999/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getStoredAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
