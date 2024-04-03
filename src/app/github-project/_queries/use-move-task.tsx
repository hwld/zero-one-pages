import { useMutation } from "@tanstack/react-query";
import { MoveTaskInput, moveTask } from "../_mocks/view/api";

export const useMoveTask = () => {
  return useMutation({
    mutationFn: (input: MoveTaskInput & { viewId: string }) => {
      return moveTask(input);
    },
  });
};
