import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../../_backend/api";
import { useMswState } from "@/app/_providers/msw-provider";
import { usePendingDeleteEvents } from "./use-delete-event";

export const eventsQueryOption = queryOptions({
  queryKey: ["events"],
  queryFn: () => {
    return fetchEvents();
  },
});

export const useEvents = () => {
  const { pendingDeleteEventIds } = usePendingDeleteEvents();
  const { isMockserverUp } = useMswState();

  const { data: events = [] } = useQuery({
    ...eventsQueryOption,
    enabled: isMockserverUp,
  });

  const filteredEvents = events.filter(
    (e) => !pendingDeleteEventIds.includes(e.id),
  );

  return { events: filteredEvents };
};
