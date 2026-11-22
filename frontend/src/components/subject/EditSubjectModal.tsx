import { useState } from "react";
import { Trash2 } from "lucide-react";
import { btnDanger, btnGhost, btnPrimary } from "../../utils/ui";
import type { SubjectDetail, SubjectUpdate } from "../../services/subjectService";

interface Props {
    subject: SubjectDetail;
    onClose: () => void;
    onSave: (data: SubjectUpdate) => Promise<void>;
    onDelete: () => Promise<void>;
}

const inputClass =
    "w-full neu-input rounded-xl px-4 py-3";

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
                className="absolute inset-0 bg-ink/35 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <form
                onSubmit={handleSubmit}
                className="relative bg-canvas border border-white/70 rounded-[28px] shadow-[0_24px_60px_-12px_rgb(30_36_51/0.35)] w-full max-w-lg p-8 z-10 max-h-[90vh] overflow-y-auto"
            >
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-ink">Editar materia</h2>
                    <p className="text-ink-muted text-sm">Actualiza los datos generales del curso.</p>
                </div>

                <div className="flex flex-col gap-5 mb-8">
                    <div>
                        <label className="block text-sm font-semibold text-ink mb-2">Nombre de la materia</label>
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
                            <label className="block text-sm font-semibold text-ink mb-2">Profesor</label>
                            <input
                                value={teacherName}
                                onChange={(e) => setTeacherName(e.target.value)}
                                maxLength={100}
                                className={inputClass}
                                placeholder="Nombre"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-ink mb-2">Email del profesor</label>
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
                            <label className="block text-sm font-semibold text-ink mb-2">Créditos</label>
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
                            <label className="block text-sm font-semibold text-ink mb-2">Color</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="neu-inset h-12 w-12 rounded-xl p-1.5 cursor-pointer"
                                />
                                <span className="text-sm font-bold tabular-nums" style={{ color }}>
                                    {color.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-ink mb-2">Criterios de evaluación</label>
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
                        className={btnDanger}
                    >
                        <Trash2 size={16} /> <span className="hidden sm:inline">Eliminar materia</span>
                    </button>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className={btnGhost}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving || !name.trim()}
                            className={`${btnPrimary} px-6`}
                        >
                            {saving ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
