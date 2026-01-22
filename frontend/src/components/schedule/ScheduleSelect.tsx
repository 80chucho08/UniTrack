import type { Semester } from "../../services/semesterService";

interface Props {
    semesters: Semester[];
    selected: number | null,
    onChange: (val: number) => void;
}

const ScheduleSelect = ({semesters,  selected, onChange }: Props) => {

    return (
        <div >
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <label className="font-semibold text-slate-700">Semestre:</label>
                <select
                    value={selected ?? ""}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="bg-slate-50 border border-slate-300 text-slate-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                >
                    {semesters.map(s => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default ScheduleSelect;