import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getSubjects, type Subject } from '../services/subjectService';
import { SubjectCard } from '../components/SubjectCard';
import { DashboardHeader } from '../components/DashboardHeader';

function SemesterDashboard() {
    const { semesterId } = useParams();
    const { token } = useContext(AuthContext);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                if (!token || !semesterId) return;
                const data = await getSubjects(Number(semesterId), token);
                setSubjects(data);
            } catch (error) { console.error(error); } 
            finally { setLoading(false); }
        };
        fetchSubjects();
    }, [semesterId, token]);

    return (
        <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
            <div className="max-w-7xl mx-auto">
                
                <DashboardHeader 
                    title="Materias del Semestre" 
                    subtitle={`Periodo académico activo`}
                >
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium">
                        + Materia
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
            </div>
        </div>
    );
}
export default SemesterDashboard;