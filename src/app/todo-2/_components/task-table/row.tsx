import { IconPencil, IconTrash } from "@tabler/icons-react";
import { Task } from "../../page";
import { TaskTableData } from "./data";
import { TaskStatusBadge } from "../task-status-badge";

export const TaskTableRow: React.FC<{
  task: Task;
  onDeleteTask: (id: string) => void;
  onChangeStatus: (value: Task["status"]) => void;
}> = ({
  task: { id, title, status, createdAt, completedAt },
  onDeleteTask,
  onChangeStatus,
}) => {
  const handleDelete = () => {
    onDeleteTask(id);
  };

  return (
    <tr className="border-b border-gray-600 transition-colors hover:bg-white/5 [&_td:first-child]:pl-5 [&_td:last-child]:pr-5">
      <TaskTableData noWrap>
        <TaskStatusBadge status={status} onChangeStatus={onChangeStatus} />
      </TaskTableData>
      <TaskTableData>{title}</TaskTableData>
      <TaskTableData noWrap>{createdAt}</TaskTableData>
      <TaskTableData noWrap>{completedAt || "None"}</TaskTableData>
      <TaskTableData>
        <div className="flex gap-2">
          <button className="rounded px-2 py-1 text-xs text-gray-300 transition-colors hover:bg-gray-500">
            <IconPencil size={16} />
          </button>
          <button
            className="rounded px-2 py-1  text-xs text-gray-300 transition-colors hover:bg-gray-500"
            onClick={handleDelete}
          >
            <IconTrash size={16} />
          </button>
        </div>
      </TaskTableData>
    </tr>
  );
};
