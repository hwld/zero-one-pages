"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { TaskDetailModalContent } from "../_features/task/task-detail-modal-content";
import { Routes } from "../routes";
import { AppLayout } from "../_components/app-layout/app-layout";

const TaskPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("id");

  const handleClose = () => {
    router.push(Routes.inbox());
  };

  return (
    <AppLayout title="タスク">
      <div className="rounded-lg border">
        <TaskDetailModalContent taskId={taskId} onClose={handleClose} />
      </div>
    </AppLayout>
  );
};

export default TaskPage;
