import type { Materia } from "../types/schedule";

const API_URL = "http://localhost:3000/api";

export const getMateriasBySemester = async (
    semesterId: number
): Promise<Materia[]> => {

    const token = localStorage.getItem("token");

    const res = await fetch(
        `${API_URL}/schedule/${semesterId}/schedule`,
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
