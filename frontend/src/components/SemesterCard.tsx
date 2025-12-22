// components/SemesterCard.tsx
interface Props {
  name: string;
  onClick: () => void;
}

export const SemesterCard = ({ name, onClick }: Props) => {
  return (
    <div 
      onClick={onClick}
      className="group p-6 bg-white rounded-xl border-2 border-transparent hover:border-blue-500 shadow-md hover:shadow-lg cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[150px]"
    >
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-600 transition-colors">
        <span className="text-blue-600 group-hover:text-white font-bold text-xl">#</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
    </div>
  );
};