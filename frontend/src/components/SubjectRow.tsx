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
            className="group relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 hover:bg-gray-50 hover:translate-x-1"
        >
            {/* Barra de color que aparece al pasar el mouse */}
            <span
                className="absolute left-0 top-2 bottom-2 w-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: color }}
            />

            <span
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold shadow-sm transition-transform duration-200 group-hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, color: readableTextColor(color) }}
            >
                {subjectInitials(subject.name)}
            </span>

            <span className="flex-1 min-w-0">
                <span className="block font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors truncate">
                    {subject.name}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-500 truncate">
                    {subject.teacher_name ? (
                        <>
                            <User size={13} className="shrink-0" />
                            <span className="truncate">{subject.teacher_name}</span>
                        </>
                    ) : (
                        <span className="text-gray-400">Sin profesor asignado</span>
                    )}
                </span>
            </span>

            <span className="hidden sm:inline text-sm font-medium text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                Abrir
            </span>
            <ChevronRight size={18} className="text-gray-300 group-hover:text-indigo-500 transition-colors shrink-0" />
        </Link>
    );
}
