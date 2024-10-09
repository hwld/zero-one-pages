import type { Task } from "../../_backend/task/model";
import { TaskFormOpenButton } from "../../_features/task/task-form-open-button";
import { TaskListItem } from "../../_features/task/task-list-item/task-list-item";

type Props = { tasks: Task[]; taskboxId: string };

export const AppLayoutTasksContent: React.FC<Props> = ({
  tasks,
  taskboxId,
}) => {
  const doneTasks = tasks.filter((t) => t.done);
  const undoneTasks = tasks.filter((t) => !t.done);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        {undoneTasks?.map((t) => {
          return <TaskListItem key={t.id} task={t} />;
        })}
      </div>
      <TaskFormOpenButton taskboxId={taskboxId} />
      <div className="flex flex-col gap-2">
        {doneTasks?.map((t) => {
          return <TaskListItem key={t.id} task={t} />;
        })}
      </div>
    </div>
  );
};
