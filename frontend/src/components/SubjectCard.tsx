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
            className="group relative overflow-hidden rounded-xl bg-surface border border-line hover:border-line-strong hover:shadow-[0_6px_20px_-8px_rgb(30_36_51/0.18)] transition-[border-color,box-shadow] flex flex-col"
        >
            {/* Franja de portada con el color de la materia */}
            <div
                className="relative h-20 overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 65%, ${color}99 100%)` }}
            >
                <span className="absolute -right-2 -bottom-5 text-6xl font-extrabold tracking-tight text-white/20 select-none">
                    {subjectInitials(subject.name)}
                </span>
                <span className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/0 group-hover:bg-white/90 flex items-center justify-center transition-colors">
                    <ArrowUpRight size={15} className="text-transparent group-hover:text-ink transition-colors" />
                </span>
            </div>

            <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-ink group-hover:text-brand-700 transition-colors line-clamp-2">
                    {subject.name}
                </h3>
                <p className="mt-auto pt-2 flex items-center gap-1 text-sm text-ink-muted truncate">
                    {subject.teacher_name ? (
                        <>
                            <User size={13} className="shrink-0 text-ink-subtle" />
                            <span className="truncate">{subject.teacher_name}</span>
                        </>
                    ) : (
                        <span className="text-ink-subtle">Sin profesor asignado</span>
                    )}
                </p>
            </div>
        </Link>
    );
}
