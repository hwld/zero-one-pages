import { TaskStatusBadge } from "../task-status-badge";
import { DropdownProvider } from "../dropdown/provider";
import { useState } from "react";
import { DropdownTrigger } from "../dropdown/trigger";
import { DropdownContent } from "../dropdown/content";
import { TaskStatusSelectionMenu } from "../view-task-menu/task-status-selection-menu/menu";
import { ViewColumn } from "../../_mocks/view/api";
import { Task } from "../../_mocks/task/store";
import { useUpdateTask } from "../../_queries/use-update-task";

// TODO: もっと簡単に全Statusを取得したい
// columnじゃなくてTaskStatus[]を受け取れると良いと思う
export const UpdateTaskStatusMenuTrigger: React.FC<{
  allColumns: ViewColumn[];
  task: Task;
}> = ({ allColumns, task }) => {
  const [isOpen, setIsOpen] = useState(false);
  const updateTaskMutation = useUpdateTask();

  const handleUpdateTaskStatus = (statusId: string) => {
    updateTaskMutation.mutate({ ...task, statusId });
  };

  return (
    <DropdownProvider isOpen={isOpen} onOpenChange={setIsOpen}>
      <DropdownTrigger>
        <button
          className="h-full w-full rounded px-2 text-start text-sm transition-colors hover:bg-white/15 disabled:opacity-50"
          disabled={updateTaskMutation.isPending}
        >
          <TaskStatusBadge status={task.status} />
        </button>
      </DropdownTrigger>
      <DropdownContent
        onEscapeKeydown={(e) => {
          e.stopPropagation();
          setIsOpen(false);
        }}
      >
        <TaskStatusSelectionMenu
          columns={allColumns}
          status={task.status}
          onSelect={handleUpdateTaskStatus}
          onClose={() => setIsOpen(false)}
        />
      </DropdownContent>
    </DropdownProvider>
  );
};
