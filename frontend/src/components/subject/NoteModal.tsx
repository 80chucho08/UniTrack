import { useState } from "react";
import { Trash2 } from "lucide-react";
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
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <form
                onSubmit={handleSubmit}
                className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 z-10 flex flex-col max-h-[90vh]"
            >
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{note ? "Editar nota" : "Nueva nota"}</h2>
                    <p className="text-gray-500 text-sm">Guarda apuntes, resúmenes o ideas de la materia.</p>
                </div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">Título</label>
                <input
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    maxLength={150}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 mb-6 focus:border-indigo-500 focus:ring-0 transition-colors outline-none text-gray-800 placeholder:text-gray-400"
                    placeholder="Ej. Resumen unidad 2"
                />

                <label className="block text-sm font-semibold text-gray-700 mb-2">Contenido</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={12}
                    className="w-full flex-1 min-h-[180px] border-2 border-gray-100 rounded-xl px-4 py-3 mb-6 focus:border-indigo-500 focus:ring-0 transition-colors outline-none text-gray-800 placeholder:text-gray-400 resize-y"
                    placeholder="Escribe aquí tus apuntes..."
                />

                {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

                <div className="flex items-center justify-between gap-3">
                    {note && onDelete ? (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2.5 text-red-600 font-semibold hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                        >
                            <Trash2 size={16} /> Eliminar
                        </button>
                    ) : <span />}

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
                            disabled={saving || !title.trim()}
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
