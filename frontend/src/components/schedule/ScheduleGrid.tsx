import React from 'react';

const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 7 AM to 9 PM
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];


const ScheduleGrid = () => {
    const onDropMateria = (day: string, hour: number, e: React.DragEvent) => {
        const materiaId = e.dataTransfer.getData("materiaId");
        console.log(`Materia ${materiaId} asignada a ${day} a las ${hour}:00`);

        //api llamada 
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
                        {DAYS.map(day => (
                            <div
                                key={`${day}-${hour}`}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => console.log(`Dropped in ${day} at ${hour}:00`)}
                                className="h-10 border-r border-b border-slate-100 hover:bg-blue-50/50 transition-colors relative group cursor-pointer"
                            >
                                {/* Aquí irán las cards soltadas */}
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

export default ScheduleGrid;