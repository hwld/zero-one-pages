import { IconTrash } from "@tabler/icons-react";
import { TaskTableData } from "./data";
import { TaskStatusBadge } from "../task-status-badge";
import { ConfirmDialog } from "../confirm-dialog";
import { useMemo, useState } from "react";
import { Tooltip } from "../tooltip";
import { format } from "../../_lib/utils";
import { TaskTableCheckbox } from "./checkbox";
import Link from "next/link";
import { useUpdateTask } from "../../_queries/use-update-task";
import { useDeleteTasks } from "../../_queries/use-delete-tasks";
import { Task } from "../../_mocks/task-store";
import { useTaskSelection } from "../../_contexts/task-selection-provider";

export const TaskTableRow: React.FC<{
  task: Task;
}> = ({ task }) => {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const { selectedTaskIds, toggleTaskSelection } = useTaskSelection();
  const deleteTaskMutation = useDeleteTasks();
  const updateTaskMutation = useUpdateTask();

  const isSelected = useMemo(() => {
    return selectedTaskIds.includes(task.id);
  }, [task.id, selectedTaskIds]);

  const handleDelete = () => {
    deleteTaskMutation.mutate([task.id]);
  };

  const handleChangeStatus = (status: Task["status"]) => {
    updateTaskMutation.mutate({ ...task, status });
  };

  return (
    <tr className="border-b border-zinc-600 transition-colors hover:bg-white/5 [&_td:first-child]:pl-5 [&_td:last-child]:pr-5">
      <TaskTableData>
        <TaskTableCheckbox
          checked={isSelected}
          onChange={() => toggleTaskSelection(task.id)}
        />
      </TaskTableData>
      <TaskTableData noWrap>
        <TaskStatusBadge
          status={task.status}
          onChangeStatus={handleChangeStatus}
        />
      </TaskTableData>
      <TaskTableData>
        <Link
          // static exportを使うのでpathではなくsearchParamsにidを指定する
          href={`/todo-2/detail?id=${task.id}`}
          className="hover:text-zinc-50 hover:underline"
        >
          {task.title}
        </Link>
      </TaskTableData>
      <TaskTableData noWrap>{format(task.createdAt)}</TaskTableData>
      <TaskTableData noWrap>
        {task.completedAt ? format(task.completedAt) : "None"}
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
        タスク`<span className="font-bold text-zinc-400">{task.title}</span>
        `を削除しますか？
        <br />
        削除すると、タスクを復元することはできません。
      </ConfirmDialog>
    </tr>
  );
};
