import { useMutation } from "@tanstack/react-query";
import { CreateTaskInput, createTask } from "../_backend/task/api";
import { useToast } from "../_components/toast/use-toast";

export const useCreateTask = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (input: CreateTaskInput) => {
      return createTask(input);
    },
    onError: () => {
      toast({
        variant: "error",
        description: `タスクを作成することができませんでした。 もう一度試してみてください。`,
      });
    },
  });
};
