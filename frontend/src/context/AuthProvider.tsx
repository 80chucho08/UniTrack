import { useState, type ReactNode } from "react";
import { AuthContext, type User } from "./AuthContext";

interface Props {
  children: ReactNode;
}

// Lee la sesión guardada una sola vez, al crear el estado inicial.
function readStoredSession(): { token: string | null; user: User | null } {
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!storedToken || !storedUser) {
    return { token: null, user: null };
  }

  try {
    return { token: storedToken, user: JSON.parse(storedUser) as User };
  } catch {
    return { token: null, user: null };
  }
}

export const AuthProvider = ({ children }: Props) => {
  const [session, setSession] = useState(readStoredSession);

  const login = (token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setSession({ token, user });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setSession({ token: null, user: null });
  };

  return (
    <AuthContext.Provider
      value={{
        user: session.user,
        token: session.token,
        login,
        logout,
        isAuthenticated: !!session.token,
        // La sesión se lee de forma síncrona, así que nunca hay carga pendiente.
        loading: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
