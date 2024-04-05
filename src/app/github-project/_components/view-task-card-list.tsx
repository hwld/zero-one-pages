import clsx from "clsx";
import { DropPreviewLine } from "./drop-preview-line";
import { AnimatePresence, motion } from "framer-motion";
import { z } from "zod";
import { DRAG_TYPE, VIEW_ID } from "../consts";
import { ViewTaskCard } from "./view-task-card";
import { useState } from "react";
import { MoveTaskInput, ViewColumn, ViewTask } from "../_mocks/view/api";
import { useMoveTask } from "../_queries/use-move-task";

type Props = {
  tasks: ViewTask[];
  statusId: string;
  allColumns: ViewColumn[];
  onMoveToColumn: (input: { taskId: string; statusId: string }) => void;
};

export const ViewTaskCardList: React.FC<Props> = ({
  tasks,
  statusId,
  allColumns,
  onMoveToColumn,
}) => {
  const [acceptDrop, setAcceptDrop] = useState(false);

  const moveTaskMutation = useMoveTask();

  const handleMoveTask = (data: MoveTaskInput) => {
    moveTaskMutation.mutate({ viewId: VIEW_ID, ...data });
  };
  const handleMoveTaskTop = (input: { taskId: string; statusId: string }) => {
    const topItem = tasks.at(0);
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
    const bottomItem = tasks.at(-1);

    moveTaskMutation.mutate({
      viewId: VIEW_ID,
      taskId: input.taskId,
      statusId: input.statusId,
      newOrder: bottomItem ? bottomItem.order + 0.5 : 1,
    });
  };

  return (
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
            setAcceptDrop(true);
          }
        }}
        onDragLeave={() => {
          setAcceptDrop(false);
        }}
        onDrop={(e) => {
          if (e.dataTransfer.types.includes(DRAG_TYPE.task)) {
            e.preventDefault();
            e.stopPropagation();
            const data = JSON.parse(e.dataTransfer.getData(DRAG_TYPE.task));
            const taskId = z.string().parse(data.taskId);

            moveTaskMutation.mutate({
              taskId,
              statusId: statusId,
              viewId: VIEW_ID,
              newOrder: tasks.length ? tasks[tasks.length - 1].order + 1 : 1,
            });

            setAcceptDrop(false);
          }
        }}
      >
        {tasks.length === 0 && acceptDrop && (
          <DropPreviewLine className="inset-x-2 w-auto" />
        )}
        <AnimatePresence mode="popLayout" initial={false}>
          {tasks.map((task, i) => {
            const isTop = i === 0;
            const isBottom = i === tasks.length - 1;

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
                  previousOrder={tasks[i - 1] ? tasks[i - 1].order : 0}
                  nextOrder={tasks[i + 1] ? tasks[i + 1].order : task.order + 1}
                  acceptBottomDrop={isBottom && acceptDrop}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
