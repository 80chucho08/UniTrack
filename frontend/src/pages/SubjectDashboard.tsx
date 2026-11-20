import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
    deleteSubject,
    getSubject,
    updateSubject,
    updateSubjectHeaderImage,
    type SubjectDetail,
    type SubjectUpdate
} from "../services/subjectService";
import { getNotes, type Note } from "../services/noteService";
import { getSubjectTodos, type Todo } from "../services/todoService";
import { getGrades, weightedAverage, type Grade } from "../services/gradeService";
import { getSubjectSchedule, type SubjectClass } from "../services/scheduleService";
import { daysUntil } from "../utils/date";
import { SubjectHeader } from "../components/subject/SubjectHeader";
import { SubjectStats } from "../components/subject/SubjectStats";
import { NotesSection } from "../components/subject/NotesSection";
import { TodosSection } from "../components/subject/TodosSection";
import { GradesSection } from "../components/subject/GradesSection";
import { SubjectInfoCard } from "../components/subject/SubjectInfoCard";
import { EditSubjectModal } from "../components/subject/EditSubjectModal";

function SubjectDashboard() {
    const { subjectId } = useParams();
    const id = Number(subjectId);
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [subject, setSubject] = useState<SubjectDetail | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [todos, setTodos] = useState<Todo[]>([]);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [classes, setClasses] = useState<SubjectClass[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditOpen, setIsEditOpen] = useState(false);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                if (!token || !id) return;
                const [subjectData, notesData, todosData, gradesData, classesData] = await Promise.all([
                    getSubject(id, token),
                    getNotes(id, token),
                    getSubjectTodos(id, token),
                    getGrades(id, token),
                    getSubjectSchedule(id, token)
                ]);
                setSubject(subjectData);
                setNotes(notesData);
                setTodos(todosData);
                setGrades(gradesData);
                setClasses(classesData);
                setError("");
            } catch (err) {
                console.error("Error al cargar la materia", err);
                setError(err instanceof Error ? err.message : "Error al cargar la materia");
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [id, token]);

    const handleImageChange = async (image: string | null) => {
        if (!token || !subject) return;
        const res = await updateSubjectHeaderImage(subject.id, image, token);
        setSubject(prev => (prev ? { ...prev, header_image: res.header_image } : prev));
    };

    const handleSave = async (data: SubjectUpdate) => {
        if (!token || !subject) return;
        const updated = await updateSubject(subject.id, data, token);
        setSubject(updated);
    };

    const handleDelete = async () => {
        if (!token || !subject) return;
        await deleteSubject(subject.id, token);
        navigate(`/dashboard/semester/${subject.semester_id}`, { replace: true });
    };

    if (loading) {
        return (
            <main className="p-6 lg:p-10 max-w-7xl w-full mx-auto animate-pulse">
                <div className="h-64 bg-gray-200 rounded-3xl mb-8" />
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl" />)}
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2 h-80 bg-gray-200 rounded-2xl" />
                    <div className="h-80 bg-gray-200 rounded-2xl" />
                </div>
            </main>
        );
    }

    if (!subject) {
        return (
            <main className="p-6 lg:p-10 max-w-7xl w-full mx-auto text-center">
                <p className="text-gray-500 mt-10">{error || "Materia no encontrada."}</p>
                <Link to="/dashboard" className="inline-block mt-4 text-indigo-500 font-semibold hover:underline">
                    ← Volver a mis semestres
                </Link>
            </main>
        );
    }

    const color = subject.color || "#6366f1";
    const pendingTodos = todos.filter(t => t.status === "pending");
    const overdueTodos = pendingTodos.filter(t => t.due_date && daysUntil(t.due_date) < 0).length;

    return (
        <>
            <main className="p-6 lg:p-10 max-w-7xl w-full mx-auto">
                <SubjectHeader
                    subject={subject}
                    onImageChange={handleImageChange}
                    onEdit={() => setIsEditOpen(true)}
                />

                <SubjectStats
                    average={weightedAverage(grades)}
                    evaluatedWeight={grades.reduce((sum, g) => sum + g.weight, 0)}
                    pendingTodos={pendingTodos.length}
                    overdueTodos={overdueTodos}
                    notesCount={notes.length}
                    classesPerWeek={classes.length}
                />

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2 flex flex-col gap-6">
                        <NotesSection subjectId={subject.id} color={color} notes={notes} setNotes={setNotes} />
                        <GradesSection subjectId={subject.id} color={color} grades={grades} setGrades={setGrades} />
                    </div>
                    <div className="flex flex-col gap-6">
                        <TodosSection subjectId={subject.id} todos={todos} setTodos={setTodos} />
                        <SubjectInfoCard subject={subject} classes={classes} onEdit={() => setIsEditOpen(true)} />
                    </div>
                </div>
            </main>

            {isEditOpen && (
                <EditSubjectModal
                    subject={subject}
                    onClose={() => setIsEditOpen(false)}
                    onSave={handleSave}
                    onDelete={handleDelete}
                />
            )}
        </>
    );
}

export default SubjectDashboard;
