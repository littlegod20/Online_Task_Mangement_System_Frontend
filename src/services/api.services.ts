import { TaskProps } from "../pages/common/Home";
import apiClient from "../utils/apiClient";

export const fetchProtectedData = async (path: string) => {
  try {
    const response = await apiClient.get(path);
    return response.data;
  } catch (error) {
    console.log(
      "Error fetching data:",
      error instanceof Error ? error.message : String(error)
    );
  }
};

export const postProtectedData = async (path: string, taskData: TaskProps) => {
  try {
    const response = await apiClient.post(path, taskData);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

export const putProtectedData = async (path: string, taskData: TaskProps) => {
  try {
    const response = await apiClient.put(path, taskData);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

export const deleteProtectedData = async (path: string) => {
  try {
    const response = await apiClient.delete(path);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};
