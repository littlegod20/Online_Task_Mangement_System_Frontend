import apiClient from "../utils/apiClient";

export const postProtectedData = async (path: string) => {
  try {
    const response = await apiClient.post(path);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
