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
        if (!token) return;

        try {
            setLoading(true);

            await createSubject(
                semesterId,
                { name },
                token
            );

            onCreated();
            onClose();
        } catch (error) {
            console.error("Error al crear materia:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            {/* Modal */}
            <form
                onSubmit={handleSubmit}
                className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 z-10"
            >
                <h2 className="text-xl font-bold mb-4">
                    Nueva materia
                </h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Nombre de la materia
                    </label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                        placeholder="Ej. Matemáticas"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? "Guardando..." : "Crear"}
                    </button>
                </div>
            </form>
        </div>
    );
}
