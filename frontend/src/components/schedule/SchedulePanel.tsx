import type { Materia } from "../../types/schedule";
import type { Semester } from "../../services/semesterService";
import { useEffect, useState } from "react";
import { GripVertical } from "lucide-react";
import { getMateriasBySemester } from "../../services/scheduleService";
import { readableTextColor, subjectInitials } from "../../utils/subject";

interface Props {
    semester: Semester;
}

const SchedulePanel = ({ semester }: Props) => {
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMaterias = async () => {
            try {
                setLoading(true);
                const data = await getMateriasBySemester(semester.id);
                setMaterias(data);
            } catch (error) {
                console.error("Error al cargar materias", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMaterias();
    }, [semester.id]);

    const handleDragStart = (
        e: React.DragEvent,
        materia: Materia
    ) => {
        e.dataTransfer.setData("materiaId", materia.id.toString());
        e.dataTransfer.setData("materiaNombre", materia.name);
        e.dataTransfer.setData("materiaColor", materia.color);
    };
    return (
        <section className="neu-raised rounded-[24px] p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-5">
                <h3 className="text-lg font-bold text-ink">Materias de {semester.name}</h3>
                <p className="text-sm text-ink-subtle">Arrastra una materia a una celda del horario.</p>
            </div>

            {loading && (
                <p className="text-sm text-ink-muted">Cargando materias...</p>
            )}

            {!loading && materias.length === 0 && (
                <p className="neu-inset rounded-2xl text-sm text-center text-ink-muted py-5 px-4">
                    Este semestre aún no tiene materias.
                </p>
            )}

            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4">
                {materias.map((m) => {
                    const color = m.color || "#6366f1";
                    const textColor = readableTextColor(color);
                    const lightText = textColor === "#ffffff";
                    return (
                        <div
                            key={m.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, m)}
                            title={`Arrastra "${m.name}" al horario`}
                            className="group flex items-center gap-2.5 sm:gap-3 min-w-0 sm:w-56 pl-2.5 pr-2 py-2.5 rounded-2xl
                                cursor-grab active:cursor-grabbing active:scale-[0.97] hover:-translate-y-0.5 transition select-none"
                            style={{
                                background: `linear-gradient(135deg, ${color} 0%, ${color}e0 100%)`,
                                color: textColor,
                                // relieve: sombra teñida del color + luz blanca arriba-izquierda
                                boxShadow: `5px 6px 14px -2px ${color}66, -4px -4px 10px rgb(255 255 255 / 0.9), inset 0 1px 0 rgb(255 255 255 / 0.25)`
                            }}
                        >
                            <span
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 text-[11px] sm:text-xs font-bold"
                                style={{
                                    backgroundColor: lightText ? "rgb(255 255 255 / 0.22)" : "rgb(0 0 0 / 0.08)",
                                    boxShadow: lightText
                                        ? "inset 0 0 0 1px rgb(255 255 255 / 0.3)"
                                        : "inset 0 0 0 1px rgb(0 0 0 / 0.08)"
                                }}
                            >
                                {subjectInitials(m.name)}
                            </span>
                            <p className="flex-1 min-w-0 text-[13px] sm:text-sm font-semibold leading-snug line-clamp-2 [overflow-wrap:anywhere] sm:[overflow-wrap:normal]">
                                {m.name}
                            </p>
                            <GripVertical size={16} className="hidden sm:block shrink-0 opacity-50 group-hover:opacity-90 transition-opacity" />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default SchedulePanel;
