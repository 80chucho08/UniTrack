const API_URL = 'http://localhost:3000/api/semesters';

export interface Subject {
    id: number;
    name: string;
    semesterId: number;
    user_id: number;
    teacher_name?: string | null;
    teacher_email?: string | null;
    cerdits?: number | null;
    color?: string | null;
    evaluation_percentage?: number | null;
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
        evaluation_creiteria?: string;
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