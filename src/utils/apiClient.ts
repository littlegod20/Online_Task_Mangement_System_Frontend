import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api/tasks",
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
