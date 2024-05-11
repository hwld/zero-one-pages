import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../_mocks/api";
import { useMswState } from "@/app/_providers/msw-provider";

export const eventsQueryOption = queryOptions({
  queryKey: ["events"],
  queryFn: () => {
    return fetchEvents();
  },
});

export const useEvents = () => {
  const { isMockserverUp } = useMswState();

  return useQuery({
    ...eventsQueryOption,
    enabled: isMockserverUp,
  });
};
