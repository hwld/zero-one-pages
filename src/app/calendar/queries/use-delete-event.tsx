import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsQueryOption } from "./use-events";
import { useToast } from "../toast";
import { useCallback } from "react";
import { deleteEvent } from "../mocks/api";

// TODO: 削除待機中に新しいイベントなどが作成されてrefetchされると、キャッシュの状態が更新されて
// 削除したイベントが現れてしまう
export const useDeleteEvent = () => {
  const { toast } = useToast();

  const { mutate: deleteEventMutate } = useMutation({
    mutationFn: (id: string) => {
      return deleteEvent(id);
    },
  });

  const queryClient = useQueryClient();
  return useCallback(
    async (id: string) => {
      const queryKey = eventsQueryOption.queryKey;
      await queryClient.cancelQueries({ queryKey });

      const deletedEvent = queryClient
        .getQueryData(eventsQueryOption.queryKey)
        ?.find((e) => e.id === id);

      if (!deletedEvent) {
        return;
      }

      queryClient.setQueryData(queryKey, (oldEvents) => {
        return oldEvents && oldEvents.filter((event) => event.id !== id);
      });

      toast({
        title: "イベントを削除しました",
        actionText: "元に戻す",
        action: ({ close }) => {
          queryClient.setQueryData(queryKey, (oldEvents) => {
            return oldEvents ? [...oldEvents, deletedEvent] : [deletedEvent];
          });
          close({ withoutCallback: true });
        },
        onClose: () => {
          deleteEventMutate(id);
        },
      });
    },
    [deleteEventMutate, queryClient, toast],
  );
};
