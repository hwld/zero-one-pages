import { BoxSelectIcon } from "lucide-react";
import { TaskListStatusCard } from "./task-list-status-card";

export const EmptyTask: React.FC = () => {
  return (
    <TaskListStatusCard>
      <BoxSelectIcon size={80} />
      <div className="space-y-2 text-center">
        <div className="font-bold">タスクが存在しません</div>
        <div>
          `Ctrl`+`k`または、`Cmd`+`k`を入力すると、
          <br />
          タスクを追加できます
        </div>
      </div>
    </TaskListStatusCard>
  );
};
