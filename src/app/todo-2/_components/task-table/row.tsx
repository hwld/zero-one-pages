import { IconPencil, IconTrash } from "@tabler/icons-react";
import { Task } from "../../page";
import { TaskTableData } from "./data";
import { TaskStatusBadge } from "../task-status-badge";
import { useTaskAction } from "../../_contexts/tasks-provider";

export const TaskTableRow: React.FC<{
  task: Task;
}> = ({ task: { id, title, status, createdAt, completedAt } }) => {
  const { deleteTask, updateTask } = useTaskAction();

  const handleDelete = () => {
    deleteTask(id);
  };

  const handleChangeStatus = (status: Task["status"]) => {
    updateTask({ id, status });
  };

  return (
    <tr className="border-b border-zinc-600 transition-colors hover:bg-white/5 [&_td:first-child]:pl-5 [&_td:last-child]:pr-5">
      <TaskTableData noWrap>
        <TaskStatusBadge status={status} onChangeStatus={handleChangeStatus} />
      </TaskTableData>
      <TaskTableData>{title}</TaskTableData>
      <TaskTableData noWrap>{createdAt}</TaskTableData>
      <TaskTableData noWrap>{completedAt || "None"}</TaskTableData>
      <TaskTableData>
        <div className="flex gap-2">
          <button className="grid size-[25px] place-items-center rounded text-xs text-zinc-300 transition-colors hover:bg-zinc-500">
            <IconPencil size={20} />
          </button>
          <button
            className="grid size-[25px] place-items-center rounded text-xs text-zinc-300 transition-colors hover:bg-zinc-500"
            onClick={handleDelete}
          >
            <IconTrash size={20} />
          </button>
        </div>
      </TaskTableData>
    </tr>
  );
};
