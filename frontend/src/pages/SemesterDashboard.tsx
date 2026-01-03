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

    const [Subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fecthSubjects = async () => {
            try {
                if(!token || !semesterId) return;

                const data = await getSubjects(
                    Number(semesterId),
                    token
                );
                setSubjects(data);
            }catch(error){
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
                Materias del Semestre
            </h1>
        </div>
    );
}