import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'user')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps>= ({children, allowedRoles=['user','admin']})=>{

  const {user, isAuthenticated} = useAuth()

  const location = useLocation();

  if(!isAuthenticated){
    return <Navigate to='/login' state={{from:location}} replace />
  }

  if(user?.role){
    if(allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)){
      return <Navigate to='/unauthorized' replace />
    }
  }

  return <>{children}</>

}