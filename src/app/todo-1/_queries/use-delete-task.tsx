import { useMutation } from "@tanstack/react-query";
import { deleteTask } from "../_backend/api";
import { toast } from "sonner";

export const useDeleteTask = () => {
  return useMutation({
    mutationFn: (id: string) => {
      return deleteTask(id);
    },
    onError: () => {
      toast.error("タスクを削除することができませんでした");
    },
  });
};
