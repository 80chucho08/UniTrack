import { useState } from "react";

interface Props {
    selected: number,
    onChange: (val: number) => void;
}

const ScheduleSelect = ({ selected, onChange }: Props) => {
    
    return (
        <div >
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <label className="font-semibold text-slate-700">Semestre:</label>
                <select
                    value={selected}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="bg-slate-50 border border-slate-300 text-slate-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(s => (
                        <option key={s} value={s}>Semestre {s}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default ScheduleSelect;