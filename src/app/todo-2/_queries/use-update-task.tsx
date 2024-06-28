import { useMutation } from "@tanstack/react-query";
import { UpdateTaskInput, updateTask } from "../_backend/api";

export const useUpdateTask = () => {
  return useMutation({
    mutationFn: (data: UpdateTaskInput & { id: string }) => {
      return updateTask(data);
    },
  });
};
