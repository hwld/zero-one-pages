import { useMutation } from "@tanstack/react-query";
import { deleteTasks } from "../_mocks/api";
import { useTaskSelection } from "../_contexts/task-selection-provider";

export const useDeleteTasks = () => {
  const { unselectTaskIds } = useTaskSelection();

  return useMutation({
    mutationFn: (ids: string[]) => {
      return deleteTasks(ids);
    },
    onSuccess: (_, ids) => {
      unselectTaskIds(ids);
    },
  });
};
