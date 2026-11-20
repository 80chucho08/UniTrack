import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ImagePlus, Pencil, Trash2, User } from "lucide-react";
import type { SubjectDetail } from "../../services/subjectService";
import { compressImage } from "../../utils/image";

interface Props {
    subject: SubjectDetail;
    onImageChange: (image: string | null) => Promise<void>;
    onEdit: () => void;
}

export function SubjectHeader({ subject, onImageChange, onEdit }: Props) {
    const fileInput = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const color = subject.color || "#6366f1";

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = ""; // permite volver a elegir el mismo archivo
        if (!file) return;

        try {
            setError("");
            setUploading(true);
            const dataUrl = await compressImage(file);
            await onImageChange(dataUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo subir la imagen");
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = async () => {
        try {
            setError("");
            setUploading(true);
            await onImageChange(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo quitar la imagen");
        } finally {
            setUploading(false);
        }
    };

    return (
        <header className="relative mb-8 rounded-3xl overflow-hidden shadow-sm border border-gray-100 min-h-[220px] md:min-h-[260px] flex flex-col justify-end">
            {/* Portada: imagen o degradado con el color de la materia */}
            {subject.header_image ? (
                <img
                    src={subject.header_image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : (
                <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}99 55%, #1e293b 100%)` }}
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />

            {/* Acciones */}
            <div className="absolute top-4 right-4 flex gap-2">
                <input
                    ref={fileInput}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFile}
                />
                <button
                    onClick={() => fileInput.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 bg-white/90 hover:bg-white text-gray-700 text-sm font-semibold px-3 py-2 rounded-xl shadow-sm backdrop-blur transition-colors disabled:opacity-60"
                >
                    <ImagePlus size={16} />
                    <span className="hidden sm:inline">
                        {uploading ? "Guardando..." : subject.header_image ? "Cambiar portada" : "Agregar portada"}
                    </span>
                </button>
                {subject.header_image && (
                    <button
                        onClick={handleRemove}
                        disabled={uploading}
                        title="Quitar portada"
                        className="bg-white/90 hover:bg-white text-red-600 px-3 py-2 rounded-xl shadow-sm backdrop-blur transition-colors disabled:opacity-60"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
                <button
                    onClick={onEdit}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-3 py-2 rounded-xl shadow-sm transition-colors"
                >
                    <Pencil size={16} />
                    <span className="hidden sm:inline">Editar</span>
                </button>
            </div>

            {/* Título */}
            <div className="relative p-6 md:p-8 text-white">
                <Link
                    to={`/dashboard/semester/${subject.semester_id}`}
                    className="inline-block text-xs font-semibold uppercase tracking-wider text-white/80 hover:text-white mb-2"
                >
                    {subject.semester_name} · {subject.semester_period}
                </Link>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-sm">
                    {subject.name}
                </h1>
                {subject.teacher_name && (
                    <p className="mt-2 flex items-center gap-2 text-white/90">
                        <User size={16} />
                        {subject.teacher_name}
                    </p>
                )}
                {error && (
                    <p className="mt-3 inline-block text-sm bg-red-500/90 px-3 py-1 rounded-lg">{error}</p>
                )}
            </div>
        </header>
    );
}
