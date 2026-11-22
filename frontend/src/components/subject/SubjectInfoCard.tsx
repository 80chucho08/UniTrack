import { Link } from "react-router-dom";
import { BookOpen, Clock, Info, Mail, MapPin, User } from "lucide-react";
import type { SubjectDetail } from "../../services/subjectService";
import type { SubjectClass } from "../../services/scheduleService";
import { DAY_LABELS } from "../../utils/date";
import { SectionTitle } from "./SectionTitle";

interface Props {
    subject: SubjectDetail;
    classes: SubjectClass[];
    onEdit: () => void;
}

export function SubjectInfoCard({ subject, classes, onEdit }: Props) {
    const hasInfo = subject.teacher_name || subject.teacher_email || subject.credits != null;

    return (
        <section className="neu-raised rounded-[24px] p-5 sm:p-6 flex flex-col gap-6">
            {/* Profesor y créditos */}
            <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                    <SectionTitle icon={<Info size={19} />} tone="text-sky-600" title="Información" />
                    <button onClick={onEdit} className="text-sm font-semibold text-brand-600 hover:text-brand-700 hover:underline">
                        Editar
                    </button>
                </div>

                {hasInfo ? (
                    <ul className="flex flex-col gap-2.5 text-sm text-ink">
                        {subject.teacher_name && (
                            <li className="flex items-center gap-2.5">
                                <User size={16} className="text-ink-subtle shrink-0" />
                                {subject.teacher_name}
                            </li>
                        )}
                        {subject.teacher_email && (
                            <li className="flex items-center gap-2.5 min-w-0">
                                <Mail size={16} className="text-ink-subtle shrink-0" />
                                <a href={`mailto:${subject.teacher_email}`} className="text-brand-600 hover:underline truncate">
                                    {subject.teacher_email}
                                </a>
                            </li>
                        )}
                        {subject.credits != null && (
                            <li className="flex items-center gap-2.5">
                                <BookOpen size={16} className="text-ink-subtle shrink-0" />
                                {subject.credits} crédito{subject.credits === 1 ? "" : "s"}
                            </li>
                        )}
                    </ul>
                ) : (
                    <p className="text-sm text-ink-muted">Agrega los datos del profesor y los créditos.</p>
                )}
            </div>

            {/* Horario de la materia */}
            <div>
                <h3 className="text-sm font-semibold text-ink mb-3">Horario</h3>
                {classes.length === 0 ? (
                    <p className="text-sm text-ink-muted">
                        Sin clases asignadas.{" "}
                        <Link to="/dashboard/schedule" className="text-brand-600 font-semibold hover:underline">
                            Ir al horario
                        </Link>
                    </p>
                ) : (
                    <ul className="flex flex-col gap-2.5">
                        {classes.map(c => (
                            <li key={c.schedule_id} className="neu-inset flex items-center justify-between gap-2 text-sm px-3 py-2.5 rounded-xl">
                                <span className="font-semibold text-ink">{DAY_LABELS[c.day] ?? c.day}</span>
                                <span className="flex items-center gap-3 text-ink-muted">
                                    <span className="flex items-center gap-1 tabular-nums">
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
                <h3 className="text-sm font-semibold text-ink mb-3">Criterios de evaluación</h3>
                {subject.evaluation_criteria ? (
                    <p className="neu-inset rounded-xl px-3 py-2.5 text-sm text-ink whitespace-pre-line">{subject.evaluation_criteria}</p>
                ) : (
                    <p className="text-sm text-ink-muted">
                        Anota cómo se evalúa la materia (p. ej. “Parciales 60%, proyecto 30%, tareas 10%”).
                    </p>
                )}
            </div>
        </section>
    );
}
