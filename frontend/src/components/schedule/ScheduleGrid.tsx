import React from 'react';
import type { HorarioRegistro } from '../../types/schedule';
import { saveToSchedule, deleteFromSchedule } from '../../services//scheduleService';

const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 7 AM to 9 PM
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

type Props = {
    asignaciones: HorarioRegistro[];
    setAsignaciones: React.Dispatch<React.SetStateAction<HorarioRegistro[]>>;
}
const ScheduleGrid = ({ asignaciones, setAsignaciones }: Props) => {
    const token = localStorage.getItem('token') || '';
    
    const handleDrop = async (e: React.DragEvent, day: string, hour: number) => {
        e.preventDefault();
        const idString = e.dataTransfer.getData("materiaId");
        const subject_id = Number(idString);
        const subject_name = e.dataTransfer.getData("materiaNombre");
        const color = e.dataTransfer.getData("materiaColor");

        const existe = asignaciones.find(a => a.day === day && a.hour === hour);
        if (existe) return;

        // Formatear horas para MySQL (HH:mm:ss)
        const start_time = `${hour.toString().padStart(2, '0')}:00:00`;
        const end_time = `${hour.toString().padStart(2, '0')}:59:59`;

        const nuevaAsignacion: HorarioRegistro = {
            subject_id,
            subject_name,
            day,
            hour,
            color,
        };

        try {
            // 1. Guardar en DB
            const response = await saveToSchedule({
                subject_id,
                day,
                start_time,
                end_time,
                classroom: subject_name // Usando el nombre como classroom por ahora
            }, token);

            // 2. Actualizar estado local con el ID devuelto por la DB (importante para borrar)
            setAsignaciones(prev => [...prev, { ...nuevaAsignacion, id: response.insertedId }]);
            
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("No se pudo guardar la materia en el horario.");
        }
    };

    const handleRemove = async (id?: number, day?: string, hour?: number) => {
        if (!id) return;

        try {
            await deleteFromSchedule(id, token);
            setAsignaciones(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            {/* Encabezado de Días */}
            <div className="grid grid-cols-6 bg-slate-800 text-white text-center py-3">
                <div className="text-sm font-semibold border-r border-slate-700">Hora</div>
                {DAYS.map(day => (
                    <div key={day} className="text-sm font-semibold uppercase tracking-wider">
                        {day === 'Tuesday' ? 'Martes' :
                            day === 'Monday' ? 'Lunes' :
                                day === 'Wednesday' ? 'Miércoles' :
                                    day === 'Thursday' ? 'Jueves' : 'Viernes'}
                    </div>
                ))}
            </div>

            {/* Cuerpo del Horario */}
            <div className="grid grid-cols-6">
                {HOURS.map(hour => (
                    <React.Fragment key={hour}>
                        {/* Celda de la Hora */}
                        <div className="h-10 flex items-center justify-center border-r border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-500">
                            {`${hour}:00`}
                        </div>

                        {/* Celdas de los Días */}
                        {DAYS.map(day => {
                            // Buscar si hay una materia en esta celda
                            const asignada = asignaciones.find(a => a.day === day && a.hour === hour);

                            return (
                                <div
                                    key={`${day}-${hour}`}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => handleDrop(e, day, hour)}
                                    className="h-10 border-r border-b border-slate-100 hover:bg-blue-50 transition-colors relative"
                                >
                                    {asignada && (
                                        <div
                                            onClick={() => handleRemove(asignada.id, day, hour)}
                                            className="absolute inset-1 bg-blue-500 text-white text-[10px] p-1 rounded shadow-sm flex items-center justify-center text-center cursor-pointer hover:bg-red-500 transition-colors font-bold [text-shadow:_0.5px_0.5px_0_#000,_-0.5px_-0.5px_0_#000,_0.5px_-0.5px_0_#000,_-0.5px_0.5px_0_#000]"
                                            style={{ backgroundColor: asignada.color }}
                                            title="Click para eliminar"
                                        >
                                            {asignada.subject_name}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

export default ScheduleGrid;