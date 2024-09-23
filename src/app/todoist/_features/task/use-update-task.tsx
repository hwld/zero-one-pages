import { useMutation } from "@tanstack/react-query";
import { updateTask } from "../../_backend/task/api";
import type { TaskFormData } from "../../_backend/task/schema";

export const useUpdateTask = () => {
  return useMutation({
    mutationFn: (input: TaskFormData & { id: string }) => {
      return updateTask(input);
    },
  });
};
