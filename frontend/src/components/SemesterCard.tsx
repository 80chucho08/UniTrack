// components/SemesterCard.tsx
import { ChevronRight, GraduationCap } from "lucide-react";

interface Props {
  name: string;
  onClick: () => void;
}

export const SemesterCard = ({ name, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="group w-full p-4 bg-white rounded-xl border border-gray-100 border-l-4 border-l-indigo-500 hover:border-indigo-200 hover:border-l-indigo-600 hover:shadow-md text-left transition-all duration-200 flex items-center gap-4 min-h-[96px]"
    >
      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-indigo-600 transition-colors">
        <GraduationCap size={22} className="text-indigo-600 group-hover:text-white transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors truncate">
          {name}
        </h3>
        <p className="text-sm text-gray-500">Ver materias</p>
      </div>
      <ChevronRight size={20} className="text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
    </button>
  );
};
