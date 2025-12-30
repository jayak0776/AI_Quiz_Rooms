import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api", // change if needed
  headers: {
    "Content-Type": "application/json",
  },
});

/* 🔐 Attach Token Automatically */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* 🚫 Handle Token Expiry / Unauthorized */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
