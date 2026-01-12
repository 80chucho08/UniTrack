// SubjectCard.tsx
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities"; // Importa esta utilidad

export default function SubjectCard({ subject }: any) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: subject.id });

  const style = {
    // CSS.Translate.toString es más robusto que escribir el template string a mano
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 999 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      // Cambiamos el color de fondo dinámico con style si Tailwind no lo reconoce
      className="p-3 rounded text-white cursor-grab touch-none" // touch-none evita scroll en móviles
      style={{ ...style, backgroundColor: subject.color }}
    >
      {subject.name}
    </div>
  );
}
