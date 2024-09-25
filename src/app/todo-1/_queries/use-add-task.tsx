import { useMutation } from "@tanstack/react-query";
import { CreateTaskInput, createTask } from "../_backend/api";
import { toast } from "sonner";

export const useAddTask = () => {
  return useMutation({
    mutationFn: (input: CreateTaskInput) => {
      return createTask(input);
    },
    onError: () => {
      toast.error("タスクを作成することができませんでした");
    },
  });
};
