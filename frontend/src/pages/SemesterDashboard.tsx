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
            <div className="px-4 py-8 md:px-8 lg:px-10 lg:py-10 max-w-6xl w-full mx-auto">

                {/* Encabezado */}
                <header className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                    <div>
                        <h2 className="text-3xl md:text-[2.5rem] md:leading-[1.1] font-extrabold tracking-tight text-ink">
                            Materias del semestre
                        </h2>

                        {/* Avatares con el color de cada materia */}
                        <div className="mt-3 flex items-center gap-3 min-h-9">
                            {loading ? (
                                <span className="text-ink-muted">Cargando materias...</span>
                            ) : subjects.length === 0 ? (
                                <span className="text-ink-muted">Aún no hay materias en este semestre.</span>
                            ) : (
                                <>
                                    <div className="flex -space-x-2">
                                        {subjects.slice(0, 6).map(s => (
                                            <span
                                                key={s.id}
                                                title={s.name}
                                                className="w-9 h-9 rounded-full ring-[3px] ring-canvas flex items-center justify-center text-[11px] font-bold"
                                                style={{
                                                    backgroundColor: s.color || "#6366f1",
                                                    color: readableTextColor(s.color || "#6366f1")
                                                }}
                                            >
                                                {subjectInitials(s.name)}
                                            </span>
                                        ))}
                                        {subjects.length > 6 && (
                                            <span className="w-9 h-9 rounded-full ring-[3px] ring-canvas bg-surface border border-line text-ink-muted flex items-center justify-center text-xs font-bold">
                                                +{subjects.length - 6}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-ink-muted">
                                        {subjects.length} {subjects.length === 1 ? "materia en este periodo" : "materias en este periodo"}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={openModal}
                        className="self-start sm:self-auto flex items-center gap-2 bg-brand-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-700 active:scale-[0.98] transition"
                    >
                        <Plus size={18} /> Nueva materia
                    </button>
                </header>

                {/* Barra de herramientas */}
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                    <div className="relative flex-1">
                        <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar materia o profesor..."
                            className="w-full bg-surface border border-line rounded-xl pl-10 pr-10 py-2.5 text-sm text-ink placeholder:text-ink-subtle
                                focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                title="Limpiar búsqueda"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Selector de vista */}
                    <div className="flex items-center p-0.5 rounded-lg bg-surface ring-1 ring-line shrink-0">
                        {([
                            { mode: "list", icon: <List size={15} />, label: "Lista" },
                            { mode: "grid", icon: <LayoutGrid size={15} />, label: "Cuadrícula" }
                        ] as const).map(option => (
                            <button
                                key={option.mode}
                                onClick={() => setView(option.mode)}
                                aria-pressed={view === option.mode}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors
                                    ${view === option.mode
                                        ? "bg-brand-50 text-brand-700"
                                        : "text-ink-subtle hover:text-ink"}`}
                            >
                                {option.icon}
                                <span className="hidden sm:inline">{option.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Contenido */}
                {loading ? (
                    <div className="bg-surface rounded-2xl border border-line p-2 animate-pulse">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex items-center gap-4 px-4 py-3.5">
                                <div className="w-11 h-11 rounded-xl bg-canvas" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3.5 w-1/3 bg-canvas rounded" />
                                    <div className="h-3 w-1/5 bg-canvas rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : subjects.length === 0 ? (
                    <button
                        onClick={openModal}
                        className="group w-full flex flex-col items-center justify-center gap-3 p-12 rounded-2xl border-[1.5px] border-dashed border-line-strong bg-surface/50 hover:border-brand-300 hover:bg-brand-50/40 transition-colors"
                    >
                        <span className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                            <BookOpen size={26} />
                        </span>
                        <span className="text-lg font-bold text-ink">Este semestre no tiene materias</span>
                        <span className="text-sm text-ink-muted">Agrega la primera para empezar a organizar el periodo.</span>
                        <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                            <Plus size={16} /> Agregar materia
                        </span>
                    </button>
                ) : visibleSubjects.length === 0 ? (
                    <div className="bg-surface rounded-2xl border border-line p-10 text-center">
                        <p className="text-ink-muted">Ninguna materia coincide con “{search}”.</p>
                        <button onClick={() => setSearch("")} className="mt-2 text-sm font-semibold text-brand-600 hover:underline">
                            Limpiar búsqueda
                        </button>
                    </div>
                ) : view === "list" ? (
                    <div className="bg-surface rounded-2xl border border-line p-2">
                        <div className="divide-y divide-line/70">
                            {visibleSubjects.map(subject => (
                                <SubjectRow key={subject.id} subject={subject} />
                            ))}
                        </div>
                        <button
                            onClick={openModal}
                            className="group w-full mt-1 pt-1 border-t border-line flex items-center gap-4 px-4 py-3 rounded-xl text-ink-muted hover:text-brand-700 hover:bg-canvas transition-colors"
                        >
                            <span className="w-11 h-11 rounded-xl border-[1.5px] border-dashed border-line-strong flex items-center justify-center group-hover:border-brand-400 transition-colors">
                                <Plus size={18} />
                            </span>
                            <span className="text-sm font-semibold">Agregar materia</span>
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3 sm:gap-4">
                        {visibleSubjects.map(subject => (
                            <SubjectCard key={subject.id} subject={subject} />
                        ))}
                        <button
                            onClick={openModal}
                            className="group min-h-[150px] rounded-xl border-[1.5px] border-dashed border-line-strong hover:border-brand-300 hover:bg-brand-50/40 flex flex-col items-center justify-center gap-2 text-ink-muted hover:text-brand-700 transition-colors"
                        >
                            <Plus size={22} />
                            <span className="text-sm font-semibold">Agregar materia</span>
                        </button>
                    </div>
                )}
            </div>

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
