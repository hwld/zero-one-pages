import { IconCommand, IconPlus } from "@tabler/icons-react";
import { ComponentPropsWithoutRef } from "react";

export const AddTaskButton: React.FC<ComponentPropsWithoutRef<"button">> = ({
  onClick,
}) => {
  return (
    <button
      className="group flex h-8 w-fit shrink-0 items-center gap-2 rounded bg-gray-300 px-2 text-gray-700 transition-colors hover:bg-gray-400"
      onClick={onClick}
    >
      <div className="flex items-center">
        <IconPlus size={15} className="mb-[1px]" />
        <p className="text-xs">タスクを追加する</p>
      </div>
      <div className="flex items-center rounded bg-black/15 px-1 py-[2px] text-gray-700 transition-colors">
        <IconCommand size={15} />
        <p className="mt-[1px] text-[12px]">K</p>
      </div>
    </button>
  );
};
