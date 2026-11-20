import { apiRequest } from './http';

export interface Note {
    id: number;
    subject_id: number;
    title: string;
    content: string | null;
    created_at: string;
    updated_at: string;
}

export interface NoteInput {
    title: string;
    content: string;
}

export function getNotes(subjectId: number, token: string) {
    return apiRequest<Note[]>(
        `/subjects/${subjectId}/notes`, token, 'Error al obtener las notas'
    );
}

export function createNote(subjectId: number, data: NoteInput, token: string) {
    return apiRequest<Note>(
        `/subjects/${subjectId}/notes`, token, 'Error al crear la nota',
        { method: 'POST', body: data }
    );
}

export function updateNote(noteId: number, data: Partial<NoteInput>, token: string) {
    return apiRequest<Note>(
        `/notes/${noteId}`, token, 'Error al actualizar la nota',
        { method: 'PUT', body: data }
    );
}

export function deleteNote(noteId: number, token: string) {
    return apiRequest<{ message: string }>(
        `/notes/${noteId}`, token, 'Error al eliminar la nota',
        { method: 'DELETE' }
    );
}
