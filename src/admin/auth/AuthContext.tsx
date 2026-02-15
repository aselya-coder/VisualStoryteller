import { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthProvider required");
  return ctx;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const v = localStorage.getItem("vs_admin_auth");
    setIsAuthenticated(v === "1");
  }, []);

  const login = async (email: string, password: string) => {
    const ok = email === "admin@visualstoryteller.app" && password === "admin123";
    if (ok) {
      localStorage.setItem("vs_admin_auth", "1");
      setIsAuthenticated(true);
    }
    return ok;
  };

  const logout = () => {
    localStorage.removeItem("vs_admin_auth");
    setIsAuthenticated(false);
  };

  const value = useMemo(() => ({ isAuthenticated, login, logout }), [isAuthenticated]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

