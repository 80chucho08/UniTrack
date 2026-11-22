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
    tone: string;
    alert?: boolean;
}

const Stat = ({ icon, label, value, hint, tone, alert }: StatProps) => (
    <div className="neu-raised rounded-[22px] p-4 sm:p-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
        {/* Pozo hundido para el ícono */}
        <div className={`neu-inset w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${tone}`}>
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-sm text-ink-muted">{label}</p>
            <p className="text-2xl font-extrabold text-ink leading-tight tabular-nums">{value}</p>
            <p className={`text-xs truncate ${alert ? "text-red-600 font-semibold" : "text-ink-subtle"}`}>{hint}</p>
        </div>
    </div>
);

export function SubjectStats({ average, evaluatedWeight, pendingTodos, overdueTodos, notesCount, classesPerWeek }: Props) {
    return (
        <section className="grid grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-8">
            <Stat
                icon={<Award size={22} />}
                tone="text-brand-600"
                label="Promedio"
                value={average === null ? "—" : average.toFixed(1)}
                hint={`${evaluatedWeight.toFixed(0)}% del curso evaluado`}
            />
            <Stat
                icon={<ListChecks size={22} />}
                tone="text-amber-600"
                label="Tareas pendientes"
                value={String(pendingTodos)}
                hint={overdueTodos > 0 ? `${overdueTodos} vencida${overdueTodos === 1 ? "" : "s"}` : "Al día"}
                alert={overdueTodos > 0}
            />
            <Stat
                icon={<StickyNote size={22} />}
                tone="text-emerald-600"
                label="Notas"
                value={String(notesCount)}
                hint="Apuntes de la materia"
            />
            <Stat
                icon={<CalendarClock size={22} />}
                tone="text-sky-600"
                label="Clases por semana"
                value={String(classesPerWeek)}
                hint="Según tu horario"
            />
        </section>
    );
}
