import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState, useContext } from 'react';
import { BookOpen, LayoutGrid, List, Plus, Search, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { getSubjects, type Subject } from '../services/subjectService';
import { SubjectCard } from '../components/SubjectCard';
import { SubjectRow } from '../components/SubjectRow';
import { CreateSubjectModal } from "../components/CreateSubjectModal";
import { readableTextColor, subjectInitials } from '../utils/subject';

type ViewMode = "list" | "grid";

function SemesterDashboard() {
    const { semesterId } = useParams();
    const { token } = useContext(AuthContext);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Estado solo de presentación
    const [view, setView] = useState<ViewMode>("list");
    const [search, setSearch] = useState("");


    const fetchSubjects = useCallback(async () => {
        try {
            if (!token || !semesterId) return;
            const data = await getSubjects(Number(semesterId), token);
            setSubjects(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [semesterId, token]);

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    const query = search.trim().toLowerCase();
    const visibleSubjects = query
        ? subjects.filter(s =>
            s.name.toLowerCase().includes(query) ||
            (s.teacher_name ?? "").toLowerCase().includes(query))
        : subjects;

    const openModal = () => setIsModalOpen(true);

    return (
        <>
            <main className="p-6 lg:p-10 max-w-7xl w-full mx-auto">

                {/* Encabezado */}
                <header className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 p-6 md:p-8 text-white shadow-sm">
                    <BookOpen
                        size={170}
                        strokeWidth={1}
                        className="absolute -right-6 -bottom-10 text-white/10 pointer-events-none"
                    />
                    <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
                                Periodo académico activo
                            </p>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                                Materias del Semestre
                            </h1>

                            {/* Avatares de las materias */}
                            <div className="mt-4 flex items-center gap-3">
                                {loading ? (
                                    <span className="text-sm text-white/70">Cargando materias...</span>
                                ) : subjects.length === 0 ? (
                                    <span className="text-sm text-white/70">Aún no hay materias en este semestre</span>
                                ) : (
                                    <>
                                        <div className="flex -space-x-2">
                                            {subjects.slice(0, 5).map(s => (
                                                <span
                                                    key={s.id}
                                                    title={s.name}
                                                    className="w-9 h-9 rounded-full ring-2 ring-indigo-700 flex items-center justify-center text-[11px] font-bold"
                                                    style={{
                                                        backgroundColor: s.color || "#6366f1",
                                                        color: readableTextColor(s.color || "#6366f1")
                                                    }}
                                                >
                                                    {subjectInitials(s.name)}
                                                </span>
                                            ))}
                                            {subjects.length > 5 && (
                                                <span className="w-9 h-9 rounded-full ring-2 ring-indigo-700 bg-white/20 backdrop-blur flex items-center justify-center text-xs font-bold">
                                                    +{subjects.length - 5}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-sm text-white/80">
                                            {subjects.length} {subjects.length === 1 ? "materia" : "materias"}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={openModal}
                            className="self-start md:self-auto flex items-center gap-2 bg-white text-indigo-700 px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-900/30 hover:bg-indigo-50 active:scale-95 transition-all"
                        >
                            <Plus size={18} /> Materia
                        </button>
                    </div>
                </header>

                {/* Barra de herramientas */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar materia o profesor..."
                            className="w-full bg-white border-2 border-gray-100 rounded-xl pl-10 pr-10 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-indigo-500 outline-none transition-colors"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                title="Limpiar búsqueda"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center bg-white border-2 border-gray-100 rounded-xl p-1 self-start sm:self-auto">
                        {([
                            { mode: "list", icon: <List size={16} />, label: "Lista" },
                            { mode: "grid", icon: <LayoutGrid size={16} />, label: "Cuadrícula" }
                        ] as const).map(option => (
                            <button
                                key={option.mode}
                                onClick={() => setView(option.mode)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                                    ${view === option.mode
                                        ? "bg-indigo-600 text-white shadow-sm"
                                        : "text-gray-500 hover:text-gray-800"}`}
                            >
                                {option.icon} {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Contenido */}
                {loading ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 animate-pulse">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex items-center gap-4 px-4 py-3.5">
                                <div className="w-11 h-11 rounded-xl bg-gray-200" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3.5 w-1/3 bg-gray-200 rounded" />
                                    <div className="h-3 w-1/5 bg-gray-100 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : subjects.length === 0 ? (
                    <button
                        onClick={openModal}
                        className="group w-full flex flex-col items-center justify-center gap-3 p-12 rounded-2xl border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all"
                    >
                        <span className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <BookOpen size={26} />
                        </span>
                        <span className="text-lg font-bold text-gray-800">No hay materias.</span>
                        <span className="text-sm text-gray-500">Agrega tu primera materia para empezar a organizar el semestre.</span>
                        <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">
                            <Plus size={16} /> Agregar materia
                        </span>
                    </button>
                ) : visibleSubjects.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                        <p className="text-gray-500">Ninguna materia coincide con “{search}”.</p>
                        <button onClick={() => setSearch("")} className="mt-2 text-sm font-semibold text-indigo-500 hover:underline">
                            Limpiar búsqueda
                        </button>
                    </div>
                ) : view === "list" ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
                        <div className="divide-y divide-gray-50">
                            {visibleSubjects.map(subject => (
                                <SubjectRow key={subject.id} subject={subject} />
                            ))}
                        </div>
                        <button
                            onClick={openModal}
                            className="w-full mt-1 flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors"
                        >
                            <span className="w-11 h-11 rounded-xl border-2 border-dashed border-current flex items-center justify-center">
                                <Plus size={18} />
                            </span>
                            <span className="text-sm font-medium">Agregar materia</span>
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
                        {visibleSubjects.map(subject => (
                            <SubjectCard key={subject.id} subject={subject} />
                        ))}
                        <button
                            onClick={openModal}
                            className="group min-h-[150px] rounded-2xl border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/40 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-indigo-600 transition-all"
                        >
                            <Plus size={22} className="group-hover:rotate-90 transition-transform duration-300" />
                            <span className="text-sm font-medium">Agregar materia</span>
                        </button>
                    </div>
                )}
            </main>

            {/* Renderizado condicional del Modal */}
            {isModalOpen && (
                <CreateSubjectModal
                    semesterId={Number(semesterId)}
                    onClose={() => setIsModalOpen(false)}
                    onCreated={fetchSubjects} // Refresca la lista
                />
            )}

        </>
    );
}
export default SemesterDashboard;
