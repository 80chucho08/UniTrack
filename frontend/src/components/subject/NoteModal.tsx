import { useState } from "react";
import { Trash2 } from "lucide-react";
import { btnDanger, btnGhost, btnPrimary } from "../../utils/ui";
import type { Note, NoteInput } from "../../services/noteService";

interface Props {
    note: Note | null; // null = nota nueva
    onClose: () => void;
    onSave: (data: NoteInput) => Promise<void>;
    onDelete?: () => Promise<void>;
}

export function NoteModal({ note, onClose, onSave, onDelete }: Props) {
    const [title, setTitle] = useState(note?.title ?? "");
    const [content, setContent] = useState(note?.content ?? "");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            setSaving(true);
            setError("");
            await onSave({ title: title.trim(), content });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo guardar la nota");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!onDelete || !window.confirm("¿Eliminar esta nota? No se puede deshacer.")) return;
        try {
            setSaving(true);
            await onDelete();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo eliminar la nota");
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
                className="relative bg-canvas border border-white/70 rounded-[28px] shadow-[0_24px_60px_-12px_rgb(30_36_51/0.35)] w-full max-w-2xl p-8 z-10 flex flex-col max-h-[90vh]"
            >
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-ink">{note ? "Editar nota" : "Nueva nota"}</h2>
                    <p className="text-ink-muted text-sm">Guarda apuntes, resúmenes o ideas de la materia.</p>
                </div>

                <label className="block text-sm font-semibold text-ink mb-2">Título</label>
                <input
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    maxLength={150}
                    className="w-full neu-input rounded-xl px-4 py-3 mb-6"
                    placeholder="Ej. Resumen unidad 2"
                />

                <label className="block text-sm font-semibold text-ink mb-2">Contenido</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={12}
                    className="w-full flex-1 min-h-[180px] neu-input rounded-xl px-4 py-3 mb-6 resize-y"
                    placeholder="Escribe aquí tus apuntes..."
                />

                {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

                <div className="flex items-center justify-between gap-3">
                    {note && onDelete ? (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={saving}
                            className={btnDanger}
                        >
                            <Trash2 size={16} /> Eliminar
                        </button>
                    ) : <span />}

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
                            disabled={saving || !title.trim()}
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
