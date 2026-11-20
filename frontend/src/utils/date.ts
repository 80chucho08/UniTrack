// Fechas "YYYY-MM-DD" de la API interpretadas en hora local (sin desfase UTC)
export function parseLocalDate(value: string): Date {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
}

export function formatShortDate(value: string): string {
    return parseLocalDate(value).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}

// Días entre hoy y la fecha (negativo si ya pasó)
export function daysUntil(value: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.round((parseLocalDate(value).getTime() - today.getTime()) / 86_400_000);
}

// Fecha y hora de un timestamp ISO (created_at / updated_at)
export function formatDateTime(value: string): string {
    return new Date(value).toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export const DAY_LABELS: Record<string, string> = {
    Monday: 'Lunes',
    Tuesday: 'Martes',
    Wednesday: 'Miércoles',
    Thursday: 'Jueves',
    Friday: 'Viernes',
    Saturday: 'Sábado'
};
