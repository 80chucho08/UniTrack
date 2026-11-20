import { Award, CalendarClock, ListChecks, StickyNote } from "lucide-react";

interface Props {
    average: number | null;
    evaluatedWeight: number;
    pendingTodos: number;
    overdueTodos: number;
    notesCount: number;
    classesPerWeek: number;
}

interface StatProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    hint: string;
    accent: string;
}

const Stat = ({ icon, label, value, hint, accent }: StatProps) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
            <p className="text-2xl font-extrabold text-gray-900 leading-tight">{value}</p>
            <p className="text-xs text-gray-500 truncate">{hint}</p>
        </div>
    </div>
);

export function SubjectStats({ average, evaluatedWeight, pendingTodos, overdueTodos, notesCount, classesPerWeek }: Props) {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            <Stat
                icon={<Award size={22} />}
                accent="bg-indigo-50 text-indigo-600"
                label="Promedio"
                value={average === null ? "—" : average.toFixed(1)}
                hint={`${evaluatedWeight.toFixed(0)}% del curso evaluado`}
            />
            <Stat
                icon={<ListChecks size={22} />}
                accent="bg-amber-50 text-amber-600"
                label="Tareas pendientes"
                value={String(pendingTodos)}
                hint={overdueTodos > 0 ? `${overdueTodos} vencida${overdueTodos === 1 ? "" : "s"}` : "Al día"}
            />
            <Stat
                icon={<StickyNote size={22} />}
                accent="bg-emerald-50 text-emerald-600"
                label="Notas"
                value={String(notesCount)}
                hint="Apuntes de la materia"
            />
            <Stat
                icon={<CalendarClock size={22} />}
                accent="bg-sky-50 text-sky-600"
                label="Clases por semana"
                value={String(classesPerWeek)}
                hint="Según tu horario"
            />
        </section>
    );
}
