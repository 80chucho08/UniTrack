import { useDroppable } from "@dnd-kit/core";

export default function ScheduleSlot({ id, subject }: any) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`h-16 border rounded flex items-center justify-center text-sm
        ${isOver ? "bg-blue-100" : "bg-white"}
      `}
    >
      {subject && (
        <span className="font-semibold">{subject.name}</span>
      )}
    </div>
  );
}
