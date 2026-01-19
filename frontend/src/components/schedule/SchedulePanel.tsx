import type { Materia } from "../../types/schedule";

interface Props {
    semester: number;
}

const SchedulePanel = ({ semester }: Props) => {
    const materiasDelSemestre: Materia[] = [
        { id: 1, name: "Programación Web", color: "blue" },
        { id: 2, name: "Bases de Datos", color: "green" },
        { id: 3, name: "Redes", color: "purple" },
    ];

    const handleDragStart = (e: React.DragEvent, id: number, name: string) => {
        e.dataTransfer.setData("materiaId", id.toString());
        e.dataTransfer.setData("materiaNombre", name);
    };
    return (
        <div className="bg-slate-50 p-4 rounded-xl border-2 border-dashed border-slate-300">
            <h3 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">Materias Semestre {semester}</h3>
            <div className="flex flex-wrap gap-3">
                {materiasDelSemestre.map((m) => (
                    <div
                        key={m.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, m.id, m.name)}
                        className="cursor-grab active:cursor-grabbing bg-white border-l-4 border-blue-500 p-3 shadow-sm rounded-md hover:shadow-md transition-all w-48"
                    >
                        <p className="font-bold text-sm">{m.name}</p>
                    </div>

                ))}
            </div>
        </div>
    );
}

export default SchedulePanel;