import type { Materia } from "../types/schedule";

const API_URL = "http://localhost:3000/api/schedule";

export interface ScheduleItem {
    id?: number;
    subject_id: number;
    day: string;
    start_time: string;
    end_time: string;
    classroom: string;
    subject_name?: string;
    subject_color?: string;
}

// Obtener el horario guardado
export async function getFullSchedule(token: string): Promise<ScheduleItem[]> {
    const res = await fetch(`${API_URL}/grid`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al obtener el horario');
    return res.json();
}

// Guardar una materia en el grid
export async function saveToSchedule(data: ScheduleItem, token: string) {
    const res = await fetch(`${API_URL}/grid`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al guardar en el horario');
    return res.json();
}

// Eliminar del grid
export async function deleteFromSchedule(id: number, token: string) {
    const res = await fetch(`${API_URL}/grid/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al eliminar');
    return res.json();
}

export const getMateriasBySemester = async (
    semesterId: number
): Promise<Materia[]> => {

    const token = localStorage.getItem("token");

    const res = await fetch(
        `${API_URL}/subjects/${semesterId}`,
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!res.ok) {
        throw new Error("Error al obtener materias");
    }

    return res.json();
};
