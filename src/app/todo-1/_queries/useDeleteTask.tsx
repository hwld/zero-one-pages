import { useMutation } from "@tanstack/react-query";
import { deleteTask } from "../_mocks/api";

export const useDeleteTask = () => {
  return useMutation({
    mutationFn: (id: string) => {
      return deleteTask(id);
    },
  });
};
