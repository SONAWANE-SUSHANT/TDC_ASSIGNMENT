import axios from "axios";

const fallbackBaseURL = import.meta.env.PROD
  ? "https://tdc-assignment.onrender.com/api"
  : "http://localhost:5000/api";

const baseURL = (import.meta.env.VITE_API_BASE_URL || fallbackBaseURL).replace(/\/$/, "");

const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  }
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("matchmaker_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("matchmaker_token");
      localStorage.removeItem("matchmaker_user");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
