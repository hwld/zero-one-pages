import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateEventInput, updateEvent } from "../../_backend/api";
import { eventsQueryOption } from "./use-events";
import { useToast } from "../../_components/toast";

export const useUpdateEvent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateEventInput & { id: string }) => {
      return updateEvent(input);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries();
      queryClient.setQueryData(eventsQueryOption.queryKey, (oldEvents) => {
        if (!oldEvents) {
          return undefined;
        }

        return oldEvents.map((event) => {
          if (event.id === variables.id) {
            return variables;
          }
          return event;
        });
      });
    },
    onError: () => {
      toast.error({
        title: "イベントの更新に失敗しました",
        description: "もう一度試しても失敗する場合、画面を更新してみてください",
        actionText: "画面を更新",
        action: () => {
          window.location.reload();
        },
      });
    },
  });
};
