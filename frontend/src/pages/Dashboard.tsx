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
    setSemesters((prev) => [...prev, newSemester]);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Mis Semestres
        </h1>
        <p className="text-gray-500 mt-1">
          Gestiona tus periodos académicos en UniTrack
        </p>
      </header>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Semesters section */}
        <main className="lg:col-span-3">
          {semesters.length === 0 && (
            <p className="text-gray-500 mb-4">
              Aún no tienes semestres registrados.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {semesters.map((semester) => (
              <SemesterCard
                key={semester.id}
                name={semester.name}
                onClick={() =>
                  navigate(`/dashboard/semester/${semester.id}`)
                }
              />
            ))}

            <AddSemesterCard onAdd={handleAddSemester} />
          </div>
        </main>

        {/* User info / sidebar */}
        <aside className="bg-white p-6 rounded-xl shadow-md h-fit">
          <h2 className="text-xl font-bold mb-2">
            Bienvenido
          </h2>

          <p className="text-gray-800 font-medium">
            {user?.name}
          </p>

          <p className="text-gray-500 text-sm mb-6">
            {user?.email}
          </p>

          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
          >
            Cerrar sesión
          </button>
        </aside>

      </div>
    </div>
  );
}

export default Dashboard;
