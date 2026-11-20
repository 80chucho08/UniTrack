import { useContext, useState } from "react";
import { Plus, Search, StickyNote } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { createNote, deleteNote, updateNote, type Note, type NoteInput } from "../../services/noteService";
import { formatDateTime } from "../../utils/date";
import { NoteModal } from "./NoteModal";

interface Props {
    subjectId: number;
    color: string;
    notes: Note[];
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

// undefined = modal cerrado, null = nota nueva
type Editing = Note | null | undefined;

export function NotesSection({ subjectId, color, notes, setNotes }: Props) {
    const { token } = useContext(AuthContext);
    const [editing, setEditing] = useState<Editing>(undefined);
    const [search, setSearch] = useState("");

    const query = search.trim().toLowerCase();
    const visibleNotes = query
        ? notes.filter(n =>
            n.title.toLowerCase().includes(query) ||
            (n.content ?? "").toLowerCase().includes(query))
        : notes;

    const handleSave = async (data: NoteInput) => {
        if (!token) return;
        if (editing) {
            const updated = await updateNote(editing.id, data, token);
            // la nota editada pasa al inicio (orden por última modificación)
            setNotes(prev => [updated, ...prev.filter(n => n.id !== updated.id)]);
        } else {
            const created = await createNote(subjectId, data, token);
            setNotes(prev => [created, ...prev]);
        }
    };

    const handleDelete = async () => {
        if (!token || !editing) return;
        await deleteNote(editing.id, token);
        setNotes(prev => prev.filter(n => n.id !== editing.id));
    };

    return (
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2">
                    <StickyNote size={20} className="text-emerald-600" />
                    <h2 className="text-xl font-bold text-gray-800">Notas</h2>
                    <span className="text-sm text-gray-400">({notes.length})</span>
                </div>
                <div className="flex gap-2">
                    {notes.length > 0 && (
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar..."
                                className="w-full sm:w-44 border-2 border-gray-100 rounded-xl pl-9 pr-3 py-2 text-sm focus:border-indigo-500 outline-none transition-colors"
                            />
                        </div>
                    )}
                    <button
                        onClick={() => setEditing(null)}
                        className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shrink-0"
                    >
                        <Plus size={18} /> Nota
                    </button>
                </div>
            </div>

            {notes.length === 0 ? (
                <button
                    onClick={() => setEditing(null)}
                    className="w-full p-8 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors"
                >
                    Aún no hay notas. Crea la primera para guardar tus apuntes.
                </button>
            ) : visibleNotes.length === 0 ? (
                <p className="text-center text-gray-500 py-6">Ninguna nota coincide con “{search}”.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {visibleNotes.map(note => (
                        <button
                            key={note.id}
                            onClick={() => setEditing(note)}
                            className="group text-left p-4 rounded-xl border border-gray-100 border-t-4 bg-gray-50/50 hover:bg-white hover:shadow-md hover:border-indigo-200 transition-all"
                            style={{ borderTopColor: color }}
                        >
                            <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors truncate">
                                {note.title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600 whitespace-pre-line line-clamp-4 min-h-[1.25rem]">
                                {note.content || <span className="italic text-gray-400">Sin contenido</span>}
                            </p>
                            <p className="mt-3 text-xs text-gray-400">
                                Editada {formatDateTime(note.updated_at)}
                            </p>
                        </button>
                    ))}
                </div>
            )}

            {editing !== undefined && (
                <NoteModal
                    note={editing}
                    onClose={() => setEditing(undefined)}
                    onSave={handleSave}
                    onDelete={editing ? handleDelete : undefined}
                />
            )}
        </section>
    );
}
