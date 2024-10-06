"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { TaskDetailModalContent } from "../../_features/task/task-detail-modal-content";
import { Dialog } from "../../_components/dialog";

// Intercepting RoutesはStatic Exportsじゃ動かないので、dev serverのみで動く
const ModalTaskPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("id");

  const handleClose = () => {
    router.back();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    }
  };

  return (
    <Dialog isOpen onOpenChange={handleOpenChange} width={860}>
      <TaskDetailModalContent taskId={taskId} onClose={handleClose} />
    </Dialog>
  );
};
export default ModalTaskPage;
