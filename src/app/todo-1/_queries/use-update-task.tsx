import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateTaskInput, updateTask } from "../_backend/api";
import { tasksQueryOptions } from "./use-tasks";
import { toast } from "sonner";
import { taskQueryOptions } from "./use-task";

export const useUpdateTask = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTaskInput & { id: string }) => {
      return updateTask(input);
    },
    onMutate: async (input) => {
      await client.cancelQueries({ queryKey: tasksQueryOptions.queryKey });
      await client.cancelQueries({
        queryKey: taskQueryOptions(input.id).queryKey,
      });

      client.setQueryData(tasksQueryOptions.queryKey, (oldTasks) =>
        oldTasks?.map((t) => {
          if (input.id === t.id) {
            return { ...t, ...input };
          }
          return t;
        }),
      );

      client.setQueryData(taskQueryOptions(input.id).queryKey, (old) => {
        if (!old) {
          return undefined;
        }

        return {
          ...old,
          ...input,
        };
      });
    },
    onError: () => {
      toast.error("タスクの更新に失敗しました");
    },
  });
};
