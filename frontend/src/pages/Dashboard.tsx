import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SemesterCard } from "../components/SemesterCard";
import { AddSemesterCard } from "../components/AddSemesterCard";
import { Sidebar } from "../components/Sidebar";

function Dashboard() {
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

        {/* Sidebar */}
        <Sidebar />

      </div>
    </div>
  );
}

export default Dashboard;

