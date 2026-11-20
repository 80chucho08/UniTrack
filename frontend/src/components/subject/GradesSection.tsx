import { useContext, useState } from "react";
import { Award, Plus, Trash2, X } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { createGrade, deleteGrade, weightedAverage, type Grade } from "../../services/gradeService";
import { formatShortDate } from "../../utils/date";

interface Props {
    subjectId: number;
    color: string;
    grades: Grade[];
    setGrades: React.Dispatch<React.SetStateAction<Grade[]>>;
}

const inputClass =
    "w-full border-2 border-gray-100 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 outline-none transition-colors text-gray-800 placeholder:text-gray-400";

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
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2">
                    <Award size={20} className="text-indigo-600" />
                    <h2 className="text-xl font-bold text-gray-800">Calificaciones</h2>
                </div>
                {!adding && (
                    <button
                        onClick={() => setAdding(true)}
                        className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                        <Plus size={18} /> Evaluación
                    </button>
                )}
            </div>

            {/* Resumen */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5 p-4 rounded-xl bg-gray-50">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Promedio ponderado</p>
                    <p className="text-3xl font-extrabold text-gray-900">
                        {average === null ? "—" : average.toFixed(1)}
                        <span className="text-base font-medium text-gray-400"> / 100</span>
                    </p>
                </div>
                <div className="flex-1">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Porcentaje evaluado</span>
                        <span className={evaluatedWeight > 100 ? "text-red-600 font-semibold" : ""}>
                            {evaluatedWeight.toFixed(0)}%
                        </span>
                    </div>
                    <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(evaluatedWeight, 100)}%`, backgroundColor: color }}
                        />
                    </div>
                    {evaluatedWeight > 100 && (
                        <p className="text-xs text-red-600 mt-1">Los porcentajes suman más de 100%.</p>
                    )}
                </div>
            </div>

            {adding && (
                <form onSubmit={handleAdd} className="mb-5 p-4 rounded-xl border-2 border-indigo-100 bg-indigo-50/40">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
                            className={`${inputClass} col-span-2 md:col-span-1 text-gray-600`}
                        />
                    </div>
                    {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                    <div className="flex justify-end gap-2 mt-3">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="flex items-center gap-1 px-4 py-2 text-gray-500 font-semibold hover:bg-white rounded-lg transition-colors"
                        >
                            <X size={16} /> Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                        >
                            {saving ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            )}

            {!adding && error && <p className="text-sm text-red-600 mb-3">{error}</p>}

            {grades.length === 0 ? (
                <p className="text-sm text-center text-gray-500 py-4">
                    Registra tus parciales, proyectos y tareas evaluadas para ver tu promedio.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                                <th className="py-2 font-semibold">Evaluación</th>
                                <th className="py-2 font-semibold">Fecha</th>
                                <th className="py-2 font-semibold text-right">Peso</th>
                                <th className="py-2 font-semibold text-right">Calificación</th>
                                <th className="py-2 w-8" />
                            </tr>
                        </thead>
                        <tbody>
                            {grades.map(grade => (
                                <tr key={grade.id} className="group border-b border-gray-50 last:border-0">
                                    <td className="py-3 font-medium text-gray-800">{grade.name}</td>
                                    <td className="py-3 text-gray-500">{grade.date ? formatShortDate(grade.date) : "—"}</td>
                                    <td className="py-3 text-right text-gray-500">{grade.weight}%</td>
                                    <td className={`py-3 text-right font-bold ${grade.value >= 70 ? "text-emerald-600" : "text-red-600"}`}>
                                        {grade.value}
                                    </td>
                                    <td className="py-3 text-right">
                                        <button
                                            onClick={() => handleDelete(grade)}
                                            title="Eliminar"
                                            className="text-gray-300 hover:text-red-600 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
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
