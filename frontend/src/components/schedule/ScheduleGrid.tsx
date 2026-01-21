import React, { useState } from 'react';
import type { Materia, HorarioRegistro } from '../../types/schedule';

const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 7 AM to 9 PM
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

type Props = {
    asignaciones: HorarioRegistro[];
    setAsignaciones: React.Dispatch<React.SetStateAction<HorarioRegistro[]>>;
}
const ScheduleGrid = ({ asignaciones, setAsignaciones }: Props) => {
    // const [asignaciones, setAsignaciones] = useState<HorarioRegistro[]>([]);

    const handleDrop = (e: React.DragEvent, day: string, hour: number) => {
        e.preventDefault();
        // 1. Obtener el ID como string y convertirlo a número
        const idString = e.dataTransfer.getData("materiaId");
        const materiaId = Number(idString);

        const existe = asignaciones.find(a => a.day === day && a.hour === hour);
        if (existe) return;

        const nuevaAsignacion: HorarioRegistro = {
            subject_id: materiaId,
            subject_name: e.dataTransfer.getData("materiaNombre"),
            day,
            hour,
            color: e.dataTransfer.getData("materiaColor"),
        };

        setAsignaciones([...asignaciones, nuevaAsignacion]);

        //fetch

        console.log(`Dropped on Materia ${materiaId}, Día ${day}, Hora ${hour}:00`);
        // Aquí harás el fetch a tu backend de Node/Express
    };

    const removeAsignacion = (day: string, hour: number) => {
        setAsignaciones(asignaciones.filter(a => !(a.day === day && a.hour === hour)));
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
                                            onClick={() => removeAsignacion(day, hour)}
                                            className="absolute inset-1 bg-blue-500 text-white text-[10px] p-1 rounded shadow-sm flex items-center justify-center text-center cursor-pointer hover:bg-red-500 transition-colors"
                                            title="Click para eliminar"
                                        >
                                            Materia {asignada.subject_id}
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