import { queryOptions } from "@tanstack/react-query";
import { fetchInbox } from "../../_backend/taskbox/inbox/api";
import { useMswQuery } from "../../../../lib/useMswQuery";

export const inboxQueryOptions = queryOptions({
  queryKey: ["inbox"],
  queryFn: () => {
    return fetchInbox();
  },
});

export const useInbox = () => {
  return useMswQuery(inboxQueryOptions);
};
