// components/AddSemesterCard.tsx
import { useState } from 'react';
import { Plus } from 'lucide-react';

const inputClass =
  "w-full min-w-0 border border-line rounded-lg px-3 py-2 text-sm bg-surface text-ink placeholder:text-ink-subtle " +
  "focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition";

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
        className="group w-full flex items-center gap-4 px-3 py-3 rounded-xl text-left text-ink-muted hover:bg-canvas hover:text-brand-700 transition-colors"
      >
        <span className="w-12 h-12 shrink-0 rounded-xl border-[1.5px] border-dashed border-line-strong flex items-center justify-center transition-colors group-hover:border-brand-400 group-hover:text-brand-600">
          <Plus size={20} />
        </span>
        <span className="font-semibold">Agregar semestre</span>
      </button>
    );
  }

  return (
    <div className="px-3 py-3 rounded-xl bg-brand-50/60 ring-1 ring-brand-100 flex flex-col gap-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setIsEditing(false)}
          className="px-4 py-1.5 rounded-lg text-sm font-medium text-ink-muted hover:bg-surface transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={!name.trim() || !period.trim()}
          className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Guardar semestre
        </button>
      </div>
    </div>
  );
};
