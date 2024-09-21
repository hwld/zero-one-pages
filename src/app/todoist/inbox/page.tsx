"use client";

import { TaskForm } from "../_features/task/task-form";
import { TaskFormOpenButton } from "../_features/task/task-form-open-button";
import { TaskListItem } from "../_features/task/task-list-item";
import { useTasks } from "../_features/task/use-tasks";

const InboxPage: React.FC = () => {
  const { data: tasks = [] } = useTasks();

  const doneTasks = tasks.filter((t) => t.done);
  const undoneTasks = tasks.filter((t) => !t.done);

  return (
    <div className="h-full overflow-auto">
      <div className="sticky top-0 flex h-12 items-center justify-between px-4"></div>
      <div className="mx-auto flex w-full max-w-[800px] flex-col gap-4 px-10">
        <h2 className="text-2xl font-bold">インボックス</h2>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            {undoneTasks.map((t) => {
              return <TaskListItem key={t.id} task={t} />;
            })}
          </div>
          <TaskFormOpenButton />
          <div className="flex flex-col gap-2">
            {doneTasks.map((t) => {
              return <TaskListItem key={t.id} task={t} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InboxPage;
