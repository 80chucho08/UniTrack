export interface Materia {
    id: string;
    name: string;
    color: string;
}

export interface HorarioState {
    [celdaId: string]: Materia;
}