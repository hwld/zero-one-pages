import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEvent } from "../mocks/api";
import { eventsQueryOption } from "./use-events";
import { useToast } from "../toast";

export const useDeleteEvent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return deleteEvent(id);
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries();
      queryClient.setQueryData(eventsQueryOption.queryKey, (oldEvents) => {
        if (!oldEvents) {
          return undefined;
        }

        return oldEvents.filter((event) => event.id !== deletedId);
      });
    },
    onSuccess: () => {
      toast({ title: "イベントを削除しました" });
    },
  });
};
