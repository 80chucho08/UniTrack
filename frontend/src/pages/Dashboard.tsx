import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { SemesterCard } from "../components/SemesterCard";
import { AddSemesterCard } from "../components/AddSemesterCard";

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [semesters, setSemesters] = useState([
    { id: 1, name: "1er Semestre" },
    { id: 2, name: "2do Semestre" }
  ]);

  const handleAddSemester = (name: string) => {
    const newSemester = {
      id: Date.now(),
      name
    };
    setSemesters([...semesters, newSemester]);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <header>
        <h1 className="text-4xl font-extrabold text-gray-900">Mis Semestres</h1>
        <p className="text-gray-500">Gestiona tus periodos académicos en UniTrack</p>
      </header>
      {semesters.length === 0 ? (
        <div>
          <p>Aun no tienes semestres registrados.</p>
          <div>
            <AddSemesterCard onAdd={handleAddSemester} />
          </div>
        </div>
      ) : (
        <div>
          {semesters.map((s) => (
            <SemesterCard
              key={s.id}
              name={s.name}
              onClick={() => navigate(`/dashboard/semester/${s.id}`)}
            />
          ))}
          <AddSemesterCard onAdd={handleAddSemester} />
        </div>
        )
      }
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">
          Bienvenido, {user?.name}
        </h1>

        <p className="text-gray-600 mb-6">
          Email: <span className="font-medium">{user?.email}</span>
        </p>

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
