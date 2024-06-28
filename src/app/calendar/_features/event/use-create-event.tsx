import { useMutation } from "@tanstack/react-query";
import { CreateEventInput, createEvent } from "../../_backend/api";
import { useToast } from "../../_components/toast";

export const useCreateEvent = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (input: CreateEventInput) => {
      return createEvent(input);
    },
    onError: () => {
      toast.error({
        title: "イベントの作成に失敗しました",
        description: "もう一度試しても失敗する場合、画面を更新してみてください",
        actionText: "画面を更新",
        action: () => {
          window.location.reload();
        },
      });
    },
  });
};
