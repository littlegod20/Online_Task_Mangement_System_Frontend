import { createContext, useContext, useLayoutEffect } from "react";
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
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token, role } = useSelector((state: RootState) => state.auth);

  useLayoutEffect(() => {
    const originalResponse = apiClient.interceptors.request.use((config) => {
      config.headers.Authorization = token
        ? `Bearer ${token}`
        : config.headers.Authorization;

      config.withCredentials = true;
      return config;
    });

    console.log("original:", token);

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

        if (error.response.status === 401 && !originalResponse._retry) {
          originalResponse._retry = true;
          try {
            console.log("cookie:", Cookies.get("refreshToken"));
            const response = await apiClient.get("/refresh", {
              withCredentials: true,
              headers: { Cookie: Cookies.get("refreshToken") },
            });

            setToken(response.data.accesstoken);

            console.log("refreshed token:", response.data.accesstoken);

            originalResponse.headers.Authorization = `Bearer ${response.data.accesstoken}`;
            return axios(originalResponse);
          } catch {
            console.log("no refreshing");
            setToken(null);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      apiClient.interceptors.response.eject(refreshResponse);
    };
  },[]);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, token, role }}>
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
