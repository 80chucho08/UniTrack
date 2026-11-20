import { useContext, useEffect, useState } from "react";
import { AlertTriangle, CalendarCheck, CheckCircle2, ListChecks, Plus, Search } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { DashboardHeader } from "../components/DashboardHeader";
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

type StatusFilter = "pending" | "completed" | "all";
// "all" = todas las materias, "none" = tareas sin materia, o el id de una materia
type SubjectFilter = string;

interface Group {
    key: string;
    title: string;
    accent: string;
    todos: TodoType[];
}

const inputClass =
    "w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition-colors text-gray-800 placeholder:text-gray-400 bg-white";

// Agrupa por cercanía de la fecha de entrega; las completadas van al final
function groupTodos(todos: TodoType[]): Group[] {
    const groups: Group[] = [
        { key: "overdue", title: "Vencidas", accent: "text-red-600", todos: [] },
        { key: "today", title: "Hoy", accent: "text-amber-600", todos: [] },
        { key: "tomorrow", title: "Mañana", accent: "text-amber-600", todos: [] },
        { key: "week", title: "Próximos 7 días", accent: "text-blue-600", todos: [] },
        { key: "later", title: "Más adelante", accent: "text-gray-700", todos: [] },
        { key: "nodate", title: "Sin fecha", accent: "text-gray-500", todos: [] },
        { key: "completed", title: "Completadas", accent: "text-emerald-600", todos: [] }
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

interface StatProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    accent: string;
}

const Stat = ({ icon, label, value, accent }: StatProps) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
            {icon}
        </div>
        <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
            <p className="text-2xl font-extrabold text-gray-900 leading-tight">{value}</p>
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

    const tabs: { value: StatusFilter; label: string }[] = [
        { value: "pending", label: `Pendientes (${pending.length})` },
        { value: "completed", label: `Completadas (${completedCount})` },
        { value: "all", label: "Todas" }
    ];

    return (
        <main className="p-6 lg:p-10 max-w-7xl w-full mx-auto">
            <DashboardHeader
                title="To-Do List"
                subtitle="Todas tus tareas, entregas y exámenes de todas las materias"
            />

            {/* Resumen */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                <Stat icon={<ListChecks size={22} />} accent="bg-indigo-50 text-indigo-600" label="Pendientes" value={pending.length} />
                <Stat icon={<AlertTriangle size={22} />} accent="bg-red-50 text-red-600" label="Vencidas" value={overdueCount} />
                <Stat icon={<CalendarCheck size={22} />} accent="bg-amber-50 text-amber-600" label="Para hoy" value={todayCount} />
                <Stat icon={<CheckCircle2 size={22} />} accent="bg-emerald-50 text-emerald-600" label="Completadas" value={completedCount} />
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Lista */}
                <section className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex flex-col gap-3 mb-6">
                        <div className="flex flex-wrap gap-2">
                            {tabs.map(tab => (
                                <button
                                    key={tab.value}
                                    onClick={() => setStatusFilter(tab.value)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                        ${statusFilter === tab.value
                                            ? "bg-indigo-600 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative flex-1">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Buscar tarea o materia..."
                                    className={`${inputClass} pl-9`}
                                />
                            </div>
                            <select
                                value={subjectFilter}
                                onChange={(e) => setSubjectFilter(e.target.value)}
                                className={`${inputClass} sm:w-60`}
                            >
                                <option value="all">Todas las materias</option>
                                <option value="none">Sin materia</option>
                                {subjectOptions}
                            </select>
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

                    {loading ? (
                        <div className="flex flex-col gap-2 animate-pulse">
                            {[1, 2, 3, 4].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl" />)}
                        </div>
                    ) : groups.length === 0 ? (
                        <div className="p-10 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-500">
                            {todos.length === 0
                                ? "Aún no tienes tareas. Agrega la primera desde el panel."
                                : statusFilter === "pending" && !query && subjectFilter === "all"
                                    ? "¡Todo al día! No tienes tareas pendientes."
                                    : "Ninguna tarea coincide con los filtros."}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {groups.map(group => (
                                <div key={group.key}>
                                    <h3 className={`text-sm font-semibold uppercase tracking-wider mb-2 ${group.accent}`}>
                                        {group.title} <span className="text-gray-400 font-medium">({group.todos.length})</span>
                                    </h3>
                                    <ul className="flex flex-col gap-2">
                                        {group.todos.map(todo => (
                                            <TodoItem
                                                key={todo.id}
                                                todo={todo}
                                                onToggle={handleToggle}
                                                onDelete={handleDelete}
                                                showSubject
                                            />
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Panel lateral */}
                <div className="flex flex-col gap-6">
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Nueva tarea</h2>
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
                                className={inputClass}
                            >
                                <option value="">Sin materia</option>
                                {subjectOptions}
                            </select>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className={`${inputClass} text-gray-600`}
                            />
                            <button
                                type="submit"
                                disabled={saving || !title.trim()}
                                className="flex items-center justify-center gap-1 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus size={18} /> {saving ? "Guardando..." : "Agregar tarea"}
                            </button>
                        </form>
                    </section>

                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Pendientes por materia</h2>
                        {pendingBySubject.length === 0 && pendingWithoutSubject === 0 ? (
                            <p className="text-sm text-gray-500">No hay tareas pendientes.</p>
                        ) : (
                            <ul className="flex flex-col gap-1">
                                {pendingBySubject.map(s => (
                                    <li key={s.id}>
                                        <button
                                            onClick={() => {
                                                setSubjectFilter(String(s.id));
                                                setStatusFilter("pending");
                                            }}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
                                                ${subjectFilter === String(s.id) ? "bg-indigo-50" : "hover:bg-gray-50"}`}
                                        >
                                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color || "#6366f1" }} />
                                            <span className="flex-1 min-w-0">
                                                <span className="block text-sm font-medium text-gray-800 truncate">{s.name}</span>
                                                <span className="block text-xs text-gray-400 truncate">{s.semester_name}</span>
                                            </span>
                                            <span className="text-sm font-bold text-gray-700">{s.count}</span>
                                        </button>
                                    </li>
                                ))}
                                {pendingWithoutSubject > 0 && (
                                    <li>
                                        <button
                                            onClick={() => {
                                                setSubjectFilter("none");
                                                setStatusFilter("pending");
                                            }}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
                                                ${subjectFilter === "none" ? "bg-indigo-50" : "hover:bg-gray-50"}`}
                                        >
                                            <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-gray-300" />
                                            <span className="flex-1 text-sm font-medium text-gray-600">Sin materia</span>
                                            <span className="text-sm font-bold text-gray-700">{pendingWithoutSubject}</span>
                                        </button>
                                    </li>
                                )}
                            </ul>
                        )}
                        {subjectFilter !== "all" && (
                            <button
                                onClick={() => setSubjectFilter("all")}
                                className="mt-3 text-sm font-semibold text-indigo-500 hover:underline"
                            >
                                Ver todas las materias
                            </button>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
};

export default Todo;
