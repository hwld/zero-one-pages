"use client";
import { TbMusic, TbX } from "react-icons/tb";

export const MusicFile: React.FC<{
  id: string;
  fileName: string;
  onDelete?: (id: string) => void;
}> = ({ id, fileName, onDelete }) => {
  const handleDelete = () => {
    onDelete?.(id);
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <div className="grid size-8 shrink-0 place-items-center rounded bg-neutral-100">
          <TbMusic className="text-[16px] text-neutral-800" />
        </div>
        <div className="text-sm">{fileName}</div>
      </div>
      {onDelete && (
        <button
          className="grid size-6 shrink-0 place-items-center rounded-full text-neutral-400 transition-colors hover:bg-white/15 hover:text-neutral-300"
          onClick={handleDelete}
        >
          <TbX />
        </button>
      )}
    </div>
  );
};
