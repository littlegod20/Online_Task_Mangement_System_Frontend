import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "user")[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = ["user", "admin"],
}) => {
  const { isAuthenticated, token, isRefreshed } = useAuth();
  const { role } = useSelector((state: RootState) => state.auth);

  // const location = useLocation();

  console.log('isAuthenticated:',isAuthenticated)
  console.log("isRefreshed:", isRefreshed);

  if (!isAuthenticated && !isRefreshed ) {
    console.log("invalidToken:", token);
    // return <Navigate to="/login" state={{ from: location }} replace />;
  } else {
    console.log("validtoken", token);
  }

  if (role) {
    if (allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};
