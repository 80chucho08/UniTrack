import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarRange, ImagePlus, Pencil, Trash2, User } from "lucide-react";
import type { SubjectDetail } from "../../services/subjectService";
import { compressImage } from "../../utils/image";

interface Props {
    subject: SubjectDetail;
    onImageChange: (image: string | null) => Promise<void>;
    onEdit: () => void;
}

// Botón translúcido sobre la portada
const glassButton =
    "flex items-center gap-2 h-9 px-3 rounded-xl text-sm font-semibold backdrop-blur-md transition-colors disabled:opacity-60 " +
    "bg-white/75 text-ink ring-1 ring-white/60 shadow-[0_4px_14px_rgb(0_0_0/0.12)] hover:bg-white";

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
        <header className="neu-raised rounded-[28px] p-2 mb-8">
            <div className="relative rounded-[22px] overflow-hidden min-h-[220px] md:min-h-[260px] flex flex-col justify-end">
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
                        style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}b3 55%, #1e2433 120%)` }}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e2433]/80 via-[#1e2433]/25 to-transparent" />

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
                        className={glassButton}
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
                            className={`${glassButton} text-red-600`}
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                    <button
                        onClick={onEdit}
                        className="flex items-center gap-2 h-9 px-3 rounded-xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 shadow-[0_4px_14px_rgb(0_0_0/0.2)] transition-colors"
                    >
                        <Pencil size={16} />
                        <span className="hidden sm:inline">Editar</span>
                    </button>
                </div>

                {/* Título */}
                <div className="relative p-6 md:p-8 text-white">
                    <Link
                        to={`/dashboard/semester/${subject.semester_id}`}
                        className="inline-flex items-center gap-1.5 mb-3 h-7 px-2.5 rounded-full text-xs font-semibold bg-white/15 ring-1 ring-white/25 backdrop-blur-md hover:bg-white/25 transition-colors"
                    >
                        <CalendarRange size={13} />
                        {subject.semester_name}
                        <span className="text-white/70 font-medium">{subject.semester_period}</span>
                    </Link>
                    <h1 className="text-3xl md:text-[2.75rem] md:leading-[1.08] font-extrabold tracking-tight drop-shadow-sm">
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
            </div>
        </header>
    );
}
