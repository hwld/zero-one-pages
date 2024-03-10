import { IconTrash } from "@tabler/icons-react";
import { TaskTableData } from "./data";
import { TaskStatusBadge } from "../task-status-badge";
import {
  Task,
  useTaskAction,
  useTasksData,
} from "../../_contexts/tasks-provider";
import { ConfirmDialog } from "../confirm-dialog";
import { useMemo, useState } from "react";
import { Tooltip } from "../tooltip";
import { format } from "../../_lib/utils";
import { TaskTableCheckbox } from "./checkbox";
import Link from "next/link";

export const TaskTableRow: React.FC<{
  task: Task;
}> = ({ task: { id, title, status, createdAt, completedAt } }) => {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const { selectedTaskIds } = useTasksData();
  const { deleteTask, updateTask, toggleTaskSelection } = useTaskAction();

  const isSelected = useMemo(() => {
    return selectedTaskIds.includes(id);
  }, [id, selectedTaskIds]);

  const handleDelete = () => {
    deleteTask(id);
  };

  const handleChangeStatus = (status: Task["status"]) => {
    updateTask({ id, status });
  };

  return (
    <tr className="border-b border-zinc-600 transition-colors hover:bg-white/5 [&_td:first-child]:pl-5 [&_td:last-child]:pr-5">
      <TaskTableData>
        <TaskTableCheckbox
          checked={isSelected}
          onChange={() => toggleTaskSelection(id)}
        />
      </TaskTableData>
      <TaskTableData noWrap>
        <TaskStatusBadge status={status} onChangeStatus={handleChangeStatus} />
      </TaskTableData>
      <TaskTableData>
        <Link
          // static exportを使うのでpathではなくsearchParamsにidを指定する
          href={`detail?id=${id}`}
          prefetch={false}
          className="hover:text-zinc-50 hover:underline"
        >
          {title}
        </Link>
      </TaskTableData>
      <TaskTableData noWrap>{format(createdAt)}</TaskTableData>
      <TaskTableData noWrap>
        {completedAt ? format(completedAt) : "None"}
      </TaskTableData>
      <TaskTableData>
        <div className="flex gap-2">
          <Tooltip label="削除">
            <button
              className="grid size-[25px] place-items-center rounded text-xs text-zinc-300 transition-colors hover:bg-zinc-500"
              onClick={() => setIsDeleteConfirmOpen(true)}
            >
              <IconTrash size={20} />
            </button>
          </Tooltip>
        </div>
      </TaskTableData>
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        confirmText="削除する"
        title="タスクの削除"
        onConfirm={handleDelete}
      >
        タスク`<span className="font-bold text-zinc-400">{title}</span>
        `を削除しますか？
        <br />
        削除すると、タスクを復元することはできません。
      </ConfirmDialog>
    </tr>
  );
};
