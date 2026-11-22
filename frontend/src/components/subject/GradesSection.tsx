import { useContext, useState } from "react";
import { Award, Plus, Trash2 } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { createGrade, deleteGrade, weightedAverage, type Grade } from "../../services/gradeService";
import { formatShortDate } from "../../utils/date";
import { SectionTitle } from "./SectionTitle";
import { btnGhost, btnPrimary } from "../../utils/ui";

interface Props {
    subjectId: number;
    color: string;
    grades: Grade[];
    setGrades: React.Dispatch<React.SetStateAction<Grade[]>>;
}

const inputClass = "neu-input w-full h-10 rounded-xl px-3 text-sm";

export function GradesSection({ subjectId, color, grades, setGrades }: Props) {
    const { token } = useContext(AuthContext);
    const [adding, setAdding] = useState(false);
    const [name, setName] = useState("");
    const [value, setValue] = useState("");
    const [weight, setWeight] = useState("");
    const [date, setDate] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const average = weightedAverage(grades);
    const evaluatedWeight = grades.reduce((sum, g) => sum + g.weight, 0);

    const resetForm = () => {
        setName("");
        setValue("");
        setWeight("");
        setDate("");
        setError("");
        setAdding(false);
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        try {
            setSaving(true);
            setError("");
            const created = await createGrade(subjectId, {
                name: name.trim(),
                value: Number(value),
                weight: Number(weight),
                date: date || null
            }, token);
            setGrades(prev => [...prev, created]);
            resetForm();
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo registrar la calificación");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (grade: Grade) => {
        if (!token || !window.confirm(`¿Eliminar "${grade.name}"?`)) return;
        try {
            await deleteGrade(grade.id, token);
            setGrades(prev => prev.filter(g => g.id !== grade.id));
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo eliminar la calificación");
        }
    };

    return (
        <section className="neu-raised rounded-[24px] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-6">
                <SectionTitle
                    icon={<Award size={19} />}
                    tone="text-brand-600"
                    title="Calificaciones"
                    detail={grades.length === 1 ? "1 evaluación" : `${grades.length} evaluaciones`}
                />
                {!adding && (
                    <button onClick={() => setAdding(true)} className={`${btnPrimary} shrink-0`}>
                        <Plus size={17} /> Evaluación
                    </button>
                )}
            </div>

            {/* Resumen */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
                <div className="neu-raised-sm rounded-2xl px-5 py-4 sm:min-w-[190px]">
                    <p className="text-sm text-ink-muted">Promedio ponderado</p>
                    <p className="text-[2rem] leading-tight font-extrabold text-ink tabular-nums">
                        {average === null ? "—" : average.toFixed(1)}
                        <span className="text-base font-medium text-ink-subtle"> / 100</span>
                    </p>
                </div>
                <div className="flex-1">
                    <div className="flex justify-between text-sm text-ink-muted mb-2">
                        <span>Porcentaje evaluado</span>
                        <span className={`tabular-nums ${evaluatedWeight > 100 ? "text-red-600 font-semibold" : "font-semibold text-ink"}`}>
                            {evaluatedWeight.toFixed(0)}%
                        </span>
                    </div>
                    {/* Canal hundido con el avance en el color de la materia */}
                    <div className="neu-inset h-3.5 rounded-full p-[3px]">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${Math.min(evaluatedWeight, 100)}%`,
                                backgroundColor: color,
                                boxShadow: `0 1px 6px ${color}66`
                            }}
                        />
                    </div>
                    {evaluatedWeight > 100 && (
                        <p className="text-xs text-red-600 mt-1.5">Los porcentajes suman más de 100%.</p>
                    )}
                </div>
            </div>

            {adding && (
                <form onSubmit={handleAdd} className="neu-raised-sm mb-6 p-4 rounded-2xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <input
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            maxLength={100}
                            placeholder="Ej. Parcial 1"
                            className={`${inputClass} col-span-2 md:col-span-1`}
                        />
                        <input
                            type="number"
                            min={0}
                            max={100}
                            step="0.01"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            required
                            placeholder="Calificación"
                            className={inputClass}
                        />
                        <input
                            type="number"
                            min={0}
                            max={100}
                            step="0.01"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            required
                            placeholder="Peso %"
                            className={inputClass}
                        />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className={`${inputClass} col-span-2 md:col-span-1 text-ink-muted`}
                        />
                    </div>
                    {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={resetForm} className={btnGhost}>
                            Cancelar
                        </button>
                        <button type="submit" disabled={saving} className={btnPrimary}>
                            {saving ? "Guardando..." : "Guardar evaluación"}
                        </button>
                    </div>
                </form>
            )}

            {!adding && error && <p className="text-sm text-red-600 mb-3">{error}</p>}

            {grades.length === 0 ? (
                <p className="neu-inset rounded-2xl text-sm text-center text-ink-muted py-6 px-4">
                    Registra tus parciales, proyectos y tareas evaluadas para ver tu promedio.
                </p>
            ) : (
                <div className="overflow-x-auto -mx-1">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-ink-subtle border-b border-line">
                                <th className="py-2 px-1 font-medium">Evaluación</th>
                                <th className="py-2 px-1 font-medium">Fecha</th>
                                <th className="py-2 px-1 font-medium text-right">Peso</th>
                                <th className="py-2 px-1 font-medium text-right">Calificación</th>
                                <th className="py-2 w-8" />
                            </tr>
                        </thead>
                        <tbody>
                            {grades.map(grade => (
                                <tr key={grade.id} className="group border-b border-line/70 last:border-0">
                                    <td className="py-3 px-1 font-medium text-ink">{grade.name}</td>
                                    <td className="py-3 px-1 text-ink-muted">{grade.date ? formatShortDate(grade.date) : "—"}</td>
                                    <td className="py-3 px-1 text-right text-ink-muted tabular-nums">{grade.weight}%</td>
                                    <td className="py-3 px-1 text-right">
                                        <span className={`inline-block min-w-[3rem] text-center px-2 py-0.5 rounded-lg font-bold tabular-nums
                                            ${grade.value >= 70 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                                            {grade.value}
                                        </span>
                                    </td>
                                    <td className="py-3 text-right">
                                        <button
                                            onClick={() => handleDelete(grade)}
                                            title="Eliminar"
                                            className="text-ink-subtle/60 hover:text-red-600 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
