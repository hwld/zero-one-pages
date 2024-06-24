import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircleIcon,
  ArchiveIcon,
  CircleDotIcon,
  CopyIcon,
  PinIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { useTask } from "../../_queries/use-task";
import { LoadingAnimation } from "../loading-animation";
import { Button } from "../button";
import { TaskDetailPanelMetaRow } from "./meta-row";
import { IconButton } from "../icon-button";
import { ListButton } from "../list-button";
import { UpdateTaskStatusMenuTrigger } from "./update-task-status-menu-trigger";
import { TaskTitleSection } from "./task-title-section";
import { TaskCommentSection } from "./task-comment-section";
import { TaskStatus } from "../../_mocks/task-status/store";

export const TaskDetailPanelContent: React.FC<{
  taskId: string;
  allStatus: TaskStatus[];
  onClose: () => void;
}> = ({ allStatus, taskId, onClose }) => {
  const { data: task, status } = useTask(taskId);

  const content = (() => {
    if (status === "pending") {
      return (
        <motion.div
          key="loading"
          className="grid size-full place-content-center place-items-center text-neutral-400"
          exit={{ opacity: 0 }}
        >
          <LoadingAnimation />
        </motion.div>
      );
    } else if (status === "error") {
      return (
        <div className="grid size-full place-content-center place-items-center gap-4 text-red-400">
          <div className="flex flex-col items-center gap-2">
            <AlertCircleIcon size={50} />
            <p className="font-bold">タスクが存在しません</p>
            <p className="text-sm">
              このタスクはすでに削除されているか、URLが間違っている可能性があります。
              <br />
              ※このアプリでは、更新すると作成したすべてのタスクが削除されます。
            </p>
          </div>
          <Button onClick={onClose}>詳細ページを閉じる</Button>
        </div>
      );
    } else if (status === "success") {
      return (
        <motion.div className="grid size-full grid-cols-[1fr,400px] grid-rows-[min-content,1fr]">
          <div className="col-span-2 space-y-2 border-b border-neutral-600 p-4">
            <div className="flex items-center justify-end gap-2">
              <IconButton icon={PinIcon} />
              <IconButton icon={XIcon} onClick={onClose} />
            </div>
            <TaskTitleSection task={task} />
          </div>
          <div className="overflow-auto border-r border-neutral-600 p-4">
            <TaskCommentSection task={task} />
          </div>
          <div className="grid grid-rows-[min-content,1fr]">
            <div className="space-y-2 border-b border-neutral-600 p-4">
              <TaskDetailPanelMetaRow label="Assignees">
                <button className="h-full w-full rounded px-2 text-start text-sm text-neutral-400 transition-colors hover:bg-white/15">
                  Add assigness...
                </button>
              </TaskDetailPanelMetaRow>
              <TaskDetailPanelMetaRow label="Status">
                <UpdateTaskStatusMenuTrigger
                  allStatus={allStatus}
                  task={task}
                />
              </TaskDetailPanelMetaRow>
            </div>
            <div className="space-y-1 p-4">
              <ListButton icon={CircleDotIcon} label="Convert to issue" />
              <ListButton icon={CopyIcon} label="Copy link in project" />
              <ListButton icon={ArchiveIcon} label="Archive" />
              <ListButton red icon={TrashIcon} label="Delete from project" />
            </div>
          </div>
        </motion.div>
      );
    }
  })();

  return <AnimatePresence mode="popLayout">{content}</AnimatePresence>;
};
