// Reduce y comprime una imagen en el navegador para guardarla como data URL.
// La API acepta hasta ~4 MB, así que se baja la calidad hasta quedar por debajo.
const MAX_WIDTH = 1600;
const MAX_HEIGHT = 900;
const MAX_LENGTH = 3.5 * 1024 * 1024;

function loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('No se pudo leer la imagen'));
        };
        img.src = url;
    });
}

export async function compressImage(file: File): Promise<string> {
    if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen');
    }

    const img = await loadImage(file);
    const scale = Math.min(1, MAX_WIDTH / img.width, MAX_HEIGHT / img.height);
    const width = Math.round(img.width * scale);
    const height = Math.round(img.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No se pudo procesar la imagen');
    ctx.drawImage(img, 0, 0, width, height);

    let quality = 0.85;
    let dataUrl = canvas.toDataURL('image/jpeg', quality);
    while (dataUrl.length > MAX_LENGTH && quality > 0.4) {
        quality -= 0.15;
        dataUrl = canvas.toDataURL('image/jpeg', quality);
    }

    if (dataUrl.length > MAX_LENGTH) {
        throw new Error('La imagen es demasiado grande');
    }
    return dataUrl;
}
