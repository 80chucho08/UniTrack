import type { Semester } from "../../services/semesterService";

interface Props {
    semesters: Semester[];
    selected: number | null,
    onChange: (val: number) => void;
}

const ScheduleSelect = ({semesters,  selected, onChange }: Props) => {

    return (
        <label className="flex items-center gap-3">
            <span className="text-sm font-semibold text-ink-muted">Semestre</span>
            <select
                value={selected ?? ""}
                onChange={(e) => onChange(Number(e.target.value))}
                className="neu-input h-10 min-w-[11rem] rounded-xl px-3 text-sm font-semibold cursor-pointer"
            >
                {semesters.map(s => (
                    <option key={s.id} value={s.id}>
                        {s.name}
                    </option>
                ))}
            </select>
        </label>
    );
}

export default ScheduleSelect;
