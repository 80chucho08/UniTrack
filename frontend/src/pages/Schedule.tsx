import { useState } from "react";
import type { Materia, HorarioRegistro } from "../types/schedule";
import ScheduleGrid from '../components/schedule/ScheduleGrid';
import SchedulePanel from '../components/schedule/SchedulePanel';
import ScheduleSelect from "../components/schedule/ScheduleSelect";

const Schedule = () => {
    const [selectedSemester, setSelectedSemester] = useState(1);
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50 min-h-screen">
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800">Mi Horario</h1>
                <ScheduleSelect
                    selected={selectedSemester}
                    onChange={setSelectedSemester}
                />
            </header>

            <div className="grid grid-cols-1 gap-6">
                <SchedulePanel semester={selectedSemester} />
                <ScheduleGrid />
            </div>
        </div>
    );
};

export default Schedule;