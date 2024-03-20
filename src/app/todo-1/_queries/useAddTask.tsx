import { useMutation } from "@tanstack/react-query";
import { CreateTaskInput, createTask } from "../_mocks/api";

export const useAddTask = () => {
  return useMutation({
    mutationFn: (input: CreateTaskInput) => {
      return createTask(input);
    },
  });
};
