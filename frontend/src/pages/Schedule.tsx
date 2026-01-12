import { DashboardHeader } from "../components/DashboardHeader";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { useState } from "react";
import ScheduleGrid from "../components/schedule/ScheduleGrid";
import SubjectCard from "../components/schedule/SubjectCard";

const initialSubjects = [
    { id: "1", name: "Matematicas", color: "#F87171" },
    { id: "2", name: "Historia", color: "#34D399" },
];




const Schedule = () => {
    const [subjects, setSubjects] = useState(initialSubjects);
    const [assigned, setAssigned] = useState<Record<string, any>>({});

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        const subject = subjects.find(s => s.id === active.id);
        if (!subject) return;

        setAssigned(prev => ({
            ...prev,
            [over.id]: subject,
        }));
    };

    return (
        <>
            <main className="p6 lg:p-10 max-w-7x1 w-full mx-auto">
                <DashboardHeader
                    title="Horario"
                    subtitle={`Visualiza y organiza tu horario académico`}
                >
                    {/* Additional content or buttons can be added here */}
                </DashboardHeader>

                <div>
                    <DndContext onDragEnd={handleDragEnd}>
                        <div className="flex gap-6 p-6">
                            {/* Materias */}
                            <div className="w-64 space-y-3">
                                <h2 className="font-bold">Materias</h2>
                                {subjects.map(subject => (
                                    <SubjectCard key={subject.id} subject={subject} />
                                ))}
                            </div>

                            {/* Horario */}
                            <ScheduleGrid assigned={assigned} />
                        </div>
                    </DndContext>
                </div>
            </main>
        </>
    )
}

export default Schedule;