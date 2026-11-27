import type { Materia } from "../types/schedule";
import { API_BASE_URL } from "./http";

const API_URL = `${API_BASE_URL}/schedule`;

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

// Fila devuelta por GET /api/schedule/grid (schedule unido con subjects)
export interface ScheduleGridRow {
    schedule_id: number;
    subject_id: number;
    day: string;
    start_time: string;
    end_time: string;
    classroom: string;
    subject_name: string;
    subject_color: string;
}

// Clase de una materia, devuelta por GET /api/schedule/subject/:subjectId
export interface SubjectClass {
    schedule_id: number;
    day: string;
    start_time: string; // HH:mm
    end_time: string;   // HH:mm
    classroom: string | null;
}

export async function getSubjectSchedule(subjectId: number, token: string): Promise<SubjectClass[]> {
    const res = await fetch(`${API_URL}/subject/${subjectId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al obtener el horario de la materia');
    return res.json();
}

// Obtener el horario guardado
export async function getFullSchedule(token: string): Promise<ScheduleGridRow[]> {
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
