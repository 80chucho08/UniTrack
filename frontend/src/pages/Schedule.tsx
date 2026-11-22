import { useState, useEffect, useContext } from "react";
import type { HorarioRegistro } from "../types/schedule";
import type { Semester } from "../services/semesterService";
import ScheduleGrid from '../components/schedule/ScheduleGrid';
import SchedulePanel from '../components/schedule/SchedulePanel';
import ScheduleSelect from "../components/schedule/ScheduleSelect";
import { getSemesters } from "../services/semesterService";
import { AuthContext } from "../context/AuthContext";
import { getFullSchedule } from "../services/scheduleService";

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

    // 2. Cargar el Horario Guardado (NUEVO)
    useEffect(() => {
        const loadSavedSchedule = async () => {
            if (!token) return;
            try {
                const data = await getFullSchedule(token);

                // Mapeamos los datos del backend al formato que usa tu Grid
                const mapeado: HorarioRegistro[] = data.map((item) => ({
                    id: item.schedule_id, // Usamos el ID de la tabla schedule
                    subject_id: item.subject_id,
                    subject_name: item.subject_name,
                    color: item.subject_color,
                    day: item.day,
                    // Extraemos la hora (ej: "07:00:00" -> 7)
                    hour: parseInt(item.start_time.split(':')[0])
                }));

                setAsignaciones(mapeado);
            } catch (error) {
                console.error("Error al cargar el horario guardado", error);
            }
        };

        loadSavedSchedule();
    }, [token]);

    const selectedSemesterData = semesters.find(s => s.id === selectedSemester);
    return (
        <div className="px-4 py-8 md:px-8 lg:px-10 max-w-7xl w-full mx-auto">
            <header className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                <div>
                    <h2 className="text-3xl md:text-[2.5rem] md:leading-[1.1] font-extrabold tracking-tight text-ink">
                        Mi horario
                    </h2>
                    <p className="mt-2 text-ink-muted">Organiza tus clases de lunes a viernes.</p>
                </div>
                <ScheduleSelect
                    semesters={semesters}
                    selected={selectedSemester}
                    onChange={setSelectedSemester}
                />
            </header>

            <div className="grid grid-cols-1 gap-7">

                {selectedSemesterData ? (
                    <SchedulePanel semester={selectedSemesterData} />
                ) : (
                    <div className="neu-inset rounded-2xl p-5 text-ink-muted">
                        Selecciona un semestre para ver sus materias.
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