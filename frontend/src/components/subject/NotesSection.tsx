import { useContext, useState } from "react";
import { Plus, Search, StickyNote } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { createNote, deleteNote, updateNote, type Note, type NoteInput } from "../../services/noteService";
import { formatDateTime } from "../../utils/date";
import { NoteModal } from "./NoteModal";
import { SectionTitle } from "./SectionTitle";
import { btnPrimary } from "../../utils/ui";

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
        <section className="neu-raised rounded-[24px] p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <SectionTitle
                    icon={<StickyNote size={19} />}
                    tone="text-emerald-600"
                    title="Notas"
                    detail={notes.length === 1 ? "1 apunte" : `${notes.length} apuntes`}
                />
                <div className="flex gap-3">
                    {notes.length > 0 && (
                        <div className="relative flex-1 sm:flex-none">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar en notas..."
                                className="neu-input w-full sm:w-48 h-10 rounded-xl pl-9 pr-3 text-sm"
                            />
                        </div>
                    )}
                    <button onClick={() => setEditing(null)} className={`${btnPrimary} shrink-0`}>
                        <Plus size={17} /> Nueva nota
                    </button>
                </div>
            </div>

            {notes.length === 0 ? (
                <button
                    onClick={() => setEditing(null)}
                    className="neu-inset w-full p-8 rounded-2xl text-ink-muted hover:text-brand-700 transition-colors"
                >
                    Aún no hay notas. Crea la primera para guardar tus apuntes.
                </button>
            ) : visibleNotes.length === 0 ? (
                <p className="text-center text-ink-muted py-6">Ninguna nota coincide con “{search}”.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {visibleNotes.map(note => (
                        <button
                            key={note.id}
                            onClick={() => setEditing(note)}
                            className="neu-raised-sm group text-left p-4 pt-5 rounded-2xl relative overflow-hidden transition active:shadow-neu-inset"
                        >
                            {/* Barra con el color de la materia */}
                            <span
                                aria-hidden
                                className="absolute top-0 left-4 right-4 h-1 rounded-b-full"
                                style={{ backgroundColor: color }}
                            />
                            <h3 className="font-semibold text-ink group-hover:text-brand-700 transition-colors truncate">
                                {note.title}
                            </h3>
                            <p className="mt-1 text-sm text-ink-muted whitespace-pre-line line-clamp-4 min-h-[1.25rem]">
                                {note.content || <span className="italic text-ink-subtle">Sin contenido</span>}
                            </p>
                            <p className="mt-3 text-xs text-ink-subtle">
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
