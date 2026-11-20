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
    // datos de la materia (null en tareas generales)
    subject_name: string | null;
    subject_color: string | null;
    semester_id: number | null;
    semester_name: string | null;
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

// Todas las tareas del usuario, de todas las materias
export function getAllTodos(token: string) {
    return apiRequest<Todo[]>('/todos', token, 'Error al obtener las tareas');
}

// Alta desde la página global; subject_id null = tarea sin materia
export function createGeneralTodo(
    data: TodoInput & { title: string; subject_id: number | null },
    token: string
) {
    return apiRequest<Todo>('/todos', token, 'Error al crear la tarea', { method: 'POST', body: data });
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
