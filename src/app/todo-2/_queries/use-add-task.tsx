import { useMutation } from "@tanstack/react-query";
import { CreateTaskInput, createTask } from "../_backend/api";

export const useAddTask = () => {
  return useMutation({
    mutationFn: (data: CreateTaskInput) => {
      return createTask(data);
    },
  });
};
