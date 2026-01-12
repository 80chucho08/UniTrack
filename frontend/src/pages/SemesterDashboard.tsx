import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getSubjects, type Subject } from '../services/subjectService';
import { SubjectCard } from '../components/SubjectCard';
import { DashboardHeader } from '../components/DashboardHeader';
import { CreateSubjectModal } from "../components/CreateSubjectModal";


function SemesterDashboard() {
    const { semesterId } = useParams();
    const { token } = useContext(AuthContext);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const fetchSubjects = async () => {
        try {
            if (!token || !semesterId) return;
            const data = await getSubjects(Number(semesterId), token);
            setSubjects(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, [semesterId, token]);

    return (
        <>
            <main className="p-6 lg:p-10 max-w-7xl w-full mx-auto">

                <DashboardHeader
                    title="Materias del Semestre"
                    subtitle={`Periodo académico activo`}
                >
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium">
                        <span className="text-xl">+</span> Materia
                    </button>
                </DashboardHeader>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-200 rounded-2xl" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subjects.map(subject => (
                            <SubjectCard key={subject.id} subject={subject} />
                        ))}
                    </div>
                )}

                {!loading && subjects.length === 0 && (
                    <p className="text-center text-gray-500 mt-10">No hay materias.</p>
                )}
            </main>

            {/* Renderizado condicional del Modal */}
            {isModalOpen && (
                <CreateSubjectModal
                    semesterId={Number(semesterId)}
                    onClose={() => setIsModalOpen(false)}
                    onCreated={fetchSubjects} // Refresca la lista
                />
            )}

        </>
    );
}
export default SemesterDashboard;