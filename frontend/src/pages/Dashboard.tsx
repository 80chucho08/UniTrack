import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SemesterCard } from "../components/SemesterCard";
import { AddSemesterCard } from "../components/AddSemesterCard";
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

    <>
      {/* Header */}
      <header className="p-8 pb-0"> {/* Añadí padding para que alinee con el main */}
        <h1 className="text-4xl font-extrabold text-gray-900">
          Mis Semestres
        </h1>
        <p className="text-gray-500 mt-1">
          Gestiona tus periodos académicos en UniTrack
        </p>
      </header>

      {/* Main section */}
      <main className="p-8">
        {loading && (
          <p className="text-gray-500">Cargando Semestres...</p>
        )}

        {!loading && semesters.length === 0 && (
          <p className="text-gray-500 mb-4">
            Aún no tienes semestres registrados.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {semesters.map((semester) => (
            <SemesterCard
              key={semester.id}
              name={semester.name}
              onClick={() => navigate(`/dashboard/semester/${semester.id}`)}
            />
          ))}
          <AddSemesterCard onAdd={handleAddSemester} />
        </div>
      </main>
    </>
  );
}

export default Dashboard;

