import { createContext, useContext, useState, useEffect } from "react";

import type { ReactNode } from "react";
import { loginUser, registerUser, getCurrentUser } from "../api/users";

interface User {
  id: number;
  username: string;
  email: string;
  level?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, email: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState<boolean>(true);

  
  const login = async (username: string, password: string) => {
    try {
      const data = await loginUser({ username, password });
      const accessToken = data.access; 
      setToken(accessToken);
      localStorage.setItem("token", accessToken);
      await fetchUser(); 
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  
  const register = async (username: string, password: string, email: string) => {
    try {
      await registerUser({ username, password, email });
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    }
  };

  
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  
  const fetchUser = async () => {
    const currentToken = localStorage.getItem("token");
    if (!currentToken) return;

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Failed to fetch user", error);
      logout();
    }
  };

  
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await fetchUser();
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};