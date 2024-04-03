import { useMutation } from "@tanstack/react-query";
import { CreateTaskInput, createTask } from "../_mocks/task/api";

export const useCreateTask = () => {
  return useMutation({
    mutationFn: (input: CreateTaskInput) => {
      return createTask(input);
    },
  });
};
