const onDragStart = (e: React.DragEvent, materiaId: number) => {
    e.dataTransfer.setData("materiaId", materiaId.toString());
};

interface Props {
    semester: number;
}

const SchedulePanel = ({ semester }: Props) => {
    const materiaDummy = { id: 1, name: "Programacion Web" };
    return (
        <div className="bg-slate-50 p-4 rounded-xl border-2 border-dashed border-slate-300">
            <h3 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">Materias Semestre {semester}</h3>
            <div className="flex flex-wrap gap-3">
                <div
                    draggable
                    onDragStart={(e) => onDragStart(e, materiaDummy.id)}
                    className="cursor-grab active:cursor-grabbing bg-white border-l-4 border-blue-500 p-3 shadow-sm rounded-md hover:shadow-md transition-all w-48"
                >
                    <p className="font-bold text-sm">{materiaDummy.name}</p>
                </div>
            </div>
        </div>
    );
}

export default SchedulePanel;