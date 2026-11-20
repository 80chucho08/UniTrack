import { apiRequest } from './http';

export type TodoStatus = 'pending' | 'completed';

export interface Todo {
    id: number;
    subject_id: number | null;
    title: string;
    description: string | null;
    due_date: string | null; // YYYY-MM-DD
    status: TodoStatus;
    created_at: string;
}

export interface TodoInput {
    title?: string;
    description?: string | null;
    due_date?: string | null;
    status?: TodoStatus;
}

export function getSubjectTodos(subjectId: number, token: string) {
    return apiRequest<Todo[]>(
        `/subjects/${subjectId}/todos`, token, 'Error al obtener las tareas'
    );
}

export function createTodo(subjectId: number, data: TodoInput & { title: string }, token: string) {
    return apiRequest<Todo>(
        `/subjects/${subjectId}/todos`, token, 'Error al crear la tarea',
        { method: 'POST', body: data }
    );
}

export function updateTodo(todoId: number, data: TodoInput, token: string) {
    return apiRequest<Todo>(
        `/todos/${todoId}`, token, 'Error al actualizar la tarea',
        { method: 'PUT', body: data }
    );
}

export function deleteTodo(todoId: number, token: string) {
    return apiRequest<{ message: string }>(
        `/todos/${todoId}`, token, 'Error al eliminar la tarea',
        { method: 'DELETE' }
    );
}
