import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateTaskDoneInput } from "../../_backend/task/schema";
import { updateTaskDone } from "../../_backend/task/api";
import { taskQueryOptions } from "./use-task";
import { inboxQueryOptions } from "../inbox/use-inbox";
import { projectQueryOptions } from "../project/use-project";
import type { Task } from "../../_backend/task/model";

export const useUpdateTaskDone = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskboxId: _,
      ...input
    }: UpdateTaskDoneInput & { id: string; taskboxId: string }) => {
      return updateTaskDone(input);
    },
    onMutate: async (input) => {
      const taskQuery = taskQueryOptions(input.id);

      // projectがinboxどちらに入っているかわからないのでどっちも更新してみる
      const projectQuery = projectQueryOptions(input.taskboxId);
      const inboxQuery = inboxQueryOptions;

      await Promise.all([
        client.cancelQueries({ queryKey: taskQuery.queryKey }),
        client.cancelQueries({ queryKey: projectQuery.queryKey }),
        client.cancelQueries({ queryKey: inboxQuery.queryKey }),
      ]);

      client.setQueryData(taskQuery.queryKey, (old) => {
        if (!old) {
          return undefined;
        }
        return { ...old, ...input };
      });

      const updatedTask = (task: Task, newTask: Partial<Task>) => {
        if (task.id === newTask.id) {
          return { ...task, ...newTask };
        }
        return task;
      };

      client.setQueryData(projectQuery.queryKey, (oldProject) => {
        if (!oldProject) {
          return undefined;
        }

        return {
          ...oldProject,
          tasks: oldProject.tasks.map((t) => updatedTask(t, input)),
        };
      });

      client.setQueryData(inboxQueryOptions.queryKey, (oldInbox) => {
        if (!oldInbox) {
          return undefined;
        }

        return {
          ...oldInbox,
          tasks: oldInbox.tasks.map((t) => updatedTask(t, input)),
        };
      });
    },
  });
};
