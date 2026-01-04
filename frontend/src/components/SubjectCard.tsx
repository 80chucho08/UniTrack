import { Link } from 'react-router-dom';
import { type Subject } from '../services/subjectService';

interface Props {
    subject: Subject;
}

export function SubjectCard({ subject }: Props) {
    return (
        <Link 
            to={`/subject/${subject.id}`} 
            className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between border-l-4"
            style={{ borderLeftColor: subject.color || "#6366f1" }}
        >
            <div>
                <h2 className="font-bold text-xl text-gray-800 group-hover:text-indigo-600 transition-colors">
                    {subject.name}
                </h2>
                
                <div className="space-y-1 mt-2">
                    {subject.teacher_name && (
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            <span>👨‍🏫</span> {subject.teacher_name}
                        </p>
                    )}
                    
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end">
                <span className="text-indigo-500 text-sm font-semibold group-hover:underline">
                    Ver detalles →
                </span>
            </div>
        </Link>
    );
}