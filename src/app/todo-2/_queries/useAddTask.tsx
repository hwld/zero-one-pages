import { useMutation } from "@tanstack/react-query";
import { CreateTaskInput, createTask } from "../_mocks/api";

export const useAddTask = () => {
  return useMutation({
    mutationFn: (data: CreateTaskInput) => {
      return createTask(data);
    },
  });
};
