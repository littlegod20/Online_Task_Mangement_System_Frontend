import { TaskProps } from "../pages/common/Home";
import apiClient from "../utils/apiClient";

export const fetchProtectedData = async (path: string) => {
  try {
    const response = await apiClient.get(path);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const postProtectedData = async (path: string, taskData: TaskProps) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No access token found in localStorage");
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await apiClient.post(path, taskData, config);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};
