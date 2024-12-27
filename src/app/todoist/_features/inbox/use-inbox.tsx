import { queryOptions } from "@tanstack/react-query";
import { fetchInbox } from "../../_backend/taskbox/inbox/api";
import { useQuery } from "@tanstack/react-query";

export const inboxQueryOptions = queryOptions({
  queryKey: ["inbox"],
  queryFn: () => {
    return fetchInbox();
  },
});

export const useInbox = () => {
  return useQuery(inboxQueryOptions);
};
