import { apiRequest } from './http';

export interface Grade {
    id: number;
    subject_id: number;
    name: string;
    value: number;  // 0 - 100
    weight: number; // porcentaje 0 - 100
    date: string | null; // YYYY-MM-DD
    created_at: string;
}

export interface GradeInput {
    name: string;
    value: number;
    weight: number;
    date?: string | null;
}

export function getGrades(subjectId: number, token: string) {
    return apiRequest<Grade[]>(
        `/subjects/${subjectId}/grades`, token, 'Error al obtener las calificaciones'
    );
}

export function createGrade(subjectId: number, data: GradeInput, token: string) {
    return apiRequest<Grade>(
        `/subjects/${subjectId}/grades`, token, 'Error al registrar la calificación',
        { method: 'POST', body: data }
    );
}

export function deleteGrade(gradeId: number, token: string) {
    return apiRequest<{ message: string }>(
        `/grades/${gradeId}`, token, 'Error al eliminar la calificación',
        { method: 'DELETE' }
    );
}

// Promedio ponderado sobre el porcentaje ya evaluado (null si no hay pesos)
export function weightedAverage(grades: Grade[]): number | null {
    const totalWeight = grades.reduce((sum, g) => sum + g.weight, 0);
    if (totalWeight === 0) return null;
    return grades.reduce((sum, g) => sum + g.value * g.weight, 0) / totalWeight;
}
