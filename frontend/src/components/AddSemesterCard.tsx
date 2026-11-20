// components/AddSemesterCard.tsx
import { useState } from 'react';
import { Plus } from 'lucide-react';

const inputClass =
  "w-full border-2 border-gray-100 rounded-lg px-3 py-2 text-sm bg-white focus:border-indigo-500 outline-none transition-colors text-gray-800 placeholder:text-gray-400";

export const AddSemesterCard = ({ onAdd }: { onAdd: (name: string, period: string) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [period, setPeriod] = useState("");

  const handleSubmit = () => {
    if (name.trim() && period.trim()) {
      onAdd(name, period);
      setName("");
      setPeriod("");
      setIsEditing(false);
    }
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="group p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/40 flex items-center justify-center gap-3 min-h-[96px] transition-all"
      >
        <span className="w-10 h-10 rounded-xl bg-gray-100 text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
          <Plus size={20} />
        </span>
        <span className="text-gray-500 font-medium group-hover:text-indigo-600 transition-colors">Agregar Semestre</span>
      </button>
    );
  }

  return (
    <div className="p-4 border-2 border-indigo-200 rounded-xl bg-indigo-50/40 flex flex-col gap-2 min-h-[96px]">
      <input
        autoFocus
        className={inputClass}
        placeholder="Ej: 3er Semestre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
      />

      <input
        className={inputClass}
        placeholder="Ej: Agosto 2026 - Enero 2027"
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
      />
      <div className="flex gap-2">
        <button onClick={handleSubmit} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 rounded-lg text-sm font-medium transition-colors">Guardar</button>
        <button onClick={() => setIsEditing(false)} className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 py-1.5 rounded-lg text-sm font-medium transition-colors">Cancelar</button>
      </div>
    </div>
  );
};
