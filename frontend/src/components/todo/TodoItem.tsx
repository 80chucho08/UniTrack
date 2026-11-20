import { Link } from "react-router-dom";
import { Check, Trash2 } from "lucide-react";
import type { Todo } from "../../services/todoService";
import { daysUntil, formatShortDate } from "../../utils/date";

interface Props {
    todo: Todo;
    onToggle: (todo: Todo) => void;
    onDelete: (todo: Todo) => void;
    showSubject?: boolean; // en la página global se muestra la materia
}

function DueBadge({ todo }: { todo: Todo }) {
    if (!todo.due_date) return null;

    const days = daysUntil(todo.due_date);
    const done = todo.status === "completed";

    let label = formatShortDate(todo.due_date);
    let style = "bg-gray-100 text-gray-500";

    if (!done) {
        if (days < 0) {
            label = `Vencida · ${label}`;
            style = "bg-red-50 text-red-600";
        } else if (days === 0) {
            label = "Hoy";
            style = "bg-amber-50 text-amber-700";
        } else if (days === 1) {
            label = "Mañana";
            style = "bg-amber-50 text-amber-700";
        } else if (days <= 7) {
            label = `En ${days} días`;
            style = "bg-blue-50 text-blue-600";
        }
    }

    return <span className={`text-xs font-semibold px-2 py-0.5 rounded-md whitespace-nowrap ${style}`}>{label}</span>;
}

export function TodoItem({ todo, onToggle, onDelete, showSubject = false }: Props) {
    const done = todo.status === "completed";

    return (
        <li className="group flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-indigo-200 transition-colors">
            <button
                onClick={() => onToggle(todo)}
                title={done ? "Marcar como pendiente" : "Marcar como completada"}
                className={`w-6 h-6 shrink-0 rounded-md border-2 flex items-center justify-center transition-colors
                    ${done ? "bg-emerald-500 border-emerald-500 text-white" : "border-gray-300 hover:border-indigo-500"}`}
            >
                {done && <Check size={14} strokeWidth={3} />}
            </button>

            <div className="flex-1 min-w-0">
                <p className={`text-sm break-words ${done ? "line-through text-gray-400" : "text-gray-800"}`}>
                    {todo.title}
                </p>
                {showSubject && (
                    todo.subject_id ? (
                        <Link
                            to={`/dashboard/subject/${todo.subject_id}`}
                            className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-indigo-600 transition-colors max-w-full"
                        >
                            <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: todo.subject_color || "#6366f1" }}
                            />
                            <span className="truncate">
                                {todo.subject_name}
                                {todo.semester_name && <span className="text-gray-400"> · {todo.semester_name}</span>}
                            </span>
                        </Link>
                    ) : (
                        <span className="mt-1 inline-block text-xs text-gray-400">Sin materia</span>
                    )
                )}
            </div>

            <DueBadge todo={todo} />
            <button
                onClick={() => onDelete(todo)}
                title="Eliminar tarea"
                className="text-gray-300 hover:text-red-600 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
            >
                <Trash2 size={16} />
            </button>
        </li>
    );
}
