import { apiRequest, API_BASE_URL as API_URL } from './http';

export interface Subject {
    id: number;
    name: string;
    semester_id: number;
    user_id: number;
    teacher_name?: string | null;
    teacher_email?: string | null;
    credits?: number | null;
    color?: string | null;
    evaluation_criteria?: string | null;
}

// Detalle que devuelve GET /api/subjects/:subjectId
export interface SubjectDetail extends Subject {
    header_image: string | null;
    created_at: string;
    semester_name: string;
    semester_period: string;
}

export interface SubjectUpdate {
    name?: string;
    teacher_name?: string | null;
    teacher_email?: string | null;
    credits?: number | null;
    color?: string | null;
    evaluation_criteria?: string | null;
}

export interface CreateSubjectResponse {
    subjectId: number;
    message: string;
}

export async function getSubjects(
    semesterId: number,
    token: string
): Promise<Subject[]> {
    const res = await fetch(
        `${API_URL}/semesters/${semesterId}/subjects`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if(!res.ok) {
        throw new Error('Error al obtener las materios');
    }
    return res.json();
}

export async function createSubject(
    semesterId: number,
    data: {
        name: string;
        teacher_name?: string;
        teacher_email?: string;
        credits?: number;
        color?: string;
        evaluation_criteria?: string;
    },
    token: string
): Promise<CreateSubjectResponse> {
    const res = await fetch(
        `${API_URL}/semesters/${semesterId}/subjects`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }
    );
    if (!res.ok){
        throw new Error("Error al crear la materia");
    }
    return res.json();
}

// Resumen de cada materia del usuario, para selectores
export interface SubjectOption {
    id: number;
    name: string;
    color: string | null;
    semester_id: number;
    semester_name: string;
}

export function getAllSubjects(token: string) {
    return apiRequest<SubjectOption[]>('/subjects', token, 'Error al obtener las materias');
}

export function getSubject(subjectId: number, token: string) {
    return apiRequest<SubjectDetail>(
        `/subjects/${subjectId}`, token, 'Error al obtener la materia'
    );
}

export function updateSubject(subjectId: number, data: SubjectUpdate, token: string) {
    return apiRequest<SubjectDetail>(
        `/subjects/${subjectId}`, token, 'Error al actualizar la materia',
        { method: 'PUT', body: data }
    );
}

// headerImage: data URL, URL http(s) o null para quitarla
export function updateSubjectHeaderImage(subjectId: number, headerImage: string | null, token: string) {
    return apiRequest<{ message: string; header_image: string | null }>(
        `/subjects/${subjectId}/header-image`, token, 'Error al actualizar la imagen',
        { method: 'PUT', body: { header_image: headerImage } }
    );
}

export function deleteSubject(subjectId: number, token: string) {
    return apiRequest<{ message: string }>(
        `/subjects/${subjectId}`, token, 'Error al eliminar la materia',
        { method: 'DELETE' }
    );
}
