import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://192.168.1.6:3000/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // If using cookies/JWT
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
