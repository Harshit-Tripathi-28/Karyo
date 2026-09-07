import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../services/auth.service";

import type { User } from "../types/auth";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => void;
  updateUser: (updatedUser: User) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "karyo_token";

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem(TOKEN_KEY)
  );

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser(token);

        setUser(response.user);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void restoreSession();
  }, [token]);

  const login = async (
    email: string,
    password: string
  ) => {
    const response = await loginUser({
      email,
      password,
    });

    localStorage.setItem(TOKEN_KEY, response.token);

    setToken(response.token);
    setUser(response.user);
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ) => {
    const response = await registerUser({
      name,
      email,
      password,
    });

    localStorage.setItem(TOKEN_KEY, response.token);

    setToken(response.token);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);

    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const refreshUser = async () => {
    if (!token) return;

    try {
      const response = await getCurrentUser(token);
      setUser(response.user);
    } catch {
      // Keep existing state if network fails
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      updateUser,
      refreshUser,
    }),
    [user, token, isLoading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}