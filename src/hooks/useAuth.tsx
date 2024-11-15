import { createContext, useContext, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import apiClient from "../utils/apiClient";
import { setToken } from "../state/slices/authSlice";
import axios from "axios";
import Cookies from "js-cookie";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  role: "user" | "admin" | null;
  isRefreshed: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token, role } = useSelector((state: RootState) => state.auth);
  const [isRefreshed, setIsRefreshed] = useState<boolean>(false);

  useLayoutEffect(() => {
    const originalResponse = apiClient.interceptors.request.use((config) => {
      config.headers.Authorization = token
        ? `Bearer ${token}`
        : config.headers.Authorization;

      config.withCredentials = true;
      return config;
    });


    return () => {
      apiClient.interceptors.request.eject(originalResponse);
    };
  }, [token]);

  useLayoutEffect(() => {
    const refreshResponse = apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalResponse = error.config;

        console.log("refreshing token");
        console.log("error response status:", error.response.status);
        console.log("error message:", error.response.statusText);
        console.log("original response:", originalResponse);
        console.log("error:", error)

        if (error.response.status === 401 && error.response.statusText === 'Unauthorized' && !originalResponse._retry) {
          originalResponse._retry = true;
          try {
            console.log("cookie:", Cookies.get("refreshToken"));
            const response = await axios.get(
              `http://localhost:5000/api/refresh`,
              {
                withCredentials: true,
                headers: {Cookie: Cookies.get('refreshToken')}
              }
            );

            console.log("refreshed token:", response.data.accesstoken);
            setToken(response.data.accesstoken);
            setIsRefreshed(true);

            originalResponse.headers.Authorization = `Bearer ${response.data.accesstoken}`;
            return axios(originalResponse);
          } catch {
            console.log("no refreshing");
            setToken(null);
            setIsRefreshed(false);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      apiClient.interceptors.response.eject(refreshResponse);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!token, token, role, isRefreshed }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
