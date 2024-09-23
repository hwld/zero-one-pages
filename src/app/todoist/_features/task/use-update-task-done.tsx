import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateTaskDoneInput } from "../../_backend/task/schema";
import { updateTaskDone } from "../../_backend/task/api";
import { tasksQueryOptions } from "./use-tasks";

export const useUpdateTaskDone = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTaskDoneInput & { id: string }) => {
      return updateTaskDone(input);
    },
    onMutate: async (input) => {
      await client.cancelQueries({ queryKey: tasksQueryOptions.queryKey });

      client.setQueryData(tasksQueryOptions.queryKey, (oldTasks) =>
        oldTasks?.map((t) => {
          if (t.id === input.id) {
            return { ...t, ...input };
          }
          return t;
        }),
      );
    },
  });
};
