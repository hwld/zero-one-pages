import { AnimatePresence, motion } from "framer-motion";
import { useTaskAction, useTasksData } from "../../_contexts/tasks-provider";
import { CircleDotIcon, LucideIcon, Trash2Icon, XIcon } from "lucide-react";
import { ConfirmDialog } from "../confirm-dialog";
import { useState } from "react";

export const TaskSelectionMenu: React.FC = () => {
  const { selectedTaskIds } = useTasksData();
  const { unselectAllTasks, updateTasksStatus, deleteTask } = useTaskAction();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleConfirm = () => {
    selectedTaskIds.forEach(deleteTask);
    setIsDeleteConfirmOpen(false);
  };

  const handleMarkDone = () => {
    updateTasksStatus(selectedTaskIds, "done");
  };

  return (
    <AnimatePresence>
      {selectedTaskIds.length > 0 && (
        <motion.div
          className="fixed inset-x-0 bottom-4 m-auto flex h-[40px]  w-fit items-center gap-2 rounded-lg bg-zinc-300 px-2 text-sm text-zinc-700 shadow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <div className="flex h-[25px] gap-1 overflow-hidden rounded border border-dashed border-zinc-500">
            <div className="flex items-center px-2">
              <span className="mr-[2px] font-bold">
                {selectedTaskIds.length}
              </span>
              selected
            </div>
            <button
              className="grid w-[25px] place-items-center border-l border-dashed border-zinc-500 transition-colors hover:bg-black/5"
              onClick={unselectAllTasks}
            >
              <XIcon size={18} />
            </button>
          </div>

          <TaskSelectionMenuButton
            icon={Trash2Icon}
            label="削除する"
            onClick={() => setIsDeleteConfirmOpen(true)}
          />
          <TaskSelectionMenuButton
            icon={CircleDotIcon}
            label="完了状態にする"
            onClick={handleMarkDone}
          />
          <ConfirmDialog
            isOpen={isDeleteConfirmOpen}
            onOpenChange={setIsDeleteConfirmOpen}
            confirmText="削除する"
            title="選択されたタスクの削除"
            onConfirm={handleConfirm}
          >
            <>
              選択された
              <span className="mx-1 font-bold">{selectedTaskIds.length}</span>
              個のタスクを削除しますか？
              <br />
              一度削除すると、元に戻すことはできません。
            </>
          </ConfirmDialog>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const TaskSelectionMenuButton: React.FC<{
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}> = ({ icon: Icon, label, onClick }) => {
  return (
    <button
      className="flex h-[25px] items-center gap-1 rounded bg-zinc-900 px-2 text-xs text-zinc-100 transition-colors hover:bg-zinc-700"
      onClick={onClick}
    >
      <Icon size={15} />
      <div className="mt-[1px]">{label}</div>
    </button>
  );
};