import { createContext, useContext, useState } from "react";
import { AuthProps } from "../types/auth.types";

interface AuthContextType {
  user: AuthProps | null;
  isAuthenticated: boolean;
  login: (user: AuthProps) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthProps | null>(null);

  const login = (userData: AuthProps) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};


// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () =>{
  const context = useContext(AuthContext);
  
  if(!context){
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}