import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ChevronRight, LayoutGrid, LayoutList, List } from "lucide-react";
import { SemesterCard } from "../components/SemesterCard";
import { AddSemesterCard } from "../components/AddSemesterCard";
import { AuthContext } from "../context/AuthContext";
import {
  getSemesters,
  createSemester,
  type Semester,
} from "../services/semesterService";
import { compareSemesters } from "../utils/semester";

// Pasos para organizar el periodo (es una secuencia real, por eso va numerada)
const STEPS = [
  { title: "Crea tu semestre", text: "Registra el periodo académico que estás cursando." },
  { title: "Agrega tus materias", text: "Dentro del semestre, añade cada materia con su profesor." },
  { title: "Organízate", text: "Arma tu horario y lleva notas, tareas y calificaciones." },
];

type ViewMode = "grid" | "list";
const VIEW_KEY = "unitrack.semesters.view";

// Vista guardada en el navegador (cuadrícula por defecto)
function readSavedView(): ViewMode {
  try {
    return localStorage.getItem(VIEW_KEY) === "list" ? "list" : "grid";
  } catch {
    return "grid";
  }
}

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

function Dashboard() {
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);

  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>(readSavedView);

  const changeView = (mode: ViewMode) => {
    setView(mode);
    try {
      localStorage.setItem(VIEW_KEY, mode);
    } catch {
      // sin almacenamiento disponible: la vista solo dura esta visita
    }
  };

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
  const orderedSemesters = [...semesters].sort(compareSemesters);

  const shortcuts = [
    {
      label: "Horario",
      text: "Tus clases de la semana",
      icon: <Calendar size={18} />,
      to: "/dashboard/schedule",
    },
    {
      label: "To-Do List",
      text: "Tareas de todas tus materias",
      icon: <LayoutList size={18} />,
      to: "/dashboard/todo",
    },
  ];

  return (
    <div className="px-4 py-8 md:px-8 lg:px-10 lg:py-10 max-w-6xl w-full mx-auto">
      {/* Encabezado */}
      <header className="mb-8">
        <h2 className="text-3xl md:text-[2.5rem] md:leading-[1.1] font-extrabold tracking-tight text-ink">
          {greeting()}{firstName ? `, ${firstName}` : ""}
        </h2>
        <p className="mt-2 text-ink-muted">
          {loading
            ? "Cargando tus semestres..."
            : semesters.length === 0
              ? "Aún no tienes semestres registrados. Empieza por crear el que estás cursando."
              : `Tienes ${semesters.length} ${semesters.length === 1 ? "semestre registrado" : "semestres registrados"}. Elige uno para ver sus materias.`}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-6 items-start">
        {/* Semestres */}
        <section className="bg-surface rounded-2xl border border-line p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3 px-3 pt-1 pb-3">
            <h3 className="text-lg font-bold text-ink">
              Semestres
              {!loading && semesters.length > 0 && (
                <span className="ml-2 text-sm font-medium text-ink-subtle tabular-nums">{semesters.length}</span>
              )}
            </h3>

            {/* Selector de vista */}
            <div className="flex items-center p-0.5 rounded-lg bg-canvas ring-1 ring-line">
              {([
                { mode: "grid", icon: <LayoutGrid size={15} />, label: "Cuadrícula" },
                { mode: "list", icon: <List size={15} />, label: "Lista" },
              ] as const).map((option) => (
                <button
                  key={option.mode}
                  onClick={() => changeView(option.mode)}
                  aria-pressed={view === option.mode}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors
                    ${view === option.mode
                      ? "bg-surface text-ink shadow-sm ring-1 ring-line"
                      : "text-ink-subtle hover:text-ink"}`}
                >
                  {option.icon}
                  <span className="hidden sm:inline">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 px-3 py-3">
                  <div className="w-12 h-12 rounded-xl bg-canvas" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-2/5 rounded bg-canvas" />
                    <div className="h-3 w-1/4 rounded bg-canvas" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {view === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-2 sm:gap-3 px-1 pb-1">
                  {orderedSemesters.map((semester) => (
                    <SemesterCard
                      key={semester.id}
                      variant="grid"
                      name={semester.name}
                      onClick={() => navigate(`/dashboard/semester/${semester.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {orderedSemesters.map((semester) => (
                    <SemesterCard
                      key={semester.id}
                      variant="list"
                      name={semester.name}
                      onClick={() => navigate(`/dashboard/semester/${semester.id}`)}
                    />
                  ))}
                </div>
              )}
              <div className={`${semesters.length > 0 ? "mt-2 pt-2 border-t border-line" : ""}`}>
                <AddSemesterCard onAdd={handleAddSemester} />
              </div>
            </>
          )}
        </section>

        {/* Panel lateral */}
        <aside className="bg-surface rounded-2xl border border-line divide-y divide-line">
          <section className="p-5">
            <h3 className="text-sm font-semibold text-ink mb-3">Accesos rápidos</h3>
            <div className="flex flex-col gap-1 -mx-2">
              {shortcuts.map((item) => (
                <button
                  key={item.to}
                  onClick={() => navigate(item.to)}
                  className="group flex items-center gap-3 px-2 py-2 rounded-lg text-left hover:bg-canvas transition-colors"
                >
                  <span className="w-9 h-9 rounded-lg bg-canvas text-ink-muted flex items-center justify-center shrink-0 transition-colors group-hover:bg-brand-50 group-hover:text-brand-600">
                    {item.icon}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-ink">{item.label}</span>
                    <span className="block text-xs text-ink-subtle truncate">{item.text}</span>
                  </span>
                  <ChevronRight size={16} className="text-ink-subtle/60 group-hover:text-brand-600 transition-colors" />
                </button>
              ))}
            </div>
          </section>

          <section className="p-5">
            <h3 className="text-sm font-semibold text-ink mb-4">Cómo organizarte</h3>
            <ol className="relative flex flex-col gap-5">
              {/* Línea que une los pasos */}
              <span aria-hidden className="absolute left-[11px] top-3 bottom-3 w-px bg-line" />
              {STEPS.map((step, index) => (
                <li key={step.title} className="relative flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-surface ring-1 ring-line-strong text-ink-muted text-xs font-bold flex items-center justify-center shrink-0 tabular-nums">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{step.title}</p>
                    <p className="text-sm text-ink-muted leading-snug">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default Dashboard;
