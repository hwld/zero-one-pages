import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "../../_backend/task/api";
import { tasksQueryOptions } from "./use-tasks";

export const useDeleteTask = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => {
      return deleteTask(taskId);
    },
    onMutate: async (taskId) => {
      await client.cancelQueries({ queryKey: tasksQueryOptions.queryKey });

      client.setQueryData(tasksQueryOptions.queryKey, (oldTasks) =>
        oldTasks?.filter((t) => t.id !== taskId),
      );
    },
  });
};
