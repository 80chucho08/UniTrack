// components/SemesterCard.tsx
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { semesterNumber } from "../utils/semester";

interface Props {
  name: string;
  onClick: () => void;
  variant?: "list" | "grid";
}

// Semestre con el numeral tomado del propio nombre ("2do Semestre" -> 2).
// "list": fila compacta; "grid": tarjeta con el numeral como protagonista.
export const SemesterCard = ({ name, onClick, variant = "list" }: Props) => {
  const number = semesterNumber(name);
  const mark = number !== null ? String(number) : name.trim().charAt(0).toUpperCase();

  if (variant === "grid") {
    return (
      <button
        onClick={onClick}
        className="group relative w-full min-h-[128px] sm:min-h-[148px] p-4 sm:p-5 rounded-xl border border-line bg-surface text-left flex flex-col justify-between
          transition-colors hover:border-brand-300 hover:bg-brand-50/40"
      >
        <span
          className="font-extrabold tabular-nums tracking-tight leading-none text-[2.75rem] text-brand-300 transition-colors group-hover:text-brand-600"
        >
          {mark}
        </span>
        <span>
          <span className="block font-semibold text-ink truncate">{name}</span>
          <span className="block text-sm text-ink-subtle">Ver materias</span>
        </span>
        <ArrowUpRight
          size={18}
          className="absolute top-4 right-4 text-ink-subtle/50 transition-colors group-hover:text-brand-600"
        />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="group w-full flex items-center gap-4 px-3 py-3 rounded-xl text-left transition-colors hover:bg-canvas"
    >
      <span
        className="w-12 h-12 shrink-0 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center
          font-extrabold tabular-nums tracking-tight transition-colors group-hover:bg-brand-600 group-hover:text-white"
      >
        <span className={number !== null ? "text-2xl leading-none" : "text-lg leading-none"}>{mark}</span>
      </span>

      <span className="flex-1 min-w-0">
        <span className="block font-semibold text-ink truncate">{name}</span>
        <span className="block text-sm text-ink-subtle">Ver materias</span>
      </span>

      <ChevronRight
        size={18}
        className="shrink-0 text-ink-subtle/60 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600"
      />
    </button>
  );
};
