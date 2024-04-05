import { useMutation } from "@tanstack/react-query";
import { useToast } from "../_components/toast/use-toast";
import { MoveColumnInput, moveColumn } from "../_mocks/view/api";

export const useMoveColumn = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (input: MoveColumnInput & { viewId: string }) => {
      return moveColumn(input);
    },
    onError: () => {
      toast({
        variant: "error",
        description:
          "列を移動することができませんでした。もう一度試してみてください。",
      });
    },
  });
};
