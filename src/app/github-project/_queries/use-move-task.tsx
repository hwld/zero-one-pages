import { useMutation } from "@tanstack/react-query";
import { MoveTaskInput, moveTask } from "../_mocks/view/api";
import { useToast } from "../_components/toast/use-toast";

export const useMoveTask = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (input: MoveTaskInput & { viewId: string }) => {
      return moveTask(input);
    },
    onError: () => {
      toast({
        variant: "error",
        description:
          "タスクを移動することができませんでした。もう一度試してみてください。",
      });
    },
  });
};
