import { PiPlusCircleFill } from "@react-icons/all-files/pi/PiPlusCircleFill";
import { forwardRef } from "react";

export const TaskCreateButton: React.FC = forwardRef<HTMLButtonElement>(
  function TaskCreateButton(props, ref) {
    return (
      <button
        ref={ref}
        {...props}
        className="flex h-9 w-full items-center gap-1 rounded p-2 text-rose-700 transition-colors hover:bg-black/5"
      >
        <div className="grid size-7 place-items-center">
          <PiPlusCircleFill className="size-7" />
        </div>
        <div className="font-bold">タスクを作成</div>
      </button>
    );
  },
);
