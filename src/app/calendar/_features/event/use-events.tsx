import { queryOptions } from "@tanstack/react-query";
import { fetchEvents } from "../../_backend/api";
import { usePendingDeleteEvents } from "./use-delete-event";
import { useMswQuery } from "../../../../lib/useMswQuery";

export const eventsQueryOption = queryOptions({
  queryKey: ["events"],
  queryFn: () => {
    return fetchEvents();
  },
});

export const useEvents = () => {
  const { pendingDeleteEventIds } = usePendingDeleteEvents();

  const { data: events = [] } = useMswQuery(eventsQueryOption);

  const filteredEvents = events.filter(
    (e) => !pendingDeleteEventIds.includes(e.id),
  );

  return { events: filteredEvents };
};
