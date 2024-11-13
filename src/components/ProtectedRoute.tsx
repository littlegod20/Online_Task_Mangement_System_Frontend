import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import { setToken } from "../state/slices/authSlice";
import axios from "axios";
import Cookies from "js-cookie";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "user")[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = ["user", "admin"],
}) => {
  const { isAuthenticated, token } = useAuth();
  const { role } = useSelector((state: RootState) => state.auth);

  // const location = useLocation();

  if (!isAuthenticated) {
    console.log("invalidToken:", token);
    refreshToken()
      .then((response) => console.log("refreshToken response:", response))
      .catch((error) => console.log("refreshToken error", error));
    // return <Navigate to="/login" state={{ from: location }} replace />;
  } else {
    console.log("validtoken", token);
  }

  console.log("user role:", role);
  if (role) {
    if (allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

const refreshToken = async () => {
  console.log("something here");
  try {
    console.log("refresh cookie:", Cookies.get("refreshToken"));
    const refresh = await axios.get(`http://localhost:5000/api/refresh`, {
      headers: { Cookie: Cookies.get("refreshToken") },
    });
    console.log("refresh data:", refresh.data);
    setToken(refresh.data);
  } catch (error) {
    console.error("Error refreshing token:", error);
  }
};
