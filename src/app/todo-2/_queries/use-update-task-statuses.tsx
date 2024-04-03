import { useMutation } from "@tanstack/react-query";
import { UpdateTaskStatusesInput, updateTaskStatuses } from "../_mocks/api";

export const useUpdateTaskStatuses = () => {
  return useMutation({
    mutationFn: (data: UpdateTaskStatusesInput) => {
      return updateTaskStatuses(data);
    },
  });
};
