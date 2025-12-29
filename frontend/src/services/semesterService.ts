const API_URL = 'http://localhost:3000/api/semesters';

export interface Semester {
    id: number;
    name: string;
}

export async function getSemesters(tokke: string): Promise<Semester[]> {
    const res = await fetch(API_URL, {
        headers: {
            Authorization: `Bearer ${tokke}`
        }
    });

    if (!res.ok) {
        throw new Error('Error al obtener los semestres');
    }

    return res.json();
}

export async function createSemester(
    name: string,
    token: string
): Promise<Semester> {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name })
    });

    if (!res.ok){
        throw new Error('Error al crear el semestre');
    }
    return res.json();
}