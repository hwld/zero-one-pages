"use client";

import { TaskFormOpenButton } from "../_features/task/task-form-open-button";
import { TaskListItem } from "../_features/task/task-list-item";
import { useTasks } from "../_features/task/use-tasks";

const InboxPage: React.FC = () => {
  const { data: tasks = [] } = useTasks();

  const doneTasks = tasks.filter((t) => t.done);
  const undoneTasks = tasks.filter((t) => !t.done);

  return (
    <div className="grid h-full grid-rows-[auto_1fr] justify-items-center overflow-auto">
      <div className="sticky top-0 flex h-12 w-full items-center justify-between px-4"></div>
      <div className="flex w-full justify-center px-[65px]">
        <div className="flex w-full max-w-[800px] flex-col gap-4">
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
    </div>
  );
};

export default InboxPage;
