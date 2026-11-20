import { Link } from 'react-router-dom';
import { ArrowUpRight, User } from 'lucide-react';
import { type Subject } from '../services/subjectService';
import { subjectInitials } from '../utils/subject';

interface Props {
    subject: Subject;
}

// Tarjeta de materia para la vista de cuadrícula del semestre
export function SubjectCard({ subject }: Props) {
    const color = subject.color || "#6366f1";

    return (
        <Link
            to={`/dashboard/subject/${subject.id}`}
            className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
        >
            {/* Franja de portada con el color de la materia */}
            <div
                className="relative h-20 overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}b3 60%, #1e293b 140%)` }}
            >
                <span className="absolute -right-3 -bottom-6 text-6xl font-black text-white/15 select-none transition-transform duration-500 group-hover:scale-110">
                    {subjectInitials(subject.name)}
                </span>
                <ArrowUpRight
                    size={18}
                    className="absolute top-3 right-3 text-white/0 group-hover:text-white/90 transition-colors"
                />
            </div>

            <div className="p-4 flex-1 flex flex-col">
                <h2 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {subject.name}
                </h2>
                <p className="mt-auto pt-2 flex items-center gap-1 text-sm text-gray-500 truncate">
                    {subject.teacher_name ? (
                        <>
                            <User size={13} className="shrink-0" />
                            <span className="truncate">{subject.teacher_name}</span>
                        </>
                    ) : (
                        <span className="text-gray-400">Sin profesor asignado</span>
                    )}
                </p>
            </div>
        </Link>
    );
}
