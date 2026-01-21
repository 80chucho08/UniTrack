import type { Materia } from "../../types/schedule";
import { useEffect, useState } from "react";
import { getMateriasBySemester } from "../../services/scheduleService";

interface Props {
    semester: number;
}
const semesterId = 2;

const SchedulePanel = ({ semester }: Props) => {
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMaterias = async () => {
            try {
                setLoading(true);
                const data = await getMateriasBySemester(semesterId);
                setMaterias(data);
            } catch (error) {
                console.error("Error al cargar materias", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMaterias();
    }, [semester]);

    const handleDragStart = (
        e: React.DragEvent,
        materia: Materia
    ) => {
        e.dataTransfer.setData("materiaId", materia.id.toString());
        e.dataTransfer.setData("materiaNombre", materia.name);
        e.dataTransfer.setData("materiaColor", materia.color);
    };
    return (
        <div className="bg-slate-50 p-4 rounded-xl border-2 border-dashed border-slate-300">
            <h3 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">Materias Semestre {semester}</h3>

            {loading && (
                <p className="text-sm text-slate-400">Cargando materias...</p>
            )}
            <div className="flex flex-wrap gap-3">
                {materias.map((m) => (
                    <div
                        key={m.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, m)}
                        className="cursor-grab active:cursor-grabbing bg-white border-l-4 border-blue-500 p-3 shadow-sm rounded-md hover:shadow-md transition-all w-48"
                        style={{ borderColor: m.color}}
                    >
                        <p className="font-bold text-sm">{m.name}</p>
                    </div>

                ))}
            </div>
        </div>
    );
}

export default SchedulePanel;