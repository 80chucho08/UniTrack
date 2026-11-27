import { API_BASE_URL } from './http';

const API_URL = `${API_BASE_URL}/semesters`;

export interface Semester {
    id: number;
    name: string;
    period: string;
}

export async function getSemesters(
    token: string
): Promise<Semester[]> {

    const res = await fetch(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) {
        throw new Error('Error al obtener los semestres');
    }

    return res.json();
}

export interface CreateSemesterResponse {
    semesterId: number;
    message: string;
}

export async function createSemester(
    name: string,
    period: string,
    token: string
): Promise<CreateSemesterResponse> {

    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            name,
            period
        })
    });

    if (!res.ok) {
        throw new Error("Error al crear el semestre");
    }

    return res.json();
}