// URL de la API según el entorno. Vite la inyecta en tiempo de build desde
// VITE_API_URL (ver frontend/.env.example); en desarrollo cae a localhost.
export const API_BASE_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

// fetch autenticado con JSON. Si la API responde con error, lanza su { message }
// (o el mensaje por defecto si no hay uno).
export async function apiRequest<T>(
    path: string,
    token: string,
    fallbackError: string,
    options: { method?: string; body?: unknown } = {}
): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        method: options.method ?? 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: options.body === undefined ? undefined : JSON.stringify(options.body)
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        throw new Error(data?.message ?? fallbackError);
    }

    return data as T;
}
