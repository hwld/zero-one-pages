import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import {
  CheckIcon,
  PanelRightOpenIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { EditableTaskTitle } from "../editable-task-title";
import { TaskCardButton } from "./task-card-button";
import { TaskDetailSheet } from "../task-detail-sheet/task-detail-sheet";
import { ConfirmTaskDeleteDialog } from "../confirm-task-delete-dialog";
import { Task } from "../../_mocks/task-store";
import { useUpdateTask } from "../../_queries/useUpdateTask";
import { useDeleteTask } from "../../_queries/useDeleteTask";

export const TaskCard: React.FC<{
  task: Task;
}> = ({ task }) => {
  const [editable, setEditable] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const titleInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="just flex w-full items-center justify-between gap-1 rounded-lg border-2 border-neutral-300 bg-neutral-100 p-3 py-2 text-neutral-700">
      <div className="flex w-full items-center gap-2">
        <div className="relative flex h-[25px] w-[25px] shrink-0 cursor-pointer items-center justify-center">
          <AnimatePresence>
            {task.done && (
              <motion.div
                className="absolute inset-0 rounded-full bg-neutral-900"
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: 1.4,
                  opacity: 0,
                }}
              />
            )}
          </AnimatePresence>
          <input
            id={task.id}
            type="checkbox"
            className="peer absolute h-[25px] w-[25px] cursor-pointer appearance-none rounded-full border-2 border-neutral-300"
            checked={task.done}
            onChange={() => {
              updateTaskMutation.mutate({ ...task, done: !task.done });
            }}
          ></input>
          <div
            className={clsx(
              "pointer-events-none absolute inset-0 flex origin-[50%_70%] items-center  justify-center rounded-full bg-neutral-900 text-neutral-100 transition-all duration-200 ease-in-out",
              task.done ? "opacity-100" : "opacity-0",
            )}
          >
            <CheckIcon size="80%" />
          </div>
        </div>
        <EditableTaskTitle
          key={`${task.title}-${editable}`}
          ref={titleInputRef}
          task={task}
          editable={editable}
          onChangeEditable={setEditable}
          onChangeTitle={(title) => {
            updateTaskMutation.mutate({ ...task, title });
          }}
        />
      </div>
      <div className="flex gap-1">
        <TaskCardButton
          icon={<PencilIcon />}
          onClick={() => {
            setEditable((s) => !s);
            setTimeout(() => {
              titleInputRef.current?.focus();
            }, 0);
          }}
        />
        <TaskCardButton
          icon={<PanelRightOpenIcon />}
          onClick={() => setIsDetailOpen(true)}
        />
        <TaskDetailSheet
          task={task}
          isOpen={isDetailOpen}
          onOpenChange={setIsDetailOpen}
        />
        <TaskCardButton
          onClick={() => setIsConfirmDeleteOpen(true)}
          icon={<TrashIcon />}
        />
        <ConfirmTaskDeleteDialog
          task={task}
          isOpen={isConfirmDeleteOpen}
          onOpenChange={setIsConfirmDeleteOpen}
          onConfirm={() => {
            deleteTaskMutation.mutate(task.id);
          }}
        />
      </div>
    </div>
  );
};
