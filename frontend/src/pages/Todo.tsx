import { useContext, useEffect, useState } from "react";
import { AlertTriangle, CalendarCheck, CheckCircle2, ListChecks, Plus, Search, Sparkles } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { TodoItem } from "../components/todo/TodoItem";
import {
    createGeneralTodo,
    deleteTodo,
    getAllTodos,
    updateTodo,
    type Todo as TodoType
} from "../services/todoService";
import { getAllSubjects, type SubjectOption } from "../services/subjectService";
import { daysUntil } from "../utils/date";
import { btnPrimary } from "../utils/ui";

type StatusFilter = "pending" | "completed" | "all";
// "all" = todas las materias, "none" = tareas sin materia, o el id de una materia
type SubjectFilter = string;

interface Group {
    key: string;
    title: string;
    dot: string; // color del punto del grupo
    todos: TodoType[];
}

const inputClass = "neu-input w-full h-11 rounded-xl px-4 text-sm";

// Agrupa por cercanía de la fecha de entrega; las completadas van al final
function groupTodos(todos: TodoType[]): Group[] {
    const groups: Group[] = [
        { key: "overdue", title: "Vencidas", dot: "bg-red-500", todos: [] },
        { key: "today", title: "Hoy", dot: "bg-amber-500", todos: [] },
        { key: "tomorrow", title: "Mañana", dot: "bg-amber-400", todos: [] },
        { key: "week", title: "Próximos 7 días", dot: "bg-brand-500", todos: [] },
        { key: "later", title: "Más adelante", dot: "bg-ink-subtle", todos: [] },
        { key: "nodate", title: "Sin fecha", dot: "bg-line-strong", todos: [] },
        { key: "completed", title: "Completadas", dot: "bg-emerald-500", todos: [] }
    ];
    const byKey = Object.fromEntries(groups.map(g => [g.key, g]));

    for (const todo of todos) {
        if (todo.status === "completed") {
            byKey.completed.todos.push(todo);
        } else if (!todo.due_date) {
            byKey.nodate.todos.push(todo);
        } else {
            const days = daysUntil(todo.due_date);
            if (days < 0) byKey.overdue.todos.push(todo);
            else if (days === 0) byKey.today.todos.push(todo);
            else if (days === 1) byKey.tomorrow.todos.push(todo);
            else if (days <= 7) byKey.week.todos.push(todo);
            else byKey.later.todos.push(todo);
        }
    }

    for (const group of groups) {
        group.todos.sort((a, b) => {
            if (a.due_date && b.due_date && a.due_date !== b.due_date) return a.due_date.localeCompare(b.due_date);
            return b.created_at.localeCompare(a.created_at);
        });
    }

    return groups.filter(g => g.todos.length > 0);
}

// Mensaje del encabezado según cómo vas
function statusMessage(pending: number, overdue: number, today: number, total: number): string {
    if (total === 0) return "Anota tu primera tarea y empieza a organizar el semestre.";
    if (pending === 0) return "¡Todo al día! No tienes tareas pendientes.";
    const parts = [`Tienes ${pending} ${pending === 1 ? "tarea pendiente" : "tareas pendientes"}`];
    if (overdue > 0) parts.push(`${overdue} ${overdue === 1 ? "vencida" : "vencidas"}`);
    if (today > 0) parts.push(`${today} para hoy`);
    return parts.length === 1 ? `${parts[0]}.` : `${parts[0]}: ${parts.slice(1).join(" y ")}.`;
}

// Anillo de progreso: porcentaje de tareas completadas
function ProgressRing({ done, total }: { done: number; total: number }) {
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    const radius = 30;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className="neu-raised rounded-[24px] pl-3 pr-5 py-3 flex items-center gap-4 self-start sm:self-auto">
            <div className="neu-inset relative w-[84px] h-[84px] rounded-full flex items-center justify-center shrink-0">
                <svg viewBox="0 0 76 76" className="absolute inset-[6px] -rotate-90" aria-hidden>
                    <circle cx="38" cy="38" r={radius} fill="none" strokeWidth="7" className="stroke-line" />
                    <circle
                        cx="38"
                        cy="38"
                        r={radius}
                        fill="none"
                        strokeWidth="7"
                        strokeLinecap="round"
                        className={`${percent === 100 ? "stroke-emerald-500" : "stroke-brand-500"} motion-safe:transition-[stroke-dashoffset] motion-safe:duration-700`}
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (1 - percent / 100)}
                    />
                </svg>
                <span className="relative text-lg font-extrabold text-ink tabular-nums">{percent}%</span>
            </div>
            <div>
                <p className="text-sm font-semibold text-ink">
                    {percent === 100 && total > 0 ? "¡Completaste todo!" : "Progreso"}
                </p>
                <p className="text-sm text-ink-muted tabular-nums">
                    {done} de {total} completadas
                </p>
            </div>
        </div>
    );
}

interface StatProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    tone: string;
}

const Stat = ({ icon, label, value, tone }: StatProps) => (
    <div className="neu-raised rounded-[22px] p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
        <div className={`neu-inset w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 ${tone}`}>
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-sm text-ink-muted leading-tight">{label}</p>
            <p className="text-2xl font-extrabold text-ink leading-tight tabular-nums">{value}</p>
        </div>
    </div>
);

const Todo = () => {
    const { token } = useContext(AuthContext);

    const [todos, setTodos] = useState<TodoType[]>([]);
    const [subjects, setSubjects] = useState<SubjectOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
    const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>("all");
    const [search, setSearch] = useState("");

    const [title, setTitle] = useState("");
    const [newSubjectId, setNewSubjectId] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [saving, setSaving] = useState(false);
    // Tarea recién completada, para animar su casilla al cambiar de grupo
    const [justCompletedId, setJustCompletedId] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!token) return;
                const [todosData, subjectsData] = await Promise.all([
                    getAllTodos(token),
                    getAllSubjects(token)
                ]);
                setTodos(todosData);
                setSubjects(subjectsData);
            } catch (err) {
                console.error("Error al cargar las tareas", err);
                setError(err instanceof Error ? err.message : "Error al cargar las tareas");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !title.trim()) return;

        try {
            setSaving(true);
            setError("");
            const created = await createGeneralTodo({
                title: title.trim(),
                subject_id: newSubjectId ? Number(newSubjectId) : null,
                due_date: dueDate || null
            }, token);
            setTodos(prev => [...prev, created]);
            setTitle("");
            setDueDate("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo crear la tarea");
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = async (todo: TodoType) => {
        if (!token) return;
        const status = todo.status === "completed" ? "pending" : "completed";

        if (status === "completed") {
            setJustCompletedId(todo.id);
            setTimeout(() => setJustCompletedId(cur => (cur === todo.id ? null : cur)), 600);
        }

        // actualización optimista
        setTodos(prev => prev.map(t => (t.id === todo.id ? { ...t, status } : t)));
        try {
            await updateTodo(todo.id, { status }, token);
        } catch (err) {
            setTodos(prev => prev.map(t => (t.id === todo.id ? todo : t)));
            setError(err instanceof Error ? err.message : "No se pudo actualizar la tarea");
        }
    };

    const handleDelete = async (todo: TodoType) => {
        if (!token) return;
        try {
            await deleteTodo(todo.id, token);
            setTodos(prev => prev.filter(t => t.id !== todo.id));
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo eliminar la tarea");
        }
    };

    // Resumen general (sin filtros)
    const pending = todos.filter(t => t.status === "pending");
    const overdueCount = pending.filter(t => t.due_date && daysUntil(t.due_date) < 0).length;
    const todayCount = pending.filter(t => t.due_date && daysUntil(t.due_date) === 0).length;
    const completedCount = todos.length - pending.length;

    // Pendientes por materia (panel lateral)
    const pendingBySubject = subjects
        .map(s => ({ ...s, count: pending.filter(t => t.subject_id === s.id).length }))
        .filter(s => s.count > 0)
        .sort((a, b) => b.count - a.count);
    const pendingWithoutSubject = pending.filter(t => !t.subject_id).length;

    // Lista filtrada
    const query = search.trim().toLowerCase();
    const filtered = todos.filter(t => {
        if (statusFilter !== "all" && t.status !== statusFilter) return false;
        if (subjectFilter === "none" && t.subject_id) return false;
        if (subjectFilter !== "all" && subjectFilter !== "none" && t.subject_id !== Number(subjectFilter)) return false;
        if (query && !t.title.toLowerCase().includes(query) && !(t.subject_name ?? "").toLowerCase().includes(query)) return false;
        return true;
    });
    const groups = groupTodos(filtered);

    // Materias agrupadas por semestre para los <select>
    const semesters = [...new Set(subjects.map(s => s.semester_name))];
    const subjectOptions = semesters.map(name => (
        <optgroup key={name} label={name}>
            {subjects.filter(s => s.semester_name === name).map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
            ))}
        </optgroup>
    ));

    const tabs: { value: StatusFilter; label: string; count?: number }[] = [
        { value: "pending", label: "Pendientes", count: pending.length },
        { value: "completed", label: "Completadas", count: completedCount },
        { value: "all", label: "Todas" }
    ];

    const allClear = statusFilter === "pending" && !query && subjectFilter === "all";

    return (
        <div className="px-4 py-8 md:px-8 lg:px-10 max-w-7xl w-full mx-auto">
            {/* Encabezado con progreso */}
            <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                <div>
                    <h2 className="text-3xl md:text-[2.5rem] md:leading-[1.1] font-extrabold tracking-tight text-ink">
                        To-Do List
                    </h2>
                    <p className="mt-2 text-ink-muted max-w-xl">
                        {loading
                            ? "Cargando tus tareas..."
                            : statusMessage(pending.length, overdueCount, todayCount, todos.length)}
                    </p>
                </div>
                {!loading && <ProgressRing done={completedCount} total={todos.length} />}
            </header>

            {/* Resumen */}
            <section className="grid grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-8">
                <Stat icon={<ListChecks size={21} />} tone="text-brand-600" label="Pendientes" value={pending.length} />
                <Stat icon={<AlertTriangle size={21} />} tone="text-red-500" label="Vencidas" value={overdueCount} />
                <Stat icon={<CalendarCheck size={21} />} tone="text-amber-600" label="Para hoy" value={todayCount} />
                <Stat icon={<CheckCircle2 size={21} />} tone="text-emerald-600" label="Completadas" value={completedCount} />
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-7">
                {/* Lista */}
                <section className="xl:col-span-2 neu-raised rounded-[24px] p-5 sm:p-6">
                    <div className="flex flex-col gap-4 mb-6">
                        {/* Selector de estado: canal hundido con la opción activa elevada */}
                        <div className="neu-inset flex w-full sm:inline-flex sm:w-auto sm:self-start p-1 rounded-2xl gap-1">
                            {tabs.map(tab => {
                                const active = statusFilter === tab.value;
                                return (
                                    <button
                                        key={tab.value}
                                        onClick={() => setStatusFilter(tab.value)}
                                        aria-pressed={active}
                                        className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 h-9 px-2 sm:px-3.5 rounded-xl text-[13px] sm:text-sm font-semibold whitespace-nowrap transition
                                            ${active ? "neu-raised-sm text-brand-700" : "text-ink-muted hover:text-ink"}`}
                                    >
                                        {tab.label}
                                        {tab.count !== undefined && (
                                            <span className={`min-w-[1.4rem] h-5 px-1.5 rounded-full text-xs font-bold flex items-center justify-center tabular-nums
                                                ${active ? "bg-brand-600 text-white" : "bg-line text-ink-muted"}`}>
                                                {tab.count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Buscar tarea o materia..."
                                    className={`${inputClass} pl-10`}
                                />
                            </div>
                            <select
                                value={subjectFilter}
                                onChange={(e) => setSubjectFilter(e.target.value)}
                                className={`${inputClass} sm:w-60 cursor-pointer`}
                            >
                                <option value="all">Todas las materias</option>
                                <option value="none">Sin materia</option>
                                {subjectOptions}
                            </select>
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

                    {loading ? (
                        <div className="flex flex-col gap-3 animate-pulse">
                            {[1, 2, 3, 4].map(i => <div key={i} className="neu-inset h-12 rounded-xl" />)}
                        </div>
                    ) : groups.length === 0 ? (
                        <div className="neu-inset rounded-2xl px-6 py-10 text-center">
                            <span className={`neu-raised-sm mx-auto mb-4 w-14 h-14 rounded-full flex items-center justify-center
                                ${todos.length > 0 && allClear ? "text-emerald-500" : "text-brand-500"}`}>
                                {todos.length > 0 && allClear ? <Sparkles size={24} /> : <ListChecks size={24} />}
                            </span>
                            <p className="font-semibold text-ink">
                                {todos.length === 0
                                    ? "Aún no tienes tareas"
                                    : allClear
                                        ? "¡Todo al día!"
                                        : "Ninguna tarea coincide con los filtros"}
                            </p>
                            <p className="text-sm text-ink-muted mt-1">
                                {todos.length === 0
                                    ? "Agrega la primera desde el panel de nueva tarea."
                                    : allClear
                                        ? "No tienes tareas pendientes. Buen trabajo."
                                        : "Prueba con otra materia o cambia la búsqueda."}
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {groups.map(group => (
                                <div key={group.key}>
                                    <h3 className="flex items-center gap-2 mb-2 px-1 text-sm font-semibold text-ink">
                                        <span className={`w-2 h-2 rounded-full ${group.dot}`} />
                                        {group.title}
                                        <span className="text-ink-subtle font-medium tabular-nums">{group.todos.length}</span>
                                    </h3>
                                    <ul className="neu-inset rounded-2xl p-1.5 flex flex-col gap-0.5">
                                        {group.todos.map(todo => (
                                            <TodoItem
                                                key={todo.id}
                                                todo={todo}
                                                onToggle={handleToggle}
                                                onDelete={handleDelete}
                                                showSubject
                                                justCompleted={todo.id === justCompletedId}
                                            />
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Panel lateral */}
                <div className="flex flex-col gap-7">
                    {/* Contorno de marca para distinguirla; outline no reemplaza la sombra neumórfica */}
                    <section className="neu-raised rounded-[24px] p-5 sm:p-6 outline-2 outline-brand-300/70 -outline-offset-1">
                        <h2 className="text-lg font-bold text-ink mb-4">Nueva tarea</h2>
                        <form onSubmit={handleAdd} className="flex flex-col gap-3">
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                maxLength={150}
                                placeholder="Tarea, entrega o examen..."
                                className={inputClass}
                            />
                            <select
                                value={newSubjectId}
                                onChange={(e) => setNewSubjectId(e.target.value)}
                                className={`${inputClass} cursor-pointer`}
                            >
                                <option value="">Sin materia</option>
                                {subjectOptions}
                            </select>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className={`${inputClass} text-ink-muted`}
                            />
                            <button
                                type="submit"
                                disabled={saving || !title.trim()}
                                className={`${btnPrimary} h-11 mt-1`}
                            >
                                <Plus size={18} /> {saving ? "Guardando..." : "Agregar tarea"}
                            </button>
                        </form>
                    </section>

                    <section className="neu-raised rounded-[24px] p-5 sm:p-6">
                        <h2 className="text-lg font-bold text-ink mb-4">Pendientes por materia</h2>
                        {pendingBySubject.length === 0 && pendingWithoutSubject === 0 ? (
                            <p className="text-sm text-ink-muted">No hay tareas pendientes.</p>
                        ) : (
                            <ul className="flex flex-col gap-2">
                                {pendingBySubject.map(s => {
                                    const active = subjectFilter === String(s.id);
                                    return (
                                        <li key={s.id}>
                                            <button
                                                onClick={() => {
                                                    setSubjectFilter(String(s.id));
                                                    setStatusFilter("pending");
                                                }}
                                                aria-pressed={active}
                                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition
                                                    ${active ? "neu-inset" : "hover:bg-white/60"}`}
                                            >
                                                <span
                                                    className="w-3 h-3 rounded-full shrink-0"
                                                    style={{ backgroundColor: s.color || "#6366f1", boxShadow: `0 0 0 3px ${s.color || "#6366f1"}26` }}
                                                />
                                                <span className="flex-1 min-w-0">
                                                    <span className="block text-sm font-semibold text-ink truncate">{s.name}</span>
                                                    <span className="block text-xs text-ink-subtle truncate">{s.semester_name}</span>
                                                </span>
                                                <span className={`min-w-[1.6rem] h-6 px-2 rounded-full text-xs font-bold flex items-center justify-center tabular-nums
                                                    ${active ? "bg-brand-600 text-white" : "neu-raised-sm text-ink"}`}>
                                                    {s.count}
                                                </span>
                                            </button>
                                        </li>
                                    );
                                })}
                                {pendingWithoutSubject > 0 && (
                                    <li>
                                        <button
                                            onClick={() => {
                                                setSubjectFilter("none");
                                                setStatusFilter("pending");
                                            }}
                                            aria-pressed={subjectFilter === "none"}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition
                                                ${subjectFilter === "none" ? "neu-inset" : "hover:bg-white/60"}`}
                                        >
                                            <span className="w-3 h-3 rounded-full shrink-0 bg-line-strong" />
                                            <span className="flex-1 text-sm font-semibold text-ink-muted">Sin materia</span>
                                            <span className={`min-w-[1.6rem] h-6 px-2 rounded-full text-xs font-bold flex items-center justify-center tabular-nums
                                                ${subjectFilter === "none" ? "bg-brand-600 text-white" : "neu-raised-sm text-ink"}`}>
                                                {pendingWithoutSubject}
                                            </span>
                                        </button>
                                    </li>
                                )}
                            </ul>
                        )}
                        {subjectFilter !== "all" && (
                            <button
                                onClick={() => setSubjectFilter("all")}
                                className="mt-4 text-sm font-semibold text-brand-600 hover:text-brand-700 hover:underline"
                            >
                                Ver todas las materias
                            </button>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Todo;
