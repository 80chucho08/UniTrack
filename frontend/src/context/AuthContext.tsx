import { createContext } from "react";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

// El proveedor vive en AuthProvider.tsx para que este archivo solo exporte
// el contexto y sus tipos (requisito de React Fast Refresh).
export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);
