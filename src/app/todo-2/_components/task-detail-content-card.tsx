import { IconPencil } from "@tabler/icons-react";
import { Task, useTaskAction } from "../_contexts/tasks-provider";
import { Card } from "./card";
import { useId, useState } from "react";
import { TaskEditForm } from "./task-form/task-edit-form";
import { TaskFormData } from "./task-form/task-form";

export const taskDetailViewClass = {
  wrapper: "flex h-full flex-col gap-2",
  title: "text-xl font-bold p-1 w-full",
  description: "grow p-1 break-all whitespace-pre-wrap w-full h-full",
};

type Props = { task: Task };
export const TaskDetailContentCard: React.FC<Props> = ({ task }) => {
  const { updateTask } = useTaskAction();
  const [isEditing, setIsEditing] = useState(false);
  const editFormId = useId();

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleUpdateTask = (data: TaskFormData) => {
    setIsEditing(false);
    updateTask({
      id: task.id,
      title: data.title,
      description: data.description,
    });
  };

  return (
    <Card>
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex h-[24px] items-center rounded bg-zinc-700 px-2 text-sm text-zinc-400">
            Task Detail
          </div>
          {isEditing ? (
            <div className="flex items-center gap-1">
              <button
                className="flex h-[26px] items-center gap-1 rounded p-2 text-xs text-zinc-100 transition-colors hover:bg-white/20"
                onClick={handleCancelEdit}
              >
                キャンセル
              </button>
              <button
                className="flex h-[26px] items-center gap-1 rounded border border-zinc-500 bg-white/15 p-2 text-xs text-zinc-100 transition-colors hover:bg-white/20"
                form={editFormId}
                type="submit"
              >
                保存する
              </button>
            </div>
          ) : (
            <button
              className="flex h-[26px] items-center gap-1 rounded border border-zinc-500 bg-white/15 p-2 text-xs text-zinc-100 transition-colors hover:bg-white/20"
              onClick={() => setIsEditing(true)}
            >
              <IconPencil size={15} className="mb-[1px]" />
              編集する
            </button>
          )}
        </div>
        {isEditing ? (
          <TaskEditForm
            defaultTask={task}
            formId={editFormId}
            onUpdateTask={handleUpdateTask}
          />
        ) : (
          <div className={taskDetailViewClass.wrapper}>
            <h2 className={taskDetailViewClass.title}>{task.title}</h2>
            <div className={taskDetailViewClass.description}>
              {task.description}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
