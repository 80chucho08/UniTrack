import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { createSubject } from "../services/subjectService";

interface Props {
    semesterId: number;
    onClose: () => void;
    onCreated: () => void;
}

export function CreateSubjectModal({ semesterId, onClose, onCreated }: Props) {
    const { token } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !name.trim()) return;

        try {
            setLoading(true);
            await createSubject(semesterId, { name }, token);
            onCreated();
            onClose();
        } catch (error) {
            console.error("Error al crear materia:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay con desenfoque (backdrop-blur) para mayor elegancia */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal con animación de escala */}
            <form
                onSubmit={handleSubmit}
                className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 z-10 animate-in fade-in zoom-in duration-200"
            >
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Nueva materia</h2>
                    <p className="text-gray-500 text-sm">Organiza tu estudio añadiendo un nuevo curso.</p>
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre de la materia
                    </label>
                    <input
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-0 transition-colors outline-none text-gray-800 placeholder:text-gray-400"
                        placeholder="Ej. Arquitectura de Software"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 text-gray-500 font-semibold hover:bg-gray-50 rounded-xl transition-colors"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        disabled={loading || !name.trim()}
                        className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 transition-all active:scale-95"
                    >
                        {loading ? "Guardando..." : "Crear Materia"}
                    </button>
                </div>
            </form>
        </div>
    );
}