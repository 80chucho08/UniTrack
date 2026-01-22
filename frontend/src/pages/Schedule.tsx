import { useState, useEffect, useContext } from "react";
import type { Materia, HorarioRegistro } from "../types/schedule";
import type { Semester } from "../services/semesterService";
import ScheduleGrid from '../components/schedule/ScheduleGrid';
import SchedulePanel from '../components/schedule/SchedulePanel';
import ScheduleSelect from "../components/schedule/ScheduleSelect";
import { getSemesters } from "../services/semesterService";
import { AuthContext } from "../context/AuthContext";

const Schedule = () => {
    const [asignaciones, setAsignaciones] = useState<HorarioRegistro[]>([]);
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [selectedSemester, setSelectedSemester] = useState<number | null>(null);

    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                if (!token) return;
                const data = await getSemesters(token);
                setSemesters(data);
                if (data.length > 0) {
                    setSelectedSemester(data[0].id);
                }
            } catch (error) {
                console.error("Error al obtener semestres", error);
            }
        }
        fetchSemesters();
    }, [token]);

    const selectedSemesterData = semesters.find(s => s.id === selectedSemester);
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50 min-h-screen">
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800">Mi Horario</h1>
                <ScheduleSelect
                    semesters={semesters}
                    selected={selectedSemester}
                    onChange={setSelectedSemester}
                />
            </header>

            <div className="grid grid-cols-1 gap-6">

                {selectedSemesterData ? (
                    <SchedulePanel semester={selectedSemesterData} />
                ) : (
                    <div className="p-4 bg-slate-100 rounded-lg text-slate-500">
                        Selecciona un semestre para ver las materias...
                    </div>
                )}
                <ScheduleGrid
                    asignaciones={asignaciones}
                    setAsignaciones={setAsignaciones}
                />
            </div>
        </div>
    );
};

export default Schedule;