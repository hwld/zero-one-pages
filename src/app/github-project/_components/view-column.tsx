import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { MoreHorizontalIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import {
  MoveTaskInput,
  ViewColumn as ViewColumnData,
} from "../_mocks/view/api";
import { useMoveTask } from "../_queries/use-move-task";
import { CountBadge } from "./count-badge";
import { TaskStatusIcon } from "./task-status-icon";
import { ViewColumnMenuTrigger } from "./view-column-menu-trigger";
import { ViewTaskCard } from "./view-task-card";
import { DRAG_TYPE, VIEW_ID } from "../consts";
import { DropPreviewLine } from "./drop-preview-line";
import { useMoveColumn } from "../_queries/use-move-column";

type Props = {
  allColumns: ViewColumnData[];
  column: ViewColumnData;
  onClickAddItem: () => void;
  onMoveToColumn: (input: { taskId: string; statusId: string }) => void;
  previousOrder: number;
  nextOrder: number;
  acceptBottomDrop?: boolean;
};

export const ViewColumn: React.FC<Props> = ({
  allColumns,
  column,
  onClickAddItem,
  onMoveToColumn,
  previousOrder,
  nextOrder,
  acceptBottomDrop = false,
}) => {
  const [acceptCardDrop, setAcceptCardDrop] = useState(false);

  const moveTaskMutation = useMoveTask();

  const handleMoveTask = (data: MoveTaskInput) => {
    moveTaskMutation.mutate({ viewId: VIEW_ID, ...data });
  };
  const handleMoveTaskTop = (input: { taskId: string; statusId: string }) => {
    const topItem = column.tasks.at(0);
    moveTaskMutation.mutate({
      viewId: VIEW_ID,
      taskId: input.taskId,
      statusId: input.statusId,
      newOrder: topItem ? topItem.order / 2 : 1,
    });
  };

  const handleMoveTaskBottom = (input: {
    taskId: string;
    statusId: string;
  }) => {
    const bottomItem = column.tasks.at(-1);

    moveTaskMutation.mutate({
      viewId: VIEW_ID,
      taskId: input.taskId,
      statusId: input.statusId,
      newOrder: bottomItem ? bottomItem.order + 0.5 : 1,
    });
  };

  const [acceptColumnDrop, setAcceptColumnDrop] = useState<
    "none" | "left" | "right"
  >("none");
  const moveColumnMutation = useMoveColumn();

  return (
    <div
      className="relative h-full px-[3px]"
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes(DRAG_TYPE.column)) {
          e.preventDefault();
          e.stopPropagation();
          const rect = e.currentTarget.getBoundingClientRect();
          const midpoint = (rect.left + rect.right) / 2;
          setAcceptColumnDrop(e.clientX <= midpoint ? "left" : "right");
        }
      }}
      onDragLeave={() => {
        setAcceptColumnDrop("none");
      }}
      onDrop={(e) => {
        if (e.dataTransfer.types.includes(DRAG_TYPE.column)) {
          e.stopPropagation();

          const data = JSON.parse(e.dataTransfer.getData(DRAG_TYPE.column));
          const statusId = z.string().parse(data.statusId);

          const droppedOrder =
            acceptColumnDrop === "left" ? previousOrder : nextOrder;
          const newOrder = (droppedOrder + column.order) / 2;

          moveColumnMutation.mutate({ viewId: VIEW_ID, statusId, newOrder });
        }
        setAcceptColumnDrop("none");
      }}
    >
      {acceptColumnDrop !== "none" && (
        <DropPreviewLine
          align="vertical"
          className={clsx(
            acceptColumnDrop === "left" && "left-[-2px]",
            (acceptColumnDrop === "right" || acceptBottomDrop) &&
              "right-[-2px]",
          )}
        />
      )}
      <div
        className={clsx(
          "flex h-full w-[350px] shrink-0 cursor-grab flex-col rounded-lg border border-neutral-700 bg-neutral-900",
        )}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData(
            DRAG_TYPE.column,
            JSON.stringify({ statusId: column.statusId }),
          );
        }}
      >
        <div className="flex items-center justify-between px-4 pb-2 pt-4">
          <div className="flex items-center gap-2">
            <TaskStatusIcon color={column.status.color} />
            <div className="font-bold">{column.status.name}</div>
            <CountBadge count={column.tasks.length} />
          </div>
          <div className="flex items-center">
            <ViewColumnMenuTrigger status={column.status}>
              <button className="grid size-6 place-items-center rounded-md text-neutral-400 transition-colors hover:bg-white/15">
                <MoreHorizontalIcon size={20} />
              </button>
            </ViewColumnMenuTrigger>
          </div>
        </div>
        <div className="px-4 pb-2 text-sm text-neutral-400">
          {column.status.description}
        </div>
        <div
          className={clsx(
            "relative flex grow flex-col overflow-auto scroll-auto p-2",
          )}
        >
          <div
            className="h-full w-full"
            onDragOver={(e) => {
              if (e.dataTransfer.types.includes(DRAG_TYPE.task)) {
                e.preventDefault();
                e.stopPropagation();
                setAcceptCardDrop(true);
              }
            }}
            onDragLeave={() => {
              setAcceptCardDrop(false);
            }}
            onDrop={(e) => {
              if (e.dataTransfer.types.includes(DRAG_TYPE.task)) {
                e.preventDefault();
                e.stopPropagation();
                const data = JSON.parse(e.dataTransfer.getData(DRAG_TYPE.task));
                const taskId = z.string().parse(data.taskId);

                moveTaskMutation.mutate({
                  taskId,
                  statusId: column.statusId,
                  viewId: VIEW_ID,
                  newOrder: column.tasks.length
                    ? column.tasks[column.tasks.length - 1].order + 1
                    : 1,
                });

                setAcceptCardDrop(false);
              }
            }}
          >
            {column.tasks.length === 0 && acceptCardDrop && (
              <DropPreviewLine className="inset-x-2 w-auto" />
            )}
            <AnimatePresence mode="popLayout" initial={false}>
              {column.tasks.map((task, i) => {
                const isTop = i === 0;
                const isBottom = i === column.tasks.length - 1;

                return (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ViewTaskCard
                      task={task}
                      columns={allColumns}
                      onMove={handleMoveTask}
                      onMoveTop={isTop ? undefined : handleMoveTaskTop}
                      onMoveBottom={isBottom ? undefined : handleMoveTaskBottom}
                      onMoveToColumn={onMoveToColumn}
                      previousOrder={
                        column.tasks[i - 1] ? column.tasks[i - 1].order : 0
                      }
                      nextOrder={
                        column.tasks[i + 1]
                          ? column.tasks[i + 1].order
                          : task.order + 1
                      }
                      acceptBottomDrop={isBottom && acceptCardDrop}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
        <div className="grid place-items-center p-2">
          <button
            className="flex w-full items-center gap-1 rounded-md px-4 py-2 text-neutral-300 transition-colors hover:bg-white/15"
            onClick={onClickAddItem}
          >
            <PlusIcon size={16} />
            <span className="text-sm">Add Item</span>
          </button>
        </div>
      </div>
    </div>
  );
};
