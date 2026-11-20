import { Link } from "react-router-dom";
import { BookOpen, Clock, Mail, MapPin, User } from "lucide-react";
import type { SubjectDetail } from "../../services/subjectService";
import type { SubjectClass } from "../../services/scheduleService";
import { DAY_LABELS } from "../../utils/date";

interface Props {
    subject: SubjectDetail;
    classes: SubjectClass[];
    onEdit: () => void;
}

export function SubjectInfoCard({ subject, classes, onEdit }: Props) {
    const hasInfo = subject.teacher_name || subject.teacher_email || subject.credits != null;

    return (
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
            {/* Profesor y créditos */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold text-gray-800">Información</h2>
                    <button onClick={onEdit} className="text-sm font-semibold text-indigo-500 hover:underline">
                        Editar
                    </button>
                </div>

                {hasInfo ? (
                    <ul className="flex flex-col gap-2 text-sm text-gray-700">
                        {subject.teacher_name && (
                            <li className="flex items-center gap-2">
                                <User size={16} className="text-gray-400 shrink-0" />
                                {subject.teacher_name}
                            </li>
                        )}
                        {subject.teacher_email && (
                            <li className="flex items-center gap-2 min-w-0">
                                <Mail size={16} className="text-gray-400 shrink-0" />
                                <a href={`mailto:${subject.teacher_email}`} className="text-indigo-600 hover:underline truncate">
                                    {subject.teacher_email}
                                </a>
                            </li>
                        )}
                        {subject.credits != null && (
                            <li className="flex items-center gap-2">
                                <BookOpen size={16} className="text-gray-400 shrink-0" />
                                {subject.credits} crédito{subject.credits === 1 ? "" : "s"}
                            </li>
                        )}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500">Agrega los datos del profesor y los créditos.</p>
                )}
            </div>

            {/* Horario de la materia */}
            <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">Horario</h3>
                {classes.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        Sin clases asignadas.{" "}
                        <Link to="/dashboard/schedule" className="text-indigo-500 font-semibold hover:underline">
                            Ir al horario →
                        </Link>
                    </p>
                ) : (
                    <ul className="flex flex-col gap-2">
                        {classes.map(c => (
                            <li key={c.schedule_id} className="flex items-center justify-between gap-2 text-sm p-2.5 rounded-xl bg-gray-50">
                                <span className="font-semibold text-gray-800">{DAY_LABELS[c.day] ?? c.day}</span>
                                <span className="flex items-center gap-3 text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} /> {c.start_time} – {c.end_time}
                                    </span>
                                    {c.classroom && (
                                        <span className="hidden sm:flex items-center gap-1 truncate max-w-[8rem]">
                                            <MapPin size={14} /> {c.classroom}
                                        </span>
                                    )}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Criterios de evaluación */}
            <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">Criterios de evaluación</h3>
                {subject.evaluation_criteria ? (
                    <p className="text-sm text-gray-700 whitespace-pre-line">{subject.evaluation_criteria}</p>
                ) : (
                    <p className="text-sm text-gray-500">
                        Anota cómo se evalúa la materia (p. ej. “Parciales 60%, proyecto 30%, tareas 10%”).
                    </p>
                )}
            </div>
        </section>
    );
}
