import { useContext, useState } from "react";
import { ListChecks, Plus } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { createTodo, deleteTodo, updateTodo, type Todo } from "../../services/todoService";
import { TodoItem } from "../todo/TodoItem";
import { SectionTitle } from "./SectionTitle";
import { btnPrimary } from "../../utils/ui";

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
        <section className="neu-raised rounded-[24px] p-5 sm:p-6">
            <div className="mb-5">
                <SectionTitle
                    icon={<ListChecks size={19} />}
                    tone="text-amber-600"
                    title="Tareas"
                    detail={`${pending} pendiente${pending === 1 ? "" : "s"}`}
                />
            </div>

            <form onSubmit={handleAdd} className="flex flex-col gap-3 mb-5">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={150}
                    placeholder="Nueva tarea, entrega o examen..."
                    className="neu-input w-full h-11 rounded-xl px-4 text-sm"
                />
                <div className="flex gap-3">
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="neu-input flex-1 min-w-0 h-10 rounded-xl px-3 text-sm text-ink-muted"
                    />
                    <button type="submit" disabled={saving || !title.trim()} className={btnPrimary}>
                        <Plus size={17} /> Agregar
                    </button>
                </div>
            </form>

            {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

            {sorted.length === 0 ? (
                <p className="neu-inset rounded-2xl text-sm text-center text-ink-muted py-6 px-4">
                    No hay tareas para esta materia.
                </p>
            ) : (
                <ul className="flex flex-col gap-1">
                    {sorted.map(todo => (
                        <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} onDelete={handleDelete} />
                    ))}
                </ul>
            )}
        </section>
    );
}
