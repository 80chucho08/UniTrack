// Número de semestre al inicio del nombre: "2do Semestre" -> 2, "10mo" -> 10.
// Devuelve null si el nombre no empieza con un número.
export function semesterNumber(name: string): number | null {
    const match = name.trim().match(/^(\d+)/);
    return match ? Number(match[1]) : null;
}

// Orden de presentación: primero los numerados (ascendente), luego el resto
// en su orden original.
export function compareSemesters(a: { name: string }, b: { name: string }): number {
    const na = semesterNumber(a.name);
    const nb = semesterNumber(b.name);
    if (na !== null && nb !== null) return na - nb;
    if (na !== null) return -1;
    if (nb !== null) return 1;
    return 0;
}
