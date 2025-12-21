import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No autenticado");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:3000/api/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error("Error de autenticación");
        }

        const data = await response.json();
        setUser(data);

      } catch (err) {
        setError("Sesión inválida");
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-xl shadow-md max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-2">
          Bienvenido, {user.name}
        </h1>
        <p className="text-gray-600">{user.email}</p>
      </div>
    </div>
  );
}

export default Dashboard;
