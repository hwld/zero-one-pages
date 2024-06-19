import { useMutation } from "@tanstack/react-query";
import { deleteTasks } from "../_mocks/api";
import { useTaskTableSelection } from "../_components/task-table/selection-provider";

export const useDeleteTasks = () => {
  const { unselectTaskIds } = useTaskTableSelection();

  return useMutation({
    mutationFn: (ids: string[]) => {
      return deleteTasks(ids);
    },
    onSuccess: (_, ids) => {
      unselectTaskIds(ids);
    },
  });
};
