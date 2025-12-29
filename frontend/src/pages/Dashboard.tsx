import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SemesterCard } from "../components/SemesterCard";
import { AddSemesterCard } from "../components/AddSemesterCard";
import { Sidebar } from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";
import {
  getSemesters,
  createSemester,
  type Semester,
} from "../services/semesterService";

function Dashboard() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        if (!token) return;
        const data = await getSemesters(token);
        setSemesters(data);
      } catch (error) {
        console.error("Error al obtener semestres: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSemesters();
  }, [token]);

  const handleAddSemester = async (name: string) => {
    try {
      if (!token) return;

      const response = await createSemester(name, token);

      const newSemester = {
        id: response.semesterId,
        name
      };

      setSemesters((prev) => [...prev, newSemester]);
    } catch (error) {
      console.error("Error al crear semestre: ", error);
    }
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
          {loading && (
            <p className="text-gray-500">
              Cargando Semestres...
            </p>
          )}

          {!loading && semesters.length === 0 && (
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

