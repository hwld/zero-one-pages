import clsx from "clsx";
import { CircleDashedIcon } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { ViewTask, MoveTaskInput, ViewColumn } from "../_mocks/view/api";
import { DRAG_TYPE } from "../consts";
import { ViewTaskMenuTrigger } from "./view-task-menu/trigger";
import { DropPreviewLine } from "./drop-preview-line";

type Props = {
  task: ViewTask;
  columns: ViewColumn[];
  previousOrder: number;
  nextOrder: number;
  acceptBottomDrop?: boolean;
  onMove: (input: MoveTaskInput) => void;
  onMoveToColumn: (input: { taskId: string; statusId: string }) => void;
  onMoveTop:
    | ((input: { taskId: string; statusId: string }) => void)
    | undefined;
  onMoveBottom:
    | ((input: { taskId: string; statusId: string }) => void)
    | undefined;
};

export const ViewTaskCard: React.FC<Props> = ({
  task,
  columns,
  previousOrder,
  nextOrder,
  acceptBottomDrop = false,
  onMove,
  onMoveToColumn,
  onMoveTop,
  onMoveBottom,
}) => {
  const [acceptDrop, setAcceptDrop] = useState<"none" | "top" | "bottom">(
    "none",
  );

  const handleMoveToColumn = (statusId: string) => {
    onMoveToColumn({ taskId: task.id, statusId });
  };

  const handleMoveTop = onMoveTop
    ? () => {
        onMoveTop?.({ taskId: task.id, statusId: task.status.id });
      }
    : undefined;

  const handleMoveBottom = onMoveBottom
    ? () => {
        onMoveBottom?.({ taskId: task.id, statusId: task.status.id });
      }
    : undefined;

  return (
    <div
      className={"relative py-[3px] before:w-full before:opacity-0"}
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes(DRAG_TYPE.task)) {
          e.preventDefault();
          e.stopPropagation();
          const rect = e.currentTarget.getBoundingClientRect();
          const midpoint = (rect.top + rect.bottom) / 2;
          setAcceptDrop(e.clientY <= midpoint ? "top" : "bottom");
        }
      }}
      onDragLeave={() => {
        setAcceptDrop("none");
      }}
      onDrop={(e) => {
        if (e.dataTransfer.types.includes(DRAG_TYPE.task)) {
          e.stopPropagation();

          const data = JSON.parse(e.dataTransfer.getData(DRAG_TYPE.task));
          const taskId = z.string().parse(data.taskId);

          const droppedOrder = acceptDrop === "top" ? previousOrder : nextOrder;
          const newOrder = (droppedOrder + task.order) / 2;

          onMove({
            taskId,
            statusId: task.status.id,
            newOrder,
          });

          setAcceptDrop("none");
        }
      }}
    >
      <DropPreviewLine
        className={clsx("w-full opacity-0", {
          "bottom-[calc(100%-2px)] opacity-100": acceptDrop === "top",
          "top-[calc(100%-2px)] opacity-100":
            acceptDrop === "bottom" || acceptBottomDrop,
        })}
      />
      <div
        className={
          "group flex cursor-grab flex-col gap-1 rounded-md border border-neutral-700 bg-neutral-800 p-2 transition-colors hover:border-neutral-600"
        }
        draggable
        onDragStart={(e) => {
          e.stopPropagation();
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData(
            DRAG_TYPE.task,
            JSON.stringify({ taskId: task.id }),
          );
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-neutral-400">
            <CircleDashedIcon size={16} strokeWidth={3} />
            <div className="text-xs">Draft</div>
            <ViewTaskMenuTrigger
              columns={columns}
              task={task}
              onMoveToColumn={handleMoveToColumn}
              onMoveTop={handleMoveTop}
              onMoveBottom={handleMoveBottom}
            />
          </div>
        </div>
        <div className="text-sm">{task.title}</div>
      </div>
    </div>
  );
};
