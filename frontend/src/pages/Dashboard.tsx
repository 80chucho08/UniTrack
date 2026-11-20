import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Calendar, ChevronRight, GraduationCap, LayoutList } from "lucide-react";
import { SemesterCard } from "../components/SemesterCard";
import { AddSemesterCard } from "../components/AddSemesterCard";
import { AuthContext } from "../context/AuthContext";
import {
  getSemesters,
  createSemester,
  type Semester,
} from "../services/semesterService";

// Pasos para organizar el periodo (texto fijo de guía)
const STEPS = [
  { title: "Crea tu semestre", text: "Registra el periodo académico que estás cursando." },
  { title: "Agrega tus materias", text: "Dentro del semestre, añade cada materia con su profesor." },
  { title: "Organízate", text: "Arma tu horario y lleva notas, tareas y calificaciones." },
];

function Dashboard() {
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);

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

  const handleAddSemester = async (name: string, period: string) => {
    try {
      if (!token) return;

      const response = await createSemester(name, period, token);

      const newSemester = {
        id: response.semesterId,
        name,
        period
      };

      setSemesters((prev) => [...prev, newSemester]);
    } catch (error) {
      console.error("Error al crear semestre: ", error);
    }
  };

  const firstName = user?.name?.split(" ")[0];

  const shortcuts = [
    {
      label: "Horario",
      text: "Tus clases de la semana",
      icon: <Calendar size={20} />,
      accent: "bg-sky-50 text-sky-600",
      to: "/dashboard/schedule",
    },
    {
      label: "To-Do List",
      text: "Tareas de todas tus materias",
      icon: <LayoutList size={20} />,
      accent: "bg-amber-50 text-amber-600",
      to: "/dashboard/todo",
    },
  ];

  return (
    <main className="p-6 lg:p-10 max-w-7xl w-full mx-auto">
      {/* Bienvenida */}
      <header className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 p-6 md:p-8 text-white shadow-sm">
        <GraduationCap
          size={180}
          strokeWidth={1}
          className="absolute -right-6 -bottom-10 text-white/10 pointer-events-none"
        />
        <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
              {firstName ? `Hola, ${firstName}` : "Bienvenido"}
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Mis Semestres
            </h1>
            <p className="text-white/80 mt-1">
              Gestiona tus periodos académicos en UniTrack
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-2xl px-5 py-3 self-start md:self-auto">
            <BookOpen size={22} className="text-white/80" />
            <div>
              <p className="text-2xl font-extrabold leading-tight">
                {loading ? "—" : semesters.length}
              </p>
              <p className="text-xs text-white/70">
                {semesters.length === 1 ? "semestre registrado" : "semestres registrados"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Semestres */}
        <section className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2">
              <GraduationCap size={20} className="text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-800">Periodos académicos</h2>
              {!loading && (
                <span className="text-sm text-gray-400">({semesters.length})</span>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-100 rounded-xl" />
              ))}
            </div>
          ) : (
            <>
              {semesters.length === 0 && (
                <p className="text-gray-500 mb-4">
                  Aún no tienes semestres registrados.
                </p>
              )}

              <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
                {semesters.map((semester) => (
                  <SemesterCard
                    key={semester.id}
                    name={semester.name}
                    onClick={() => navigate(`/dashboard/semester/${semester.id}`)}
                  />
                ))}
                <AddSemesterCard onAdd={handleAddSemester} />
              </div>
            </>
          )}
        </section>

        {/* Panel lateral */}
        <aside className="flex flex-col gap-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Accesos rápidos</h2>
            <div className="flex flex-col gap-2">
              {shortcuts.map((item) => (
                <button
                  key={item.to}
                  onClick={() => navigate(item.to)}
                  className="group flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-sm text-left transition-all"
                >
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.accent}`}>
                    {item.icon}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                      {item.label}
                    </span>
                    <span className="block text-xs text-gray-500 truncate">{item.text}</span>
                  </span>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Cómo organizarte</h2>
            <ol className="flex flex-col gap-4">
              {STEPS.map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <span className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{step.title}</p>
                    <p className="text-sm text-gray-500">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </main>
  );
}

export default Dashboard;
