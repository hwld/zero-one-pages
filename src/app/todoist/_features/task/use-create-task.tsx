import { useMutation } from "@tanstack/react-query";
import type { TaskFormData } from "../../_backend/task/schema";
import { createTask } from "../../_backend/task/api";

export const useCreateTask = () => {
  return useMutation({
    mutationFn: async (input: TaskFormData) => {
      return createTask(input);
    },
  });
};
