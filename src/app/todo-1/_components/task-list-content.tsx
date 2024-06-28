import { AnimatePresence, motion } from "framer-motion";
import { EmptyTask } from "./empty-task";
import { ErrorTasks } from "./error-tasks";
import { LoadingTasks } from "./loading-tasks";
import { TaskCard } from "./task-card/task-card";
import { useMemo } from "react";
import { Task } from "../_backend/task-store";
import { UseQueryResult } from "@tanstack/react-query";

type Props = { tasks: Task[]; status: UseQueryResult["status"] };
export const TaskListContent: React.FC<Props> = ({ tasks, status }) => {
  const content = useMemo(() => {
    if (status === "error") {
      return (
        <div className="absolute w-full">
          <ErrorTasks />
        </div>
      );
    }

    if (status === "pending") {
      return (
        <div className="absolute w-full">
          <LoadingTasks />
        </div>
      );
    }

    if (tasks.length === 0) {
      return (
        <div className="absolute w-full">
          <EmptyTask />
        </div>
      );
    }

    return tasks.map((task) => {
      return (
        <motion.div
          key={task.id}
          layout
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <TaskCard key={task.id} task={task} />
        </motion.div>
      );
    });
  }, [tasks, status]);

  return (
    <div className="flex flex-col gap-1">
      <AnimatePresence mode="popLayout" initial={false}>
        {content}
      </AnimatePresence>
    </div>
  );
};
