import { useState } from "react";
import { Trash2 } from "lucide-react";
import type { SubjectDetail, SubjectUpdate } from "../../services/subjectService";

interface Props {
    subject: SubjectDetail;
    onClose: () => void;
    onSave: (data: SubjectUpdate) => Promise<void>;
    onDelete: () => Promise<void>;
}

const inputClass =
    "w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-0 transition-colors outline-none text-gray-800 placeholder:text-gray-400";

export function EditSubjectModal({ subject, onClose, onSave, onDelete }: Props) {
    const [name, setName] = useState(subject.name);
    const [teacherName, setTeacherName] = useState(subject.teacher_name ?? "");
    const [teacherEmail, setTeacherEmail] = useState(subject.teacher_email ?? "");
    const [credits, setCredits] = useState(subject.credits != null ? String(subject.credits) : "");
    const [color, setColor] = useState(subject.color || "#6366f1");
    const [criteria, setCriteria] = useState(subject.evaluation_criteria ?? "");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            setSaving(true);
            setError("");
            await onSave({
                name: name.trim(),
                teacher_name: teacherName,
                teacher_email: teacherEmail,
                credits: credits === "" ? null : Number(credits),
                color,
                evaluation_criteria: criteria
            });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo guardar");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `¿Eliminar "${subject.name}"? Se borrarán sus notas, tareas, calificaciones y clases del horario. No se puede deshacer.`
        );
        if (!confirmed) return;

        try {
            setSaving(true);
            await onDelete();
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo eliminar la materia");
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <form
                onSubmit={handleSubmit}
                className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 z-10 max-h-[90vh] overflow-y-auto"
            >
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Editar materia</h2>
                    <p className="text-gray-500 text-sm">Actualiza los datos generales del curso.</p>
                </div>

                <div className="flex flex-col gap-5 mb-8">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre de la materia</label>
                        <input
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            maxLength={100}
                            className={inputClass}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Profesor</label>
                            <input
                                value={teacherName}
                                onChange={(e) => setTeacherName(e.target.value)}
                                maxLength={100}
                                className={inputClass}
                                placeholder="Nombre"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email del profesor</label>
                            <input
                                type="email"
                                value={teacherEmail}
                                onChange={(e) => setTeacherEmail(e.target.value)}
                                maxLength={150}
                                className={inputClass}
                                placeholder="teacher@email.com"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Créditos</label>
                            <input
                                type="number"
                                min={0}
                                step={1}
                                value={credits}
                                onChange={(e) => setCredits(e.target.value)}
                                className={inputClass}
                                placeholder="Ej. 8"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="h-12 w-12 rounded-lg border border-gray-200 cursor-pointer"
                                />
                                <span className="font-mono text-sm font-bold" style={{ color }}>
                                    {color.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Criterios de evaluación</label>
                        <textarea
                            value={criteria}
                            onChange={(e) => setCriteria(e.target.value)}
                            rows={4}
                            className={`${inputClass} resize-y`}
                            placeholder="Ej. Parciales 60%, proyecto 30%, tareas 10%"
                        />
                    </div>
                </div>

                {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

                <div className="flex items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2.5 text-red-600 font-semibold hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                    >
                        <Trash2 size={16} /> <span className="hidden sm:inline">Eliminar materia</span>
                    </button>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-gray-500 font-semibold hover:bg-gray-50 rounded-xl transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving || !name.trim()}
                            className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 transition-all active:scale-95"
                        >
                            {saving ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
