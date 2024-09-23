import { useMutation } from "@tanstack/react-query";
import { deleteTask } from "../../_backend/task/api";

export const useDeleteTask = () => {
  return useMutation({
    mutationFn: (taskId: string) => {
      return deleteTask(taskId);
    },
  });
};
