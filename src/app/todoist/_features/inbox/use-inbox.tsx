import { queryOptions, useQuery } from "@tanstack/react-query";
import { useMswState } from "../../../_providers/msw-provider";
import { fetchInbox } from "../../_backend/taskbox/inbox/api";

export const inboxQueryOptions = queryOptions({
  queryKey: ["inbox"],
  queryFn: () => {
    return fetchInbox();
  },
});

export const useInbox = () => {
  const { isMockserverUp } = useMswState();

  return useQuery({
    ...inboxQueryOptions,
    enabled: isMockserverUp,
  });
};
