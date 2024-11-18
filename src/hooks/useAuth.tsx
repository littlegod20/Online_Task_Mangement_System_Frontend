import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../state/store";
import apiClient from "../utils/apiClient";
import { setToken } from "../state/slices/authSlice";
import axios from "axios";

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
  const dispatch = useDispatch<AppDispatch>();
  const { token, role } = useSelector((state: RootState) => state.auth);
  const [isRefreshed, setIsRefreshed] = useState<boolean>(false);

  useLayoutEffect(() => {
    const originalResponse = apiClient.interceptors.request.use((config) => {
      config.headers.Authorization = token
        ? `Bearer ${token}`
        : config.headers.Authorization;
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

        if (
          error.response.status === 401 &&
          error.response.statusText === "Unauthorized"
        ) {
          originalResponse._retry = true;
          try {
            const response = await axios.get(
              `http://localhost:5000/api/refresh`,
              {
                withCredentials: true,
                headers: {Cookie: Cookies.get('refreshToken')}
              }
            );

            dispatch(setToken(response.data.accesstoken));
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   console.log("isRefresh:", isRefreshed);
  //   console.log("token:", token);
  // });

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
