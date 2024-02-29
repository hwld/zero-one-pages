import { ReactNode } from "react";

export const TaskCardButton: React.FC<{
  icon: ReactNode;
  onClick?: () => void;
}> = ({ icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex h-[25px] w-[25px] items-center justify-center rounded p-1 text-neutral-700 transition-all duration-200 hover:bg-neutral-200"
    >
      {icon}
    </button>
  );
};
