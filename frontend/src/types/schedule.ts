export interface Materia {
    id: number;
    name: string;
    color: string;
}

export interface HorarioRegistro {
    id?: number;
    subject_id: number;
    subject_name: string;
    color: string;
    day: string;
    hour: number;
}