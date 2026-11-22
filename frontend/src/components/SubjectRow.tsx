import { Link } from 'react-router-dom';
import { ChevronRight, User } from 'lucide-react';
import { type Subject } from '../services/subjectService';
import { readableTextColor, subjectInitials } from '../utils/subject';

interface Props {
    subject: Subject;
}

// Fila de materia para la vista de lista del semestre
export function SubjectRow({ subject }: Props) {
    const color = subject.color || "#6366f1";

    return (
        <Link
            to={`/dashboard/subject/${subject.id}`}
            className="group relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-colors hover:bg-canvas"
        >
            {/* Barra con el color de la materia al pasar el mouse */}
            <span
                className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: color }}
            />

            <span
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold"
                style={{ background: `linear-gradient(135deg, ${color}, ${color}d9)`, color: readableTextColor(color) }}
            >
                {subjectInitials(subject.name)}
            </span>

            <span className="flex-1 min-w-0">
                <span className="block font-semibold text-ink group-hover:text-brand-700 transition-colors truncate">
                    {subject.name}
                </span>
                <span className="flex items-center gap-1 text-sm text-ink-muted truncate">
                    {subject.teacher_name ? (
                        <>
                            <User size={13} className="shrink-0 text-ink-subtle" />
                            <span className="truncate">{subject.teacher_name}</span>
                        </>
                    ) : (
                        <span className="text-ink-subtle">Sin profesor asignado</span>
                    )}
                </span>
            </span>

            <ChevronRight
                size={18}
                className="shrink-0 text-ink-subtle/60 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600"
            />
        </Link>
    );
}
