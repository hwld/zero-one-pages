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
import { TaskStatusBadge } from "../task-status-badge";
import { TaskDetailPanelButton } from "./button";
import { TaskDetailPanelMetaRow } from "./meta-row";
import { TaskDetailPanelListButton } from "./list-button";

export const TaskDetailPanelContent: React.FC<{
  taskId: string;
  onClose: () => void;
}> = ({ taskId, onClose }) => {
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
          <div className="col-span-2 border-b border-neutral-600 p-4">
            <div className="flex items-center justify-end gap-2">
              <TaskDetailPanelButton icon={PinIcon} />
              <TaskDetailPanelButton icon={XIcon} onClick={onClose} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{task.title}</h2>
            </div>
          </div>
          <div className="border-r border-neutral-600 p-4"></div>
          <div className="grid grid-rows-[min-content,1fr]">
            <div className="space-y-2 border-b border-neutral-600 p-4">
              <TaskDetailPanelMetaRow label="Assignees">
                <button className="h-full w-full rounded px-2 text-start text-sm text-neutral-400 transition-colors hover:bg-white/15">
                  Add assigness...
                </button>
              </TaskDetailPanelMetaRow>
              <TaskDetailPanelMetaRow label="Status">
                <button className="h-full w-full rounded px-2 text-start text-sm transition-colors hover:bg-white/15">
                  <TaskStatusBadge status={task.status} />
                </button>
              </TaskDetailPanelMetaRow>
            </div>
            <div className="space-y-1 p-4">
              <TaskDetailPanelListButton
                icon={CircleDotIcon}
                label="Convert to issue"
              />
              <TaskDetailPanelListButton
                icon={CopyIcon}
                label="Copy link in project"
              />
              <TaskDetailPanelListButton icon={ArchiveIcon} label="Archive" />
              <TaskDetailPanelListButton
                red
                icon={TrashIcon}
                label="Delete from project"
              />
            </div>
          </div>
        </motion.div>
      );
    }
  })();

  return <AnimatePresence mode="popLayout">{content}</AnimatePresence>;
};
