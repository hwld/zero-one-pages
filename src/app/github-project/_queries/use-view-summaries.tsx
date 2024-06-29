import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchViewSummaries } from "../_backend/view/api";
import { useMswState } from "@/app/_providers/msw-provider";

export const viewSummariesQueryOption = queryOptions({
  queryKey: ["view-summaries"],
  queryFn: () => {
    return fetchViewSummaries();
  },
});

export const useViewSummaries = () => {
  const { isMockserverUp } = useMswState();

  return useQuery({
    ...viewSummariesQueryOption,
    enabled: isMockserverUp,
  });
};
