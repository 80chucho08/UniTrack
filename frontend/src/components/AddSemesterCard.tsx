// components/AddSemesterCard.tsx
import { useState } from 'react';

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
        className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 flex flex-col items-center justify-center min-h-[150px] transition-all"
      >
        <span className="text-3xl text-gray-400">+</span>
        <span className="text-gray-500 font-medium">Agregar Semestre</span>
      </button>
    );
  }

  return (
    <div className="p-6 border-2 border-blue-400 rounded-xl bg-blue-50 flex flex-col gap-2 min-h-[150px]">
      <input 
        autoFocus
        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Ej: 3er Semestre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
      />

      <input
        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Ej: Agosto 2026 - Enero 2027"
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
      />
      <div className="flex gap-2">
        <button onClick={handleSubmit} className="flex-1 bg-blue-600 text-white py-1 rounded-md text-sm">Guardar</button>
        <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-200 py-1 rounded-md text-sm">Cancelar</button>
      </div>
    </div>
  );
};