import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateEventInput, updateEvent } from "../_mocks/api";
import { eventsQueryOption } from "./use-events";

export const useUpdateEvent = () => {
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
  });
};
