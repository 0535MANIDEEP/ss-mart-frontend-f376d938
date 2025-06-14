
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://ss-mart-backend.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT for admin
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("ssmart_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
