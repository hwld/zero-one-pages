import { useMutation } from "@tanstack/react-query";
import type { UpdateTaskDoneInput } from "../../_backend/task/schema";
import { updateTaskDone } from "../../_backend/task/api";

export const useUpdateTaskDone = () => {
  return useMutation({
    mutationFn: (input: UpdateTaskDoneInput & { id: string }) => {
      return updateTaskDone(input);
    },
  });
};
