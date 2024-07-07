import { BoxSelectIcon } from "lucide-react";
import { TaskListStateCard } from "./task-list-state-card";

export const TaskListEmpty: React.FC = () => {
  return (
    <TaskListStateCard>
      <BoxSelectIcon size={80} />
      <div className="space-y-2 text-center">
        <div className="font-bold">タスクが存在しません</div>
        <div>
          `Ctrl`+`k`または、`Cmd`+`k`を入力すると、
          <br />
          タスクを追加できます
        </div>
      </div>
    </TaskListStateCard>
  );
};
