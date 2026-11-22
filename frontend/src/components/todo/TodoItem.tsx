import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Trash2 } from "lucide-react";
import type { Todo } from "../../services/todoService";
import { daysUntil, formatShortDate } from "../../utils/date";

interface Props {
    todo: Todo;
    onToggle: (todo: Todo) => void;
    onDelete: (todo: Todo) => void;
    showSubject?: boolean; // en la página global se muestra la materia
    justCompleted?: boolean; // la página avisa si se acaba de completar (la fila puede volver a montarse en otro grupo)
}

function DueBadge({ todo }: { todo: Todo }) {
    if (!todo.due_date) return null;

    const days = daysUntil(todo.due_date);
    const done = todo.status === "completed";

    let label = formatShortDate(todo.due_date);
    let style = "bg-line/60 text-ink-muted";

    if (!done) {
        if (days < 0) {
            label = `Vencida, ${label}`;
            style = "bg-red-50 text-red-600";
        } else if (days === 0) {
            label = "Hoy";
            style = "bg-amber-50 text-amber-700";
        } else if (days === 1) {
            label = "Mañana";
            style = "bg-amber-50 text-amber-700";
        } else if (days <= 7) {
            label = `En ${days} días`;
            style = "bg-brand-50 text-brand-700";
        }
    }

    return <span className={`text-xs font-semibold px-2 py-0.5 rounded-md whitespace-nowrap ${style}`}>{label}</span>;
}

export function TodoItem({ todo, onToggle, onDelete, showSubject = false, justCompleted = false }: Props) {
    const done = todo.status === "completed";
    // Rebote solo cuando el usuario la marca (no al cargar la lista)
    const [popping, setPopping] = useState(false);

    const handleToggle = () => {
        if (!done) setPopping(true);
        onToggle(todo);
    };

    return (
        <li className="group flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-white/60 transition-colors">
            {/* Casilla hundida; al completarse se rellena */}
            <button
                onClick={handleToggle}
                onAnimationEnd={() => setPopping(false)}
                title={done ? "Marcar como pendiente" : "Marcar como completada"}
                className={`w-6 h-6 shrink-0 rounded-lg flex items-center justify-center transition
                    ${done
                        ? "bg-emerald-500 text-white shadow-[2px_2px_6px_rgb(16_185_129/0.35)]"
                        : "bg-surface ring-1 ring-line-strong shadow-[inset_1px_1px_3px_rgb(30_36_51/0.12)] hover:ring-2 hover:ring-brand-300"}
                    ${popping || justCompleted ? "motion-safe:animate-check-pop" : ""}`}
            >
                {done && <Check size={14} strokeWidth={3} />}
            </button>

            <div className="flex-1 min-w-0">
                <p className={`text-sm break-words ${done ? "line-through text-ink-subtle" : "text-ink"}`}>
                    {todo.title}
                </p>
                {showSubject && (
                    todo.subject_id ? (
                        <Link
                            to={`/dashboard/subject/${todo.subject_id}`}
                            className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-brand-700 transition-colors max-w-full"
                        >
                            <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: todo.subject_color || "#6366f1" }}
                            />
                            <span className="truncate">
                                {todo.subject_name}
                                {todo.semester_name && <span className="text-ink-subtle">, {todo.semester_name}</span>}
                            </span>
                        </Link>
                    ) : (
                        <span className="mt-1 inline-block text-xs text-ink-subtle">Sin materia</span>
                    )
                )}
            </div>

            <DueBadge todo={todo} />
            <button
                onClick={() => onDelete(todo)}
                title="Eliminar tarea"
                className="text-ink-subtle/60 hover:text-red-600 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
            >
                <Trash2 size={16} />
            </button>
        </li>
    );
}
