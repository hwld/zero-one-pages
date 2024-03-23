"use client";
import { z } from "zod";
import { useTask } from "../_queries/useTask";
import { ActivityIcon, TextIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useUpdateTask } from "../_queries/useUpdateTask";
import { TaskDescriptionForm } from "../_components/task-detail-sheet/task-description-form";
import { TaskStatusBadge } from "../_components/task-status-badge";
import { Card } from "../_components/card";
import Link from "next/link";

export default function Page() {
  const params = useSearchParams();
  const taskId = z.string().parse(params.get("id"));
  const { data: task } = useTask(taskId);
  const updateTaskMutation = useUpdateTask();

  // TODO:
  if (!task) {
    return null;
  }

  return (
    <div className="mx-auto w-[700px] max-w-full space-y-4">
      <div className="flex items-center gap-1 text-sm">
        <Link
          href="/todo-1"
          className="flex h-6 items-center rounded p-1 transition-colors hover:bg-black/5"
        >
          tasks
        </Link>
        <span>/</span>
        <span className="flex h-6 items-center rounded bg-black/5 p-1">
          {task.id}
        </span>
      </div>
      <Card>
        <div className="relative flex h-full w-full flex-col gap-6 overflow-auto rounded-lg p-2">
          <div className="space-y-1">
            <div className="text-xs text-neutral-500">task-title</div>
            <div className="text-2xl font-bold">{task.title}</div>
            <div className="text-xs text-neutral-500">ID: {task.id}</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-sm text-neutral-500">
              <ActivityIcon size={18} />
              <div>状態</div>
            </div>
            <div className="ml-2">
              <TaskStatusBadge
                done={task.done}
                onChangeDone={() => {
                  updateTaskMutation.mutate({
                    ...task,
                    done: !task.done,
                  });
                }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-sm text-neutral-500">
              <TextIcon size={18} />
              <div>説明</div>
            </div>
            <TaskDescriptionForm
              defaultDescription={task.description}
              onChangeDescription={(desc) => {
                updateTaskMutation.mutate({
                  ...task,
                  description: desc,
                });
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
