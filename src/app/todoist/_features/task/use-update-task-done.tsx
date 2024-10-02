import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateTaskDoneInput } from "../../_backend/task/schema";
import { updateTaskDone } from "../../_backend/task/api";
import { tasksQueryOptions } from "./use-tasks";
import { taskQueryOptions } from "./use-task";

export const useUpdateTaskDone = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTaskDoneInput & { id: string }) => {
      return updateTaskDone(input);
    },
    onMutate: async (input) => {
      const taskQuery = taskQueryOptions(input.id);

      await Promise.all([
        client.cancelQueries({ queryKey: tasksQueryOptions.queryKey }),
        client.cancelQueries({ queryKey: taskQuery.queryKey }),
      ]);

      client.setQueryData(tasksQueryOptions.queryKey, (oldTasks) =>
        oldTasks?.map((t) => {
          if (t.id === input.id) {
            return { ...t, ...input };
          }
          return t;
        }),
      );

      client.setQueryData(taskQuery.queryKey, (old) => {
        if (!old) {
          return undefined;
        }
        return { ...old, ...input };
      });
    },
  });
};
