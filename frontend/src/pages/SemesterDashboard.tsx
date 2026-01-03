import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
    getSubjects,
    type Subject
} from '../services/subjectService';

function SemesterDashboard() {
    const { semesterId } = useParams();
    const { token } = useContext(AuthContext);

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fecthSubjects = async () => {
            try {
                if (!token || !semesterId) return;

                const data = await getSubjects(
                    Number(semesterId),
                    token
                );
                setSubjects(data);
            } catch (error) {
                console.error('Error al obtener materias: ', error);
            } finally {
                setLoading(false);
            }
        };

        fecthSubjects();
    }, [semesterId, token]);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-6">
                Materias del semestre
            </h1>

            {loading && <p>Cargando materias...</p>}

            {!loading && subjects.length === 0 && (
                <p>No hay materias registradas.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subjects.map(subject => (
                    <div
                        key={subject.id}
                        className="bg-white p-4 rounded-xl shadow"
                    >
                        <h2 className="font-semibold text-lg">
                            {subject.name}
                        </h2>

                        {subject.teacher_name && (
                            <p className="text-sm text-gray-500">
                                Prof: {subject.teacher_name}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SemesterDashboard;