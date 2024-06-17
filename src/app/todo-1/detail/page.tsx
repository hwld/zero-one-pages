"use client";
import { useAnimate } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useTask } from "../_queries/use-task";
import { TaskDetailSheet } from "../_components/task-detail-sheet/task-detail-sheet";

const DetailModalPage: React.FC = () => {
  const router = useRouter();
  const params = useSearchParams();
  const taskId = z.string().parse(params.get("id"));
  const { data: task } = useTask(taskId);

  const [scope, animate] = useAnimate();
  const handleOpenChange = async (open: boolean) => {
    if (open) {
      return;
    }

    await animate(scope.current, { x: 20, opacity: 0 });
    router.replace("/todo-1");
  };

  // TODO:
  if (!task) {
    return null;
  }

  return (
    <>
      <TaskDetailSheet
        task={task}
        isOpen
        onOpenChange={handleOpenChange}
        ref={scope}
      />
    </>
  );
};

export default DetailModalPage;
