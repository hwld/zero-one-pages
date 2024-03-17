import { useMutation } from "@tanstack/react-query";
import { deleteTasks } from "../_mocks/api";

export const useDeleteTasks = () => {
  return useMutation({
    mutationFn: (ids: string[]) => {
      return deleteTasks(ids);
    },
  });
};
