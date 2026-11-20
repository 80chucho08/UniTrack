// Iniciales para el avatar de una materia: "Base de Datos" -> "BD"
const STOP_WORDS = new Set(['de', 'del', 'la', 'las', 'el', 'los', 'y', 'e', 'en', 'a']);

// Color de texto legible (blanco u oscuro) sobre un fondo hex (#rgb o #rrggbb)
export function readableTextColor(hex: string): string {
    let value = hex.replace('#', '');
    if (value.length === 3) value = value.split('').map(c => c + c).join('');
    if (!/^[0-9a-f]{6}$/i.test(value)) return '#ffffff';

    const [r, g, b] = [0, 2, 4].map(i => {
        const c = parseInt(value.slice(i, i + 2), 16) / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // Umbral donde el texto oscuro contrasta más que el blanco
    return luminance > 0.4 ? '#1f2937' : '#ffffff';
}

export function subjectInitials(name: string): string {
    const words = name
        .replace(/[^\p{L}\p{N}\s]/gu, ' ')
        .split(/\s+/)
        .filter(w => w && !STOP_WORDS.has(w.toLowerCase()));

    if (words.length === 0) return name.slice(0, 2).toUpperCase();
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
}
