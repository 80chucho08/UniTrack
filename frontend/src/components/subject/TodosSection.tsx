import { useContext, useState } from "react";
import { ListChecks, Plus } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { createTodo, deleteTodo, updateTodo, type Todo } from "../../services/todoService";
import { TodoItem } from "../todo/TodoItem";

interface Props {
    subjectId: number;
    todos: Todo[];
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

// Pendientes primero (por fecha de entrega), luego completadas
function sortTodos(list: Todo[]): Todo[] {
    return [...list].sort((a, b) => {
        if (a.status !== b.status) return a.status === "pending" ? -1 : 1;
        if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date);
        if (a.due_date) return -1;
        if (b.due_date) return 1;
        return b.created_at.localeCompare(a.created_at);
    });
}

export function TodosSection({ subjectId, todos, setTodos }: Props) {
    const { token } = useContext(AuthContext);
    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const sorted = sortTodos(todos);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !title.trim()) return;

        try {
            setSaving(true);
            setError("");
            const created = await createTodo(subjectId, { title: title.trim(), due_date: dueDate || null }, token);
            setTodos(prev => [...prev, created]);
            setTitle("");
            setDueDate("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo crear la tarea");
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = async (todo: Todo) => {
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

    const handleDelete = async (todo: Todo) => {
        if (!token) return;
        try {
            await deleteTodo(todo.id, token);
            setTodos(prev => prev.filter(t => t.id !== todo.id));
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo eliminar la tarea");
        }
    };

    const pending = todos.filter(t => t.status === "pending").length;

    return (
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-5">
                <ListChecks size={20} className="text-amber-600" />
                <h2 className="text-xl font-bold text-gray-800">Tareas</h2>
                <span className="text-sm text-gray-400">({pending} pendiente{pending === 1 ? "" : "s"})</span>
            </div>

            <form onSubmit={handleAdd} className="flex flex-col gap-2 mb-5">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={150}
                    placeholder="Nueva tarea, entrega o examen..."
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition-colors text-gray-800 placeholder:text-gray-400"
                />
                <div className="flex gap-2">
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="flex-1 min-w-0 border-2 border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-600 focus:border-indigo-500 outline-none transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={saving || !title.trim()}
                        className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus size={18} /> Agregar
                    </button>
                </div>
            </form>

            {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

            {sorted.length === 0 ? (
                <p className="text-sm text-center text-gray-500 py-4">No hay tareas para esta materia.</p>
            ) : (
                <ul className="flex flex-col gap-2">
                    {sorted.map(todo => (
                        <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} onDelete={handleDelete} />
                    ))}
                </ul>
            )}
        </section>
    );
}
